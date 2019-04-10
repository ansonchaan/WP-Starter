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


(function(_g){
    _g.CurrentPage = getPageName();
    _g.ToPage = '';
    print('Current Page','#999',_g.CurrentPage);

    var ajax = new Ajax({
        ignorePage:'singlepage,newssinglepage'
    });
    _g.initPage = function(){
        var page = (_g.ToPage)? _g.ToPage : _g.CurrentPage.lvl1;
        
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