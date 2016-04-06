var screen_index = 'home_screen';

function navigation(screen_name){
    var new_screen = typeof screen_name !== "string" ? screen_name.getAttribute('value') : screen_name;
	
    if(new_screen !== null){
        id(screen_index).style.display = 'none';
        id(new_screen).style.display = 'block';
    }
    screen_index = new_screen;

    if(screen_index == 'main_screen' && game_started === false){
        var game_type = screen_name.getAttribute('id');
        if(game_type === 'hot_seat_mode'){
            Main();
        }else{
            Main(true);
        }
    }

    if(screen_index == 'home_screen'){
    	if(game_started !== false){
            end_game();
    	};
    }
}

function remove_event_listeners(){
    var player_1 = id('player_1_hand');
    var player_2 = id('player_2_hand');
    var player_3 = id('player_3_hand');
    var player_4 = id('player_4_hand');
    var end_turn = id('end_turn');
    var lay_down = id('lay_down');
    
    player_1.removeEventListener('click', named_event_listener, false);
    player_2.removeEventListener('click', named_event_listener, false);
    player_3.removeEventListener('click', named_event_listener, false);
    player_4.removeEventListener('click', named_event_listener, false);
    end_turn.removeEventListener('click', named_event_listener, false);
    lay_down.removeEventListener('click', named_event_listener, false);

}

function end_game(){
    var continue_button = id('continue_button');
    game_started = false;
    _game.undraw_game();
    remove_event_listeners();
    game_constants = null;
    window.localStorage.removeItem('game_state');
    continue_button.style.display = "none";
    _game = new Game();   
}

