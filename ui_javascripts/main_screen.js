//Main Game class creates a new game
//Also starts the game which deals the first round to each player
function Main(){
    var player_names = get_number_of_players_and_player_names();
    var _game = new Game();

    var _constants = _game.initialize_game(player_names.length, player_names);
    var round = _game.new_round(_constants);
    _game.draw_game(round);
    assign_event_listeners(_game, round);
    
}

// function handle_turns(_game, number_of_players){
	// if(_game.current_player >= number_of_players-1){
		// _game.current_player = 0;
	// }
// 	
	// var current_player = _game.players[_game.current_player];
// 	
	// if(current_player.actions_taken.length == 2){
		// _game.current_player = _game.current_player + 1;
		// current_player.clear_actions();
		// current_player = _game.players[_game.current_player];
		// alert("It's " + current_player.name + ' turn');
	// }
// }


function assign_event_listeners(_game, round){
    var cards = cls('card');
    var deck = id('playing_deck');
    var discard_pile = id('discard_pile');
    var player_1 = id('player_1_hand');
    var player_2 = id('player_2_hand');
    var player_3 = id('player_3_hand');
    var player_4 = id('player_4_hand');
    var end_turn = id('end_turn');
    var lay_down = id('lay_down');

    for(var i = 0; i < cards.length; i++){
        //cards[i].addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
    }
    deck.addEventListener("click", function(){_game.handle_events(event, _game, round)}, false);
	discard_pile.addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
	player_1.addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
	player_2.addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
	player_3.addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
	player_4.addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
	end_turn.addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
	lay_down.addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
}

