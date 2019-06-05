FrameImpulse = (function() {

    var vendors = ['webkit', 'moz'];

    var r = {};
	var listeners = [], numListeners = 0, toRemove = [], numToRemove;
	var lastTime = 0;

    for(var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { 
            	callback(currTime + timeToCall); 
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

	var run = function(deltaTime) {
		requestAnimationFrame(run);

		if(numListeners == 0) return;
		
		for(var i = 0; i < numListeners; i++) {
			listeners[i].call(deltaTime);
		}

		if(numToRemove > 0) {
			var indexToRemove = [];
			for (var i = listeners.length - 1; i >= 0; i--) {
				for (var j = 0; j < toRemove.length; j++) {
					if (listeners[i] === toRemove[j])
						indexToRemove.push(i);
				};
			};

			for (var i = 0; i < indexToRemove.length; i++) {
				listeners.splice(indexToRemove[i], 1);
			};

			numListeners = listeners.length;
			toRemove = [];
			numToRemove = 0;
		}		
	}

	r.on = function(f) {
		if(listeners.indexOf(f) > -1) { return; }
		listeners.push(f);
		numListeners = listeners.length;
		// console.log("FrameImpulse > new listener > total :", numListeners);
	}

	r.off = function(f) {
		//toRemove.push(f);
		//numToRemove = toRemove.length;
		var i = listeners.indexOf(f);
		if(i == -1) return;
		listeners.splice(i, 1);
		numListeners = listeners.length;
		// console.log("FrameImpulse > scheduled removal > total :", numListeners);
	}

	r.getListeners = function() {
		return listeners;
	}
	
	run();
	return r;

})();











var VirtualScroll = (function(document) {

	var vs = {};

	var numListeners, listeners = [], initialized = false;

	var touchStartX, touchStartY;

	// [ These settings can be customized with the options() function below ]
	// Mutiply the touch action by two making the scroll a bit faster than finger movement
	var touchMult = 2;
	// Firefox on Windows needs a boost, since scrolling is very slow
	var firefoxMult = 15;
	// How many pixels to move with each key press
	var keyStep = 120;
	// General multiplier for all mousehweel including FF
	var mouseMult = 1;

	var bodyTouchAction;

	var hasWheelEvent = 'onwheel' in document;
	var hasMouseWheelEvent = 'onmousewheel' in document;
	var hasTouch = 'ontouchstart' in document;
	var hasKeyDown = 'onkeydown' in document;

	var hasTouchWin = navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1;
	var hasPointer = !!window.navigator.msPointerEnabled;

	var isFirefox = navigator.userAgent.indexOf('Firefox') > -1;

	var event = {
		y: 0,
		x: 0,
		deltaX: 0,
		deltaY: 0,
		originalEvent: null
	};
	
	var k = {
		left : 37,
		right : 39,
		up : 38,
		down : 40,
	}

	vs.on = function(f) {
		if(!initialized) initListeners(); 

		var i = listeners.indexOf(f);
		if(i != -1) return;

		listeners.push(f);
		numListeners = listeners.length;
	}

	/**
	 *	@method options
	 *	@memberof VirtualScroll
	 *	@static
	 *
	 *	@param {Object} opt - object literal containing one or more options from the list above, specified as properties.
	 *
	 *	@description Sets custom parameters to the VirtualScroll (globally). The following options are supported:
	 *
	 *	<ul>
	 *	<li>touchMult (default: 2) - mutiply the touch action to make the scroll a faster/slower than finger movement</li>
	 *	<li>firefoxMult (defailt: 15)- Firefox on Windows needs a boost, since scrolling is very slow</li>
	 *	<li>keyStep (default: 120) - specified how many pixels to move with each key press</li>
	 *	<li>mouseMult (default: 1) - general multiplier for all mousehweel events including FF</li>
	 *	</ul>
	 */
	vs.options = function(opt) {
		keyStep = opt.keyStep || 120;
		firefoxMult = opt.firefoxMult || 15;
		touchMult = opt.touchMult || 2;
		mouseMult = opt.mouseMult || 1;
	}

	vs.off = function(f) {
		var i = listeners.indexOf(f);
		if(i == -1) return;

		listeners.splice(i, 1);
		numListeners = listeners.length;
		if(numListeners <= 0) destroyListeners();
	}

	/**
	 *	@method lockTouch
	 *	@memberof VirtualScroll
	 *	@static
	 *
	 *	@description For VirtualScroll to work on mobile, the default swipe-to-scroll behavior needs to be turned off. 
	 *	This function will take care of that, however it's a failt simple mechanism - see in the source code, linked below.
	 */
	vs.lockTouch = function() {
		document.addEventListener('touchmove', function(e) {
			e.preventDefault();
		});
	}

	var notify = function(e) {
		event.x += event.deltaX;
		event.y += event.deltaY;
		event.originalEvent = e;

		for(var i = 0; i < numListeners; i++) {
			listeners[i](event);
		}
	}

	var onWheel = function(e) {
		// In Chrome and in Firefox (at least the new one)
		event.deltaX = e.wheelDeltaX || e.deltaX * -1;
		event.deltaY = e.wheelDeltaY || e.deltaY * -1;

		// for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad 
		// real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
		if(isFirefox && e.deltaMode == 1) {
			event.deltaX *= firefoxMult;
			event.deltaY *= firefoxMult;
		} 

		event.deltaX *= mouseMult;
		event.deltaY *= mouseMult;

		notify(e);
	}

	var onMouseWheel = function(e) {
		// In Safari, IE and in Chrome if 'wheel' isn't defined
		event.deltaX = (e.wheelDeltaX) ? e.wheelDeltaX : 0;
		event.deltaY = (e.wheelDeltaY) ? e.wheelDeltaY : e.wheelDelta;

		notify(e);	
	}

	var onTouchStart = function(e) {
		var t = (e.targetTouches) ? e.targetTouches[0] : e;
		touchStartX = t.pageX;	
		touchStartY = t.pageY;
	}

	var onTouchMove = function(e) {
		// e.preventDefault(); // < This needs to be managed externally
		var t = (e.targetTouches) ? e.targetTouches[0] : e;

		event.deltaX = (t.pageX - touchStartX) * touchMult;
		event.deltaY = (t.pageY - touchStartY) * touchMult;
		
		touchStartX = t.pageX;
		touchStartY = t.pageY;

		notify(e);
	}

	var onKeyDown = function(e) {
		// 37 left arrow, 38 up arrow, 39 right arrow, 40 down arrow
		event.deltaX = event.deltaY = 0;
		switch(e.keyCode) {
			case k.left:
				event.deltaX = -keyStep;
				break;
			case k.right:
				event.deltaX = keyStep;
				break;
			case k.up:
				event.deltaY = keyStep;
				break;
			case k.down:
				event.deltaY = -keyStep;
				break;
		}

		notify(e);
	}

	var initListeners = function() {
		if(hasWheelEvent) document.addEventListener("wheel", onWheel);
		if(hasMouseWheelEvent) document.addEventListener("mousewheel", onMouseWheel);

		if(hasTouch) {
			document.addEventListener("touchstart", onTouchStart);
			document.addEventListener("touchmove", onTouchMove);
		}
		
		if(hasPointer && hasTouchWin) {
			bodyTouchAction = document.body.style.msTouchAction;
			document.body.style.msTouchAction = "none";
			document.addEventListener("MSPointerDown", onTouchStart, true);
			document.addEventListener("MSPointerMove", onTouchMove, true);
		}

		if(hasKeyDown) document.addEventListener("keydown", onKeyDown);

		initialized = true;
	}

	var destroyListeners = function() {
		if(hasWheelEvent) document.removeEventListener("wheel", onWheel);
		if(hasMouseWheelEvent) document.removeEventListener("mousewheel", onMouseWheel);

		if(hasTouch) {
			document.removeEventListener("touchstart", onTouchStart);
			document.removeEventListener("touchmove", onTouchMove);
		}
		
		if(hasPointer && hasTouchWin) {
			document.body.style.msTouchAction = bodyTouchAction;
			document.removeEventListener("MSPointerDown", onTouchStart, true);
			document.removeEventListener("MSPointerMove", onTouchMove, true);
		}

		if(hasKeyDown) document.removeEventListener("keydown", onKeyDown);

		initialized = false;
	}

	return vs;
})(document);