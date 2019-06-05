var Home = function(){

    var init = function(){
        print('Initiated Main Home Page','green');

        addEvent(window, 'resize', resize);
        resize();
    }

    var initFeaturedAbout = function(){
        print('Initiated Featured About','green');
    }

    var resize = function(){
    }
    
    var destroy = function(){
        window.removeEventListener('resize', resize);
    }
    
    return{
        init: init,
        initFeaturedAbout: initFeaturedAbout,
        destroy: destroy
    }
}

var home = new Home();