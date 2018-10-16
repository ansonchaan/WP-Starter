var Home = function(){

    var init = function(){
        print('Initiated Main Home Page','green');
    }

    var initFeaturedAbout = function(){
        print('Initiated Featured About','green');
    }
    
    return{
        init: init,
        initFeaturedAbout: initFeaturedAbout
    }
}

var home = new Home();