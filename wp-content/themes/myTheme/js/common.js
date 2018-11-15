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



var md = new MobileDetect(window.navigator.userAgent);
var CurrentPage,ToPage,initPage,section;


(function(){
    CurrentPage = getPageName();
    ToPage = '';
    print('Current Page','#999',CurrentPage);

    var ajax = new Ajax();
    initPage = function(){
        var page = (ToPage)? ToPage : CurrentPage;
        
        if(page == 'home'){
            // get specify content from other page
            // ajax.get(url, get from(id), insert to(id), callback)
            ajax.get(window.location.pathname+'about/','content','featured_about',
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
    initPage();


    var mainWrap = document.querySelector('#scroll');
    if(mainWrap) 
        section = new smoothScroll('#scroll', function(s, y, h) {});
    section.on();
})();


(function(){
    //
    // Resize
    //
    var resize = function(e){
        md = new MobileDetect(window.navigator.userAgent);
    }
    resize();
    addEvent( window , 'resize' , resize );
})();