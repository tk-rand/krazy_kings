


function Game(player_name){
	var _game = new game();
	
	var game_constants = _game.initilize_game(2, player_name);
	
	game_constants = _game.start_game(game_constants);

}