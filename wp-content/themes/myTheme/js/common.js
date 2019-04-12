/* 	
//
//
//			        _________
//			       /        ||
//			      /         ||
//			     /    ___   ||
//			    /    //    
//			   /    //___  
//			  /             ||
//			 /     ____     ||
//			/____ //   _____||
//		   
//
//         AnsonChan
//		   
//
//   
*/

var _global={}
var baseFontRatio = 16 / 1440;
var fontMultiplier = 0.84375;
var _pointer;


(function(_g){
    _g.CurrentPage = getPageName();
    _g.ToPage = '';
    print('Current Page','#999',_g.CurrentPage);

    var ajax = new Ajax({
        ignorePage:'singlepage,newssinglepage'
    });
    _g.initPage = function(){
        var page = (_g.ToPage)? _g.ToPage : _g.CurrentPage.lvl1;
        if(_pointer) _pointer.refresh();

        // destroy event
        home.destroy();
        
        if(page == 'home'){
            // get specify content from other page
            // ajax.get(url, {data}, get from(id), insert to(id), callback)
            ajax.get(window.location.pathname+'about/',{},'content','featured_about',
                function(){
                    home.initFeaturedAbout();
                }
            );
            home.init();
        }
        else if(page == 'about'){
            about.init();
        }
    }
    _g.initPage();


    var mainWrap = document.querySelector('#scroll');
    if(mainWrap) 
        _g.section = new smoothScroll('#scroll', function(s, y, h) {});
    _g.section.showScrollBar();
    _g.section.on();



     //
    // pointer
    var Pointer = function(){

        var _this = this;

        this.init = function(){
            _this.startHover = false;
            _this.a = document.querySelectorAll('a.page');
            _this.pointer = document.createElement('div');
            _this.circle = document.createElement('div');
            _this.circle.className = 'circle';
            _this.pointer.setAttribute('id','pointer');
            _this.pointer.appendChild(_this.circle);

            _this.initEvent();

            document.body.appendChild(_this.pointer);
        }

        this.initEvent = function(){
            addEvent( document, 'mousemove', function(e){
                if(!isMobile()){
                    var x = e.pageX;
                    var y = e.pageY - window.pageYOffset;
                    if(!_this.startHover){
                        _this.startHover = true;
                        addClass(_this.pointer, 'active');
                        TweenMax.set(_this.pointer,{force3D:true,x:x,y:y});
                    }
                    else
                        TweenMax.to(_this.pointer,.2,{force3D:true,x:x,y:y,ease:Power1.easeOut});
                }
            });
        }

        this.refresh = function(){
            _this.a = document.querySelectorAll('a.page');
            _this.initEvent();
        }

        return{
            init: _this.init,
            refresh: _this.refresh
        }
    }





    //
    // Global scale if > 1440
    //
    var adjustSize = function(){
        var width = window.innerWidth;
        var roundNumber = Math.round(baseFontRatio * width * fontMultiplier);
        if(roundNumber >= 16) //roundNumber = 16;
            document.documentElement.style.fontSize = roundNumber + 'px';
        else
            document.documentElement.style.fontSize = '';
    }

    //
    // Resize
    //
    var resize = function(e){
        adjustSize();
    }
    resize();
    addEvent( window , 'resize' , resize );
    
})(_global);