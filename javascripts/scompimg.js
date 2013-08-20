var scompimg = Class.create({
	initialize: function(e, o) {
		this.o = Object.extend({
			btxt:	"Before",
			atxt:	"After",
			duration: 0.25,
			boxTemp:	"<div class='scompimg-dragable'>" +
							"<div class='scompimg-line'></div>" +
							"<div class='scompimg-handle'></div>" +
						"</div>"
		}, o);

		this.o.boxTemp = new Template(this.o.boxTemp);
		
		if(!this.o.width || !this.o.height)
			return false;
		
		e = $(e);
		if(!e) return false;
		
		this.e = e;
		
		this.build();
	},
	build: function() {
		//init images
		this.fimg = new Element('img', {src: this.o.fimg, class: 'scompimg-img fimg'});
		this.simg = new Element('img', {src: this.o.simg, class: 'scompimg-img simg'});
		
		//init elements
		this.div		= new Element ('div', {class: 'scompimg-base'}); //div
		this.contents	= new Element ('div', {class: 'scompimg-contets'}); //div
		this.fdiv		= new Element ('div', {class: 'scompimg-imgc fimg'}).insert({top: this.fimg}); //first
		this.sdiv		= new Element ('div', {class: 'scompimg-imgc simg'}).insert({top: this.simg}); //second
		
		this.links		= new Element ('div', {class: 'scompimg-links clearfix'}).insert({top: new Element('a', {class: 'scompimg-before', href: '#'}).update(this.o.btxt), bottom: new Element('a', {class: 'scompimg-after', href: '#'}).update(this.o.atxt)});
		
		//insert images
		this.contents.insert({top: this.fdiv, bottom: this.sdiv});
		this.e.insert({top: this.div.insert({top: this.contents, bottom: this.links})}).addClassName('sod-scompimg');
		
		
		this.fdiv.insert({after: this.o.boxTemp.evaluate()});
		this.drag = this.fdiv.next('.scompimg-dragable');
		
		//set elements variable
		$(this.div, this.fimg, this.simg, this.fdiv, this.sdiv, this.contents).invoke('setStyle', {width: this.o.width + 'px', height: this.o.height + 'px'});
		// this.fdiv.setStyle({width: 150 + 'px', zIndex: 10});
		this.reSize((this.o.width / 2) - 1, true);
		
		$(this.fdiv, this.sdiv).invoke('observe', 'click', this.changePos.bind(this));
		$(this.links).select('a').invoke('observe', 'click', this.clickOnLinks.bind(this));
		this.drag.observe('mousedown', this.makeItDragable.bind(this));
	},
	makeItDragable: function(e) {
		if (!((e.which && e.which === 1) || (e.button && e.button === 1)) || !Event.isLeftClick(e)) return;
		this.div.addClassName('ondrag');
		var elem = Event.findElement(e);
		var x = e.pageX,
			y = elem.offsetTop;
		
		this.mv = new Event.Handler(document,'mousemove','',this.changePos.bindAsEventListener(this,x,y))
		this.mv.start();
		this.mv.started = true;
		
		if(!this.mudefine) {
			this.mudefine = true;
			document.observe('mouseup', function(){
				this.mv.stop();
				this.mv.started = false;
				this.div.removeClassName('ondrag');
			}.bind(this));
		}
		
		Event.stop(e);
	},
	changePos: function(e) {
		var t = e.pageX - this.div.viewportOffset().left, noEffect = (!Object.isUndefined(this.mv))?this.mv.started?true:false:false;
		if(t <= 0 || t >= this.o.width ) return false;
		this.reSize(t, noEffect);
	},
	clickOnLinks: function(e) {
		e.stop();
		var link = Event.findElement(e);
		if(link.hasClassName('scompimg-before'))
			this.reSize(this.o.width); //fdiv should be 100%
		else
			this.reSize(0); //fdiv should be 0%
	},
	reSize: function(pos, noEffect) {
		if(!noEffect)
			return new Effect.Tween( null, this.fdiv.getWidth(), pos, {duration: this.o.duration, queue:{ position: 'end', scope: 'global', limit: 1}} , function(p){this.fdiv.setStyle({width: p + 'px'}); $(this.drag).setStyle({left: p + 'px'}) }.bind(this) );
		else {
			this.fdiv.setStyle({width: pos + 'px'}); $(this.drag).setStyle({left: pos + 'px'})
		}
	}
});