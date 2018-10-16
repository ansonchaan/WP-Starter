/*
Plugin Name: Advanced AJAX Page Loader
Version: 2.7.1
Plugin URI: http://software.resplace.net/WordPress/AjaxPageLoader.php
Description: Load pages within blog without reloading page, shows loading bar and updates the browsers URL so that the user can bookmark or share the url as if they had loaded a page normally. Also updates there history so they have a track of there browsing habbits on your blog!
Author URI: http://dean.resplace.net
Author: Dean Williams
*/


//checkjQuery = false;
jQueryScriptOutputted = false;

//Content ID
var AAPL_content = 'main';

//Search Class
var AAPL_search_class = 'searchform';

//Ignore List - this is for travisavery who likes my comments... hello
var AAPL_ignore_string = new String('#, /wp-, .pdf, .zip, .rar'); 
var AAPL_ignore = AAPL_ignore_string.split(', ');

//Shall we take care of analytics?
var AAPL_track_analytics = false		
//Various options and settings
var AAPL_scroll_top = true		
//Maybe the script is being a tw**? With this you can find out why...
var AAPL_warnings = false;
		








				






//Set this to true if your getting some javascript problems
var AAPL_reloadDocumentReady = false;

//Dont mess with these...
var AAPL_isLoad = false;
var AAPL_started = false;
var AAPL_searchPath = null;
var AAPL_ua = jQuery.browser;
var loading,loading_rotate;


//The holy grail...
jQuery(document).ready(function() {
	/*if (AAPL_warnings == true) {
		alert("DEBUG MODE! \nThanks for downloading AAPL - you are currently in DEBUG MODE, once you are confident AAPL is working as you require please disable DEBUG MODE from the AAPL options in wordpress.");
	}

	if (AAPL_warnings == true) {
		AAPL_jqVersion = jQuery().jquery;
		if (AAPL_jqVersion.substr(0,3) != "1.8" && AAPL_warnings == true) {
			alert("INFORMATION: \njQuery may be outdated! This plugin was made using 1.8, I can see version: " + AAPL_jqVersion);
		}
	}
*/
	
	AAPL_loadPageInit("");
});


window.onpopstate = function(event) {
	//We now have a smart multi-ignore feature controlled by the admin panel
	if (AAPL_started === true && AAPL_check_ignore(document.location.toString()) == true) {	
		
		var url = document.location.toString();//.split('chapel-of-dawn/');
		if( url.indexOf('about/') >= 0)		toPage = 'about';
		else if( url.indexOf(AAPLhome) >= 0 )			toPage = 'home';
		
		//console.log(toPage);
		
		switch( currentPage ) {
			
			
				
			case 'about' :
				about.beforeChangePage( toPage );
				break;
				
			case 'home' :
				home.beforeChangePage( toPage );
				break;
				
			default :
				break;
			
		}
			
		AAPL_loadPage(document.location.toString(),1);
	}
};

function AAPL_loadPageInit(scope){

	jQuery(document).on('click',scope + "a.page",function( event ){
		// stop default behaviour
		event.preventDefault();
		
		if(!isBrowser('ie') && !isBrowser('ie11') && !ismobile && html.beforeChangeDone){
			html.beforeChangeDone = false;
			
			if( this.href.indexOf('about/') >= 0 )			toPage = 'about';
			else if( this.href.indexOf(AAPLhome) >=0 )			toPage = 'home';
			//if( hasClass( this , 'lang' ) )						toPage = currentPage;

			//if( !hasClass( this , 'lang' ) ){
				if( toPage == currentPage /*
&&
					(toPage != 'works' && currentPage != 'works') 	&& 
					(toPage != 'video' && currentPage != 'video') 	&& 
					(toPage != 'worksfilter' && currentPage != 'worksfilter')	&& 
					(toPage != 'eventsfilter' && currentPage != 'eventsfilter')	&& 
					(toPage != 'press' && currentPage != 'press') 
*/
				){
					console.log('You clicked same page!');
					html.beforeChangeDone = true;
					return false;
				}
			//}
			
			
			$('body').removeClass(currentPage);
			$('body').addClass(toPage);
			
			
			
			
			
			//if($(this).attr('data-page')) toPage = $(this).attr('data-page');
			//if(this.href.indexOf('project'))
			
/*
			TweenMax.set('#cir',{'rotation':0,'drawSVG':'100% 100%'});
			TweenMax.to('#cir',.9,{'rotation':360,'transformOrigin':'center center','repeat':-1,'ease':'Power1.easeInOut'});
			loading = new TimelineMax({'repeat':-1});
			loading.to('#cir',.9,{'drawSVG':'100% 0%','ease':'Power1.easeInOut'},'s');
			loading.to('#cir',.9,{'drawSVG':'0% 0%'});
*/
			
			
			switch( currentPage ) {
				
				case 'about' :
					about.beforeChangePage( toPage );
					break;
					
				case 'home' :
					home.beforeChangePage( toPage );
					break;
					
				default :
					break;
				
			}
			
			
			//if(toPage == 'bookshelf' && currentPage == 'book' ||
			//toPage == 'publications' && currentPage == 'publication') return false;

			
			
			if(!isBrowser('ie')){
				console.log('');
				console.log('Start Ajax');
				console.log('     Current page is ['+currentPage+']');
				console.log('          You are going to ['+toPage+'] page');
			}


			
			//if its not an admin url, or doesnt contain #
			if (this.href.indexOf(AAPLhome) >= 0 && AAPL_check_ignore(this.href) == true){
				// stop default behaviour
				event.preventDefault();
	
				// remove click border
				this.blur();
	
				// get caption: either title or name attribute
				var caption = this.title || this.name || "";
				
				// get rel attribute for image groups
				var group = this.rel || false;
	
				//Load click code - pass reference.
				try {
					AAPL_click_code(this);
				} catch(err) {
					if (AAPL_warnings == true) {
						txt="ERROR: \nThere was an error with click_code.\n";
						txt+="Error description: " + err.message;
						alert(txt);
					}
				}
				
	
				// display the box for the elements href
				AAPL_loadPage(this.href);
				
				
			}
		}
	});
	
	jQuery('.' + AAPL_search_class).each(function(index) {
		if (jQuery(this).attr("action")) {
			//Get the current action so we know where to submit to
			AAPL_searchPath = jQuery(this).attr("action");

			//bind our code to search submit, now we can load everything through ajax :)
			//jQuery('#searchform').name = 'searchform';
			jQuery(this).submit(function() {
				submitSearch(jQuery(this).serialize());
				return false;
			});
		} else {
			if (AAPL_warnings == true) {
				alert("WARNING: \nSearch form found but attribute 'action' missing!?!?! This may mean search form doesn't work with AAPL!");
			}
		}
	});
	
	if (jQuery('.' + AAPL_search_class).attr("action")) {} else {
		if (AAPL_warnings == true) {
			alert("WARNING: \nCould not bind to search form...\nCould not find <form> tag with class='" + AAPL_search_class + "' or action='' missing. This may mean search form doesnt work with AAPL!");
		}
	}
}

function AAPL_loadPage(url, push, getData){

	if (!AAPL_isLoad){
		if (AAPL_scroll_top == true) {
			//Nicer Scroll to top - thanks Bram Perry
			jQuery('html,body').animate({scrollTop: 0}, 1500);
		}
		AAPL_isLoad = true;
		
		//enable onpopstate
		AAPL_started = true;
		
		//AJAX Load page and update address bar url! :)
		//get domain name...
		nohttp = url.replace("http://","").replace("https://","");
		firstsla = nohttp.indexOf("/");
		pathpos = url.indexOf(nohttp);
		path = url.substring(pathpos + firstsla);
		
		//Only do a history state if clicked on the page.
		if (push != 1) {
			//TODO: implement a method for IE
			if (typeof window.history.pushState == "function") {
				var stateObj = { foo: 1000 + Math.random()*1001 };
				history.pushState(stateObj, "ajax page loaded...", path);
			} else {
				if (AAPL_warnings == true) {
					alert("BROWSER COMPATIBILITY: \n'pushState' method not supported in this browser, sorry about that!");
				}
			}
		}
		
		if (!jQuery('#' + AAPL_content)) {
			if (AAPL_warnings == true) {
				alert("ERROR: \nAAPL could not find your content, you need to set an ID to a div that surrounds all the content of the page (excluding menu, heading and footer) - AAPL was looking for id='" + AAPL_content + "'");
				return false;
			}
		}
		
		//start changing the page content.
				jQuery.ajax({
					type: "GET",
					url: url,
					data: getData,
					cache: false,
					dataType: "html",
					success: function(data) {
						AAPL_isLoad = false;
						
						//get title attribute
						datax = data.split('<title>');
						titlesx = data.split('</title>');
						
						if (datax.length == 2 || titlesx.length == 2) {
							data = data.split('<title>')[1];
							titles = data.split('</title>')[0];
							
							//set the title?
							//after several months, I think this is the solution to fix &amp; issues
							jQuery(document).attr('title', (jQuery("<div/>").html(titles).text()));
						} else {
							if (AAPL_warnings == true) {
								alert("WARNING: \nYou seem to have more than one <title> tag on the page, this is going to cause some major problems so page title changing is disabled.");
							}
						}
						
						
						//GET PAGE CONTENT
						data = data.split('id="' + AAPL_content + '"')[1];
						data = data.substring(data.indexOf('>') + 1);
						var depth = 1;
						var output = '';
						
						while(depth > 0) {
							temp = data.split('</div>')[0];
							
							//count occurrences
							i = 0;
							pos = temp.indexOf("<div");
							while (pos != -1) {
								i++;
								pos = temp.indexOf("<div", pos + 1);
							}
							//end count
							depth=depth+i-1;
							output=output+data.split('</div>')[0] + '</div>';
							data = data.substring(data.indexOf('</div>') + 6);
						}
						
						
						
						
						if(!isBrowser('ie'))
							console.log('               Ajax Success!');
						
						

						load_img( output , function(){
							//if(loading) loading.kill();
							//var loading_out = new TimelineMax();
							//loading_out.to('#cir',.9,{'drawSVG':'0% 0%','rotation':'+=360','transformOrigin':'center center','ease':'Power1.easeOut'});
							
							// prevent ajax faster than animation
							if(html.beforeChangeDone){
								html.insert( AAPL_content , output);
								console.log('Got data! Animation has been done. Inserted data to html');
							}
							else{
								html.save(output);
								console.log('Got data! But still on animation...');
							}
						});
						
						
						
						
						
						
						
						
						
						//currentPage = toPage;
					},
					error: function(jqXHR, textStatus, errorThrown) {
						//Would append this, but would not be good if this fired more than once!!
						AAPL_isLoad = false;
						document.title = "Error loading requested page!";
						
						if (AAPL_warnings == true) {
							txt="ERROR: \nThere was an error with AJAX.\n";
							txt+="Error status: " + textStatus + "\n";
							txt+="Error: " + errorThrown;
							alert(txt);
						}
						
						//Nothing like good old pure JavaScript...
						document.getElementById(AAPL_content).innerHTML = AAPL_loading_error_code;
					}
				});
			//});
		//});
	}
}

function submitSearch(param){
	if (!AAPL_isLoad){
		AAPL_loadPage(AAPL_searchPath, 0, param);
	}
}

function AAPL_check_ignore(url) {
	for (var i in AAPL_ignore) {
		if (url.indexOf(AAPL_ignore[i]) >= 0) { 
			return false;
		}
	}
	
	/*___  ____   __   __ _   __   ____   __    __                             
	(  _ \(  __) / _\ (  / ) / _\ (  _ \ /  \  /  \                            
	 ) __/ ) _) /    \ )  ( /    \ ) _ ((  O )(  O )                           
	(__)  (____)\_/\_/(__\_)\_/\_/(____/ \__/  \__/                            
	 ____  __  _  _  ____  ____    ____  __  __ _   __   __    __    _  _  _   
	(  __)(  )( \/ )(  __)(    \  (  __)(  )(  ( \ / _\ (  )  (  )  ( \/ )/ \  
	 ) _)  )(  )  (  ) _)  ) D (   ) _)  )( /    //    \/ (_/\/ (_/\ )  / \_/  
	(__)  (__)(_/\_)(____)(____/  (__)  (__)\_)__)\_/\_/\____/\____/(__/  (_)  
	*/
	
	//AHHHGGRRR!! Long story short, IE is a nightmare and this plagued me for many nights :(
	//The problem was actually down to jQuery, once I decided to replace the code commented out above (labelled peakaboo) with native JS it worked perfectly!

	return true;
}










function AAPL_reload_code() {
//This file is generated from the admin panel - dont edit here! 

}

function AAPL_click_code(thiss) {
//This file is generated from the admin panel - dont edit here! 
// highlight the current menu item
jQuery('ul.menu li').each(function() {
	jQuery(this).removeClass('current-menu-item');
});
jQuery(thiss).parents('li').addClass('current-menu-item');
}

function AAPL_data_code(dataa) {
//This file is generated from the admin panel - dont edit here! 

}












//urls
//var AAPLsiteurl = '';//"http://beta.sans.hk/2015/chapel-of-dawn";
//var AAPLhome = '';//"http://beta.sans.hk/2015/chapel-of-dawn";

//The old code here was RETARDED - Much like the rest of the code... Now I have replaced this with something better ;)
//PRELOADING YEEEYYYYY!!
var AAPLloadingIMG = jQuery('<img/>').attr('src', 'http://beta.sans.hk/2015/chapel-of-dawn/wp-content/uploads/AAPL/loaders/WordPress Ball Spin.gif');
var AAPLloadingDIV = jQuery('<div/>').attr('style', 'display:none;').attr('id', 'ajaxLoadDivElement');
AAPLloadingDIV.appendTo('body');
AAPLloadingIMG.appendTo('#ajaxLoadDivElement');
//My code can either be seen as sexy? Or just a terribly orchestrated hack? Really it's up to you...

//Loading/Error Code
//now using json_encode - two birds one bullet.
var str = "<center>\r\n\t<p style=\"text-align: center !important;\">Loading... Please Wait...<\/p>\r\n\t<p style=\"text-align: center !important;\">\r\n\t\t<img src=\"{loader}\" border=\"0\" alt=\"Loading Image\" title=\"Please Wait...\" \/>\r\n\t<\/p>\r\n<\/center>";
var AAPL_loading_code = str.replace('{loader}', AAPLloadingIMG.attr('src'));
str = "<center>\r\n\t<p style=\"text-align: center !important;\">Error!<\/p>\r\n\t<p style=\"text-align: center !important;\">\r\n\t\t<font color=\"red\">There was a problem and the page didnt load.<\/font>\r\n\t<\/p>\r\n<\/center>";
var AAPL_loading_error_code = str.replace('{loader}', AAPLloadingIMG.attr('src'));
