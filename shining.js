(function($) {
  $.shining = function() {
    $.shining.slides = {
      get length()      { return this._slides.length },
      get current()     { return (typeof this._current == 'undefined' ? this._slides[0] : this._slides[this._current]) },
      set current(_new) { return this._current = this._slides.indexOf(_new) },
      get all()         { return this._slides },
      get first()       { return this._slides[0] },
      get last()        { return this._slides[this._slides.length - 1] },
      get next()        { return this._slides[ this._slides.indexOf(this.current) + 1 ] },
      get previous()    { return this._slides[ this._slides.indexOf(this.current) - 1 ] },
      add: function(slides) { return Array.prototype.push.apply(this._slides, slides) },
      _slides: [],
      _current: 0
    };

    String.prototype.markup = function() { return this + '.html' };
    String.prototype.script = function() { return this + '.js' };

    $.extend($.shining, {
      firstSlide:     function() { return getSlide($.shining.slides.first) },
      lastSlide:      function() { return getSlide($.shining.slides.last ) },
      nextSlide:      function() { return getSlide($.shining.slides.next) },
      previousSlide:  function() { return getSlide($.shining.slides.previous) }
    });

    function init()         {
      $(document).ready(function() {
        $('#controls').approach({
          opacity: 1
        }, 300);
        $('#controls #first').    click(function() { $.shining.firstSlide() });
        $('#controls #previous'). click(function() { $.shining.previousSlide() });
        $('#controls #next').     click(function() { $.shining.nextSlide() });
        $('#controls #last').     click(function() { $.shining.lastSlide() });
        $(document).              click(function() { $.shining.nextSlide() });
      });
      fetchSlides(function() { getSlide($.shining.slides.current) });
    }

    // helpers
    function slide(name)  { return 'slides/' + name }

    function fetchSlides(callback) {
      $.getJSON('slides.json', function(slides) {
        $.shining.slides.add(slides);
        callback.call();
      });
    }

    function getSlide(name) {
      if (!name) return false;
      $('#stage').load(
        slide(name).markup(),
        function(data) {
          $.shining.slides.current = name;
          if (data) $.get(slide(name).script(), function(script) { with($.shining.context) { eval(script) } });
        }
      );
    }

    init();
  }

  // gives slide scripts a context for execution
  $.shining.context = $.noop;
  with ($.shining.context) {
    this.at            = function(seconds, method) { setTimeout(method, parseInt(seconds) * 1000) };
    this.nextSlide     = function() { $.shining.nextSlide() };
    this.previousSlide = function() { $.shining.previousSlide() };
  }

  // boots!
  $.shining();
})(jQuery);


/*
 * jQuery Approach 1.01
 * https://github.com/srobbin/jquery-approach/
 *
 * A plugin that lets you animate based on radial distance from an object.
 *
 * Copyright (c) 2009 Scott Robbin (srobbin.com)
 * Dual licensed under the MIT and GPL licenses.
 */
(function(c){c.fn.approach=function(g,k,j){var f={interval:50,distance:400},e,h=[];if(k){c.extend(f,{distance:k})}this.each(function(m,o){var n=[],l=["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","color","outlineColor"];c.each(g,function(p,r){var t,s,q;if(c.inArray(p,l)>-1&&c.fx.step[p]){t={number:b(c(o).css(p))};s={number:b(r)}}else{if(p=="opacity"&&!jQuery.support.opacity){opacity=c(o).css("filter").match(/opacity=(\d+)/)?RegExp.$1/100:"";opacity=opacity===""?"1":opacity;t=d(opacity);s=d(r)}else{t=d(c(o).css(p)),s=d(r)}}if(t&&s){if(s.relative){s.number=((s.relative=="-="?-1:1)*s.number)+t.number}q=s.unit||"";n.push({name:p,from:t.number,to:s.number,unit:q})}});c(o).data("jquery-approach",n);h.push(o)});c(document).bind("mousemove",function(l){var m=new Date().getTime();if(m-e<f.interval){return}e=m;c.each(h,function(){var o=this,n=i(o),r=parseInt(Math.sqrt(Math.pow(l.pageX-n.x,2)+Math.pow(l.pageY-n.y,2))),p=(f.distance-r)/f.distance,q={};c.each(c(o).data("jquery-approach"),function(){var u=this,t,s;if(c.isArray(u.to)){s=(r>f.distance)?u.from:c.map(u.from,function(x,w){return parseInt((p*(u.to[w]-u.from[w]))+u.from[w])});t="rgb("+s.join(",")+")"}else{t=(r>f.distance)?u.from:(p*(u.to-u.from))+u.from;t+=u.unit}q[u.name]=t});c(o).animate(q,f.interval-1)})});function i(l){var m=c(l).offset();return{x:m.left+(c(l).width()/2),y:m.top+(c(l).height()/2)}}function d(p){var o=p.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),n,m,l;if(o){n=o[1];m=parseFloat(o[2]);l=o[3]}return{relative:n,number:m,unit:l}}if(j){j()}return this};function b(e){var d;if(e&&e.constructor==Array&&e.length==3){return e}if(d=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(e)){return[parseInt(d[1],10),parseInt(d[2],10),parseInt(d[3],10)]}if(d=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(e)){return[parseFloat(d[1])*2.55,parseFloat(d[2])*2.55,parseFloat(d[3])*2.55]}if(d=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(e)){return[parseInt(d[1],16),parseInt(d[2],16),parseInt(d[3],16)]}if(d=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(e)){return[parseInt(d[1]+d[1],16),parseInt(d[2]+d[2],16),parseInt(d[3]+d[3],16)]}if(d=/rgba\(0, 0, 0, 0\)/.exec(e)){return a.transparent}return a[c.trim(e).toLowerCase()]}var a={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]}})(jQuery);