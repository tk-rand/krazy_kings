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
    var slider = id('ai_level_slider');
    var slide = id('ai_level_bar');
    
    slider.addEventListener('click', change_ai_level, false);
    slide.addEventListener('click', change_ai_level, false);
    
}

function change_ai_level(event){
    var slider = id('ai_level_slider');
    console.log(event);
    //default is easy
    var ai_level = {
        difficulty: 'easy'
    };
    
    if(!window.localStorage.getItem('ai_level')){
        window.localStorage.setItem('ai_level', JSON.stringify(ai_level));
    }else{
        ai_level = JSON.parse(window.localStorage.getItem('ai_level'));
        
    }
    
}
