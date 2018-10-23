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
	
	// Grab both red boxes
    var elem = document.querySelector(elem);

    // Check how much we can scroll. This value is the 
    // height of the scrollable element minus the height of the widow
    var elemHeight = elem.getBoundingClientRect().height - window.innerHeight;

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

        // Create the CSS transform string
        //
        // alternativly: use WebKitCSSMatrix, 
        // though it doesn't seem to be any faster 
        // http://jsperf.com/webkitcssmatrix-vs-translate3d
        
        // Apply CSS style
        setTranslate( elem , currentX.toFixed(4) +'px' , currentY.toFixed(4) +'px' , 0+'px' );
		
		refresh();

        if( scrollFunc )
        	scrollFunc( currentY / elemHeight , currentY , elemHeight );
		
    }
    
    var reset = function(){
	    currentY = 0;
	    targetY = 0;
    }
    
    var refresh = function() {
		if(elem.parentNode != null) 
			elemHeight = elem.getBoundingClientRect().height - elem.parentNode.offsetHeight;
	}
	
	var isOn = false;
	var on = function(){
		isOn = true;
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
				setTranslate( elem , 0+'px' , 0+'px' , 0+'px' );
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
		on: on,
		off: off
	}
}



//
// Load all img from HTML String
//
var load_img = function( html , completeFunc ){
	var parser = new DOMParser();
	var output_html = parser.parseFromString(html, "text/html");
	var imgs = output_html.querySelectorAll('img');
	var lth = imgs.length;
	var done = 0;
	
	if(imgs.length){
		for( var i=0; i<lth; i++ ) {
			var _this = imgs[i];
			var src = _this.getAttribute('src');
			var img = new Image();
			img.src = src;
			
			if ( img.complete && img.width+img.height > 0 ) {
				//console.log('already loaded');
				done++;
				if(isAllDone(done,lth)){
					if(completeFunc) completeFunc();
				}
			}
			else{
				img.onload = function() {
					done++;
					if(isAllDone(done,lth)){
						if(completeFunc) completeFunc();
					}
					//console.log('loaded image');
				}
			}
		}
	}
	else{
		if(completeFunc) completeFunc();
	}
}
var isAllDone = function( idx , lth ){
	if( idx >= lth )
		return true;
	else
		return false;
}


var print = function(state, color, text){
	var text = (typeof text == 'object')? JSON.stringify(text) : text || '';
	return console.log('%c'+state+'%c %s','color:white;background:'+color+';padding:3px 4px 2px 3px;border-radius:3px;','',text);
}





//
// init Ajax
//
var mainWrapId = '#main_wrap';
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
            data = temp.querySelector('#'+getFrom).outerHTML;
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
		}else{
			elem = main;

			// add "hide" class after ajax
			var temp = document.createElement('div');
            temp.innerHTML = html;
			addClass(temp.querySelector(mainWrapId),'hide');
			html = temp.innerHTML;
		}

        to = null;
        elem.innerHTML = html;
        initEventToAtag(elem);
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