var screen_index = 'home_screen';

function navigation(screen_name){
	var new_screen = screen_name.getAttribute('value');
    if(new_screen !== null){
        id(screen_index).style.display = 'none';
        id(new_screen).style.display = 'block';
    }
    screen_index = new_screen;

    if(screen_index =='main_screen' ){
       var current_game_instance = Main();
    }

}