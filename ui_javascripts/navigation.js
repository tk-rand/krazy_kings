var screen_index = 'home_screen';

function navigation(screen_name){
	var new_screen = screen_name.getAttribute('value');
    if(new_screen !== null){
        id(screen_index).style.display = 'none';
        id(new_screen).style.display = 'block';
    }
    screen_index = new_screen;

    if(screen_index =='main_screen' ){
       Main();
    }

    if(screen_index == 'home_screen'){
    	if(game_started !== false){
    	    game_started = false;
    	    _game.undraw_game();
    	    remove_event_listeners();
    	    delete(game_constants);
            delete(_game);
            game_constants = null;
            _game = new Game();   
    	};
    }
}

function remove_event_listeners(){
    var deck = id('playing_deck');
    var discard_pile = id('discard_pile');
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

