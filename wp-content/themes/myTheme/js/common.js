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








var CurrentPage = getPageName();
var ToPage = '';
print('Current Page','#999',CurrentPage);

var ajax = new Ajax();
var initPage = function(){
    var page = (ToPage)? ToPage : CurrentPage;
    
    if(page == 'home'){
        // get specify content from other page
        // ajax.get(url, get from(id), insert to(id), callback)
        ajax.get('/wpstarter/about/','content','featured_about',
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



// var scroll_wrap = document.getElementById('scroll_wrap');
// if(scroll_wrap) var section = smoothScroll('#scroll_wrap', function(s, y, h) {});



//
// Resize
//
var resize = function(e){

}
resize();
addEvent( window , 'resize' , resize );