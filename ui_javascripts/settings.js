/* global id */

window.onload = function(){
    add_settings_listeners();
    add_main_screen_sort_listener();
    add_ai_level_settings_listener();
    
    //sets setting to what is in local storage if they have already been set
    if(window.localStorage.getItem('settings')){
        var sort_toggle = id('sort_toggle');
        var sort_type = id('sort_type_toggle');
        var settings = window.localStorage.getItem('settings');
        settings = JSON.parse(settings);
        
        if(settings.sort_cards){
            var event = new Event('change');
            sort_toggle.checked = true;
            sort_toggle.dispatchEvent(event);
            
            if(settings.sort_type === 'value'){
                sort_type.checked = true;
                sort_type.dispatchEvent(event);
            }
        }
    }
    if(window.localStorage.getItem('ai_level')){
        var slider = id('ai_level_slider');
        var ai_level = JSON.parse(window.localStorage.getItem('ai_level'));
        switch(ai_level.difficulty){
            case 'easy':{
                slider.style.marginLeft = "0px";
                break;
            }
            case 'medium':{
                slider.style.marginLeft = "100px";
                break;
            }
            case 'hard':{
                slider.style.marginLeft = "204px";
                break;
            }
            default:{
                slider.style.marginLeft = '0px';
                break;
            }
        }
    }
};

function add_settings_listeners(){
    var sort_toggle = id('sort_toggle');
    var sort_type = id('sort_type_toggle');
    var type_container = id('sort_type_toggle_container');
    var settings = {
        sort_cards: false,
        sort_type: 'suite'
    };
    sort_toggle.addEventListener('change', function(e){
        if(e.srcElement.checked){
            settings.sort_cards = true;
            type_container.style.display = 'block';
        }else{
            settings.sort_cards = false;
            type_container.style.display = 'none';    
        }
        window.localStorage.setItem('settings', JSON.stringify(settings));    
    });
    
    sort_type.addEventListener('change', function(e){
       if(e.srcElement.checked){
           settings.sort_type = 'value';
       } else{
           settings.sort_type = 'suite';
       }
       window.localStorage.setItem('settings', JSON.stringify(settings));
    });
}

function add_main_screen_sort_listener(){
    var sort_button = id('sort_player_cards');
    
    sort_button.addEventListener('click', function(){
        var settings = JSON.parse(window.localStorage.getItem('settings'));
        
        if(settings.sort_type === 'value'){
            settings.sort_type = 'suite';
        }else{
            settings.sort_type = 'value';
        }
        window.localStorage.setItem('settings', JSON.stringify(settings));
        
        _game.players[_game.current_player].sort_player_cards();
        _game.draw_current_players_hand();        
    });
}

function add_ai_level_settings_listener(){
    var slide = id('ai_level_bar');
    
    slide.addEventListener('click', change_ai_level, false);
    
}

function change_ai_level(event){
    var slider = id('ai_level_slider');

    var bar_width = event.srcElement.clientWidth;
    var medium_pos = Math.floor(parseInt(bar_width / 2, 10) - 25); //25 is half the width of the slider element
    var hard_pos = Math.floor(parseInt(bar_width - 50, 10)); //50 is width of slider element
    var easy_click_area = Math.floor(parseFloat(bar_width * 0.33));
    var hard_click_area = bar_width - easy_click_area;
    var ai_level = {};
    
    if(window.localStorage.getItem("ai_level") !== undefined){
        ai_level = JSON.parse(window.localStorage.getItem("ai_level"));
    }else{
        //default to easy
        ai_level = {
            difficulty: "easy"
        };
        
    }
    
    if(event.offsetX < easy_click_area){
        slider.style.marginLeft = '0px';
    }else if(event.offsetX >= easy_click_area && event.offsetX < hard_click_area){
        ai_level.difficulty = "medium";
        slider.style.marginLeft = medium_pos + "px";
    }else{
        ai_level.difficulty = "hard";
        slider.style.marginLeft = hard_pos + "px";
    }
    window.localStorage.setItem("ai_level", JSON.stringify(ai_level));
}
