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



//
// init Ajax
//
var getPageName = function(){
    var page = window.location.pathname.split('/').filter(Boolean)[1];
    return (page)? page : 'home';
}
var Ajax = function(){
    var ignoreString = ['#','/wp-','.pdf','.zip','.rar'];
    var main = document.querySelector('main');

    var onClick = function(event, _this){
        event.preventDefault();

        var href = _this.href;

        print('Current Page','#adad25',getPageName());
        updateURL(href);
        runAjax(href);
    }

    var initEventToAtag = function(elem){
        var a = elem.querySelectorAll('a.page');
        for(var i=0; a[i]; i++){
            addEvent(a[i], 'click', function(event){
                onClick(event, this);
            });
        }
    }

    var runAjax = function(href,getFrom,insertTo,onComplete){
        if(checkIgnoreString(href)){
            print('Start Ajax','#59bb59');
            print('Going to','#59bb59',getPageName());
            axios
                .get(href)
                .then(function(response){
                    print('Ajax Success','green');

                    var data = response.data,
                        html = getPageContent(data,getFrom);

                    if(!getFrom)
                        updateSiteTitle(data);
                    insertHTML(html,insertTo);

                    if(onComplete) onComplete();
                })
                .catch(function(error){
                    print(error.message,'red',error.stack);
                });
        }
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

    var getPageContent = function(data,getFrom){
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
        nohttp = href.replace("http://","").replace("https://","");
        firstsla = nohttp.indexOf("/");
        pathpos = href.indexOf(nohttp);
        path = href.substring(pathpos + firstsla);

        if (typeof window.history.pushState == "function") {
            var stateObj = { foo: 1000 + Math.random()*1001 };
            history.pushState(stateObj,'ajax', path);
        }
    }

    var insertHTML = function(html,insertTo){
        var elem;
        var _e = document.querySelector('#'+insertTo);

        if(_e)
            elem = _e;
        else
            elem = main;

        elem.innerHTML = html;
        initEventToAtag(elem);
    }

    var a = document.querySelectorAll('a.page');
    for(var i=0; a[i]; i++){
        addEvent(a[i], 'click', function(event){
            onClick(event, this);
        });
    }

    return{
        get: runAjax
    }
}




var CurrentPage = getPageName();

var ajax = new Ajax();
if(CurrentPage == 'home'){
    ajax.get('/wpstarter/about/','content','featured_about',function(){console.log(1233)}); // url, get from(id), insert to(id), callback
}
else if(CurrentPage == 'about'){
}



// var scroll_wrap = document.getElementById('scroll_wrap');
// if(scroll_wrap) var section = smoothScroll('#scroll_wrap', function(s, y, h) {});


//
//
//		Resize
//
//
var resize = function(e){

}
resize();
addEvent( window , 'resize' , resize );