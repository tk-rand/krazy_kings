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
    	    delete(game_constants);
            delete(_game);
            game_constants = null;
            _game = new Game();   
    	};    	

    }

}