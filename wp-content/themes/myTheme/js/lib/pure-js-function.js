//
// Async loading
//
var loadScript = function(src, callback)
{
	var s,
		r,
		t;
		r = false;
	s = document.createElement('script');
	s.type = 'text/javascript';
	s.src = src;
	s.onload = s.onreadystatechange = function() {
		//console.log( this.readyState ); //uncomment this line to see which ready states are called.
		if ( !r && (!this.readyState || this.readyState == 'complete') )
		{
			r = true;
			callback();
		}
	};
	t = document.getElementsByTagName('script')[0];
	t.parentNode.insertBefore(s, t);
}



//
// Random
//
var random = function( min , max , isRound ){
	var ran = (Math.random() * (max - min)) + min;
	if(isRound)
		return Math.round(ran);
	else
		return ran;
}




//
// Add, Remove and Has Class
//
var hasClass = function(el, className){
	if(el.classList)
		return el.classList.contains(className)
	else
		return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

var  addClass = function(el, className){
	if(el.classList)
		el.classList.add(className)
	else if(!hasClass(el, className)) el.className += " " + className
}

var removeClass = function(el, className){
	var isNodelist = (typeof el.length != 'undefined' && typeof el.item != 'undefined')
	if(isNodelist){
		var els = el;

		for(var i=0; els[i]; i++){
			if(els[i].classList)
				els[i].classList.remove(className)
			else if(hasClass(els[i], className)){
				var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
				els[i].className=els[i].className.replace(reg, ' ')
			}
		}
	}
	else{
		if(el.classList)
			el.classList.remove(className)
		else if(hasClass(el, className)){
			var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
			el.className=el.className.replace(reg, ' ')
		}
	}
}



//
// Add and Remove Event
//
var addEvent = function( obj , type , callback ){
    if (obj == null || typeof(obj) == 'undefined') return;

    if (obj.addEventListener)
        obj.addEventListener(type, callback, false);
    else if (obj.attachEvent)
        obj.attachEvent("on" + type, callback);
    else 
        obj["on"+type] = callback;
}
var removeEvent = function( obj , type , func ){
    if(obj.removeEventListener)
		obj.removeEventListener( type , func , false );
}





var setTranslate = function(elem, x, y, z) {
    elem.style.webkitTransform = 'translate3d(' + x + ',' + y + ',' + z + ')';
    elem.style.msTransform = 'translate3d(' + x + ',' + y + ',' + z + ')';
	elem.style.transform = 'translate3d(' + x + ',' + y + ',' + z + ')';
}


//
//  Virtual Scroll
//
var smoothScroll = function(elem, scrollFunc){
	
	var _this = this;

	// Grab both red boxes
    this.elem = document.querySelector(elem);

    // Check how much we can scroll. This value is the 
	// height of the scrollable element minus the height of the widow
	var fullElemHeight = this.elem.getBoundingClientRect().height;
    var elemHeight = this.elem.getBoundingClientRect().height - window.innerHeight;

    // Add easing to the scroll. Play with this value to find a setting that you like.
    var ease = 0.1;
    var mult = .7;
	
    // Store current scroll position
    var targetX = 0, targetY = 0;
    var currentX = 0, currentY = 0;
    
    var onScroll = function(e) {
	    
        // Accumulate delta value on each scroll event
        targetY += e.deltaY * mult;
		targetX += e.deltaX * mult;
        
        // Clamp the value so it doesn't go too far up or down
        // The value needs to be between 0 and -elemHeight
        targetY = Math.max(-elemHeight, targetY);
        targetY = Math.min(0, targetY);
    }
    
    var onAnim = function() {
        // Make sure this works across different browsers (use the shim or something)

        // Get closer to the target value at each frame, using ease. 
        // Other easing methods are also ok.
        currentY += (targetY - currentY) * ease;

        // Uncomment this line to scroll horizontally
        // currentX += (targetX - currentX) * ease;
        
        // Apply CSS style
        setTranslate( _this.elem , currentX.toFixed(4) +'px' , currentY.toFixed(4) +'px' , 0+'px' );
		
		refresh();

        if( scrollFunc )
			scrollFunc( currentY / elemHeight , currentY , elemHeight );
		
		if(fullElemHeight > window.innerHeight)
			rePositionScrollBar(currentY);

		lazyLoad.checkAndShowImg();
	}
	
	var initScrollBar = function(){
		_this.oldMouseY = 0;
		_this.scrollBarWrap = document.createElement('div');
		_this.scrollBar = document.createElement('div');

		_this.scrollBarWrap.setAttribute('id','scrollBarWrap');
		_this.scrollBar.setAttribute('id','scrollBar');

		addEvent(_this.scrollBar, 'mousedown', onMouseDownScrollBar);
		addEvent(document, 'mousemove', onMoveScrollBar);
		addEvent(document, 'mouseup', onMouseUpScrollBar);

		_this.scrollBarWrap.appendChild(_this.scrollBar);
		_this.elem.appendChild(_this.scrollBarWrap);
	}

	var rePositionScrollBar = function(y){
		var scrollBarHeight = (1-(elemHeight/fullElemHeight))*100;
		_this.scrollBar.style.height = scrollBarHeight + '%';
		_this.scrollBarY = (window.innerHeight - _this.scrollBar.offsetHeight) * (y/elemHeight);

		setTranslate( _this.scrollBarWrap , 0+'px' , (-y.toFixed(4)) +'px' , 0+'px' );
		setTranslate( _this.scrollBar , 0+'px' , (-_this.scrollBarY.toFixed(4)) +'px' , 0+'px' );
	}

	var onMouseDownScrollBar = function(e){
		e.preventDefault();
		_this.oldMouseY = e.pageY;
		_this.clickedScrollBar = true;
		addClass(this, 'active');
	}

	var onMoveScrollBar = function(e){
		if(_this.clickedScrollBar){
			var y = _this.oldMouseY - e.pageY;
			targetY += y * 4;

			targetY = Math.max(-elemHeight, targetY);
			targetY = Math.min(0, targetY);

			_this.oldMouseY = e.pageY;
		}
	}

	var onMouseUpScrollBar = function(){
		_this.clickedScrollBar = false;
		removeClass(_this.scrollBar, 'active');
	}


    var reset = function(){
	    currentY = 0;
	    targetY = 0;
    }
    
    var refresh = function() {
		if(_this.elem.parentNode != null){
			fullElemHeight = _this.elem.getBoundingClientRect().height;
			elemHeight = _this.elem.getBoundingClientRect().height - _this.elem.parentNode.offsetHeight;

			if(fullElemHeight > window.innerHeight){
				if(hasClass(_this.scrollBarWrap,'hide'))
					removeClass(_this.scrollBarWrap, 'hide');
			}
			else{
				if(!hasClass(_this.scrollBarWrap,'hide'))
					addClass(_this.scrollBarWrap, 'hide');
			}
		}
	}

	var to = function(y){
		targetY = y;
	}
	var set = function(y){
		currentY = currentY + y;
		targetY = currentY;
		setTranslate( _this.elem , 0+'px' , y+'px' , 0+'px' );
		
		setTimeout(function(){idx = section_num;},200);
	}

	var isOn = false;
	var on = function(){
		isOn = true;
		initScrollBar();
		refresh();
		VirtualScroll.on(onScroll);
		FrameImpulse.on(onAnim);
	}
	
	var off = function(){
		isOn = false;
		VirtualScroll.off(onScroll);
		FrameImpulse.off(onAnim);
		window.removeEventListener("resize", refresh);
	}
	
	var onResize = function(){
		if( ismobile ){ 
			if(isOn){
				off();
				setTranslate( _this.elem , 0+'px' , 0+'px' , 0+'px' );
			}
		}
		else{
			if(!isOn){
				reset();
				on();
			}
		}
	}
	
	return {
		reset: reset,
		refresh: refresh,
		onResize: onResize,
		set: set,
		to: to,
		on: on,
		off: off
	}
}



//
// Load all img from HTML String
//
var LazyLoad = function(){

	var _this = this;

	var init = function(){
		_this.imgs = document.querySelectorAll('[data-src]');
		checkAndShowImg();
	}

	var checkAndShowImg = function(){
		for(var i=0; _this.imgs[i]; i++){
			var _img = _this.imgs[i];
			var offsetTop = _img.getBoundingClientRect().top - window.innerHeight - (window.innerHeight/2);
			if( offsetTop <= 0 && !hasClass(_img,'inited') && !hasClass(_img,'loaded')){
				(function(){
					var __img = _img;
					var src = __img.getAttribute('data-src');
					// var img = new Image();
					
					// addClass(__img,'inited');

					// img.onload = function(){
						if(__img.tagName == 'DIV')
							__img.style.backgroundImage = 'url('+src+')';
						else
							__img.setAttribute('src',src);

						// removeClass(__img,'inited');
						addClass(__img,'loaded');
					// }
					// img.src = src;
				})();
			}
		}
	}

	return{
		init: init,
		checkAndShowImg: checkAndShowImg
	}
}
var lazyLoad = new LazyLoad();
lazyLoad.init();

// var load_img = function( html , completeFunc ){
// 	var parser = new DOMParser();
// 	var output_html = parser.parseFromString(html, "text/html");
// 	var imgs = output_html.querySelectorAll('img');
// 	var lth = imgs.length;
// 	var done = 0;
	
// 	if(imgs.length){
// 		for( var i=0; i<lth; i++ ) {
// 			var _this = imgs[i];
// 			var src = _this.getAttribute('src');
// 			var img = new Image();
// 			img.src = src;
			
// 			if ( img.complete && img.width+img.height > 0 ) {
// 				//console.log('already loaded');
// 				done++;
// 				if(isAllDone(done,lth)){
// 					if(completeFunc) completeFunc();
// 				}
// 			}
// 			else{
// 				img.onload = function() {
// 					done++;
// 					if(isAllDone(done,lth)){
// 						if(completeFunc) completeFunc();
// 					}
// 					//console.log('loaded image');
// 				}
// 			}
// 		}
// 	}
// 	else{
// 		if(completeFunc) completeFunc();
// 	}
// }
// var isAllDone = function( idx , lth ){
// 	if( idx >= lth )
// 		return true;
// 	else
// 		return false;
// }


var print = function(state, color, text){
	var text = (typeof text == 'object')? JSON.stringify(text) : text || '';
	return console.log('%c'+state+'%c %s','color:white;background:'+color+';padding:3px 4px 2px 3px;border-radius:3px;','',text);
}





//
// init Ajax
//
var mainWrapId = '#mainWrap';
var getPageName = function(){
    var page = window.location.pathname.split('/').filter(Boolean)[1];
    return (page)? page : 'home';
}
var Ajax = function(){
    var ignoreString = ['#','/wp-','.pdf','.zip','.rar'];
    var main = document.querySelector('main');
    var done = true;

	var initEventToAtag = function(elem){
        var a = elem.querySelectorAll('a.page');
        for(var i=0; a[i]; i++){
            addEvent(a[i], 'click', function(event){
                onClick(event, this.href);
            });
        }
    }
	initEventToAtag(document);
    
    var onClick = function(event, href){
        event.preventDefault();

        print('','','');
		print('Current Page','#999',CurrentPage);
		
		updateURL(href);

        ToPage = getPageName();
		print('Going to','#999',ToPage);

		runAjax(href);
	}


    var runAjax = function(href, getFrom, insertTo, callback){
        if(checkIgnoreString(href)){
			var ignoreDetection = getFrom && insertTo;

            if(checkIfSamePage(ignoreDetection)){
                if(!ignoreDetection) done = false;

				print('Start Ajax','#999',href);
				
				onAnimBeforeAjax(getFrom,function(){
					axios
						.get(href)
						.then(function(response){
							print('Ajax Success','green');
							CurrentPage = getPageName();

							var data = response.data,
								html = getPageContent(data,getFrom);

							if(!getFrom)
								updateSiteTitle(data);
							insertHTML(html,insertTo);

							onAnimAfterAjax();

							if(callback) callback();
							if(!done){
								done = true;
								initPage();
							}
						})
						.catch(function(error){
							print(error.message,'red',error.stack);
						});
				});
            }
        }
	}
	
	var onAnimBeforeAjax = function(getFrom, func){
		if(!getFrom)
			TweenMax.to(mainWrapId,.3,{autoAlpha:0,
				onComplete:function(){
					func();
				}
			});
		else
			func();
	}

	var onAnimAfterAjax = function(){
        TweenMax.to(mainWrapId,.3,{autoAlpha:1});
	}

    var checkIfSamePage = function(ignore){
		if(!ignore){
			if(CurrentPage == ToPage){
				print('Page Detection','red', 'Clicked a Same Page!');
				return false;
			}
		}

        return true;
    }

    var checkIgnoreString = function(url){
        for(var i=0; ignoreString[i]; i++){
            if (url.indexOf(ignoreString[i]) >= 0) {
                print('Ignore URL','red',url);
                return false;
            }
		}
		
        return true;
    }

    var getPageContent = function(data, getFrom){
        if(!getFrom)
            data = data.split('<main>')[1].split('</main>')[0];
        else{
            var temp = document.createElement('div');
            temp.innerHTML = data;
            data = temp.querySelector('#'+getFrom).innerHTML;
            temp = null;
        }

        return data;
    }

    var getSiteTitle = function(data){
        data = data.split('<title>')[1].split('</title>')[0];
        return data;
    }
    var updateSiteTitle = function(data){
        document.querySelector('title').innerHTML = getSiteTitle(data);
    }

    var updateURL = function(href){
        var nohttp = href.replace("http://","").replace("https://","");
        var firstsla = nohttp.indexOf("/");
        var pathpos = href.indexOf(nohttp);
        var path = href.substring(pathpos + firstsla);

        if (typeof window.history.pushState == "function") {
            var stateObj = { foo: 1000 + Math.random()*1001 };
            history.pushState(stateObj,'ajax', path);
        }
    }

    var insertHTML = function(html, insertTo){
        var elem,
            to = document.querySelector('#'+insertTo);

        if(to){
			elem = to;
        	elem.insertAdjacentHTML('beforeend', html);
			to = null;
		}else{
			elem = main;

			// add "hide" class after ajax
			var temp = document.createElement('div');
            temp.innerHTML = html;
			addClass(temp.querySelector(mainWrapId),'hide');
			html = temp.innerHTML;
			elem.innerHTML = html;
		}

		initEventToAtag(elem);
		lazyLoad.init();
	}
	
	window.onpopstate = function(event) {
		var url = document.location.toString();
		print('Back to','black',url);
		onClick(event,url);
	}


    return{
		get: runAjax
    }
}