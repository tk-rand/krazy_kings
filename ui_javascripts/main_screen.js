//Main Game class creates a new game
//Also starts the game which deals the first round to each player
var game_started = false;
var game_constants = null;
var _game = new Game();
function Main(){
	if(game_started == false){		
		game_constants = init(_game);
	}
	var round_constants = _game.new_round(game_constants);
    _game.draw_game();
    assign_event_listeners(round_constants);

    //this stops it from returning to the handle events function in the game class
    //important because it will return to the old reference of round_constants if
    //it's not stopped.
    event.stopPropagation();
}

function init(_game){
	var player_names = get_number_of_players_and_player_names();
	var _constants = _game.initialize_game(player_names.length, player_names);
    
    game_started = true;
    return _constants;
}


function assign_event_listeners(round_constants){
    var deck = id('playing_deck');
    var discard_pile = id('discard_pile');
    var player_1 = id('player_1_hand');
    var player_2 = id('player_2_hand');
    var player_3 = id('player_3_hand');
    var player_4 = id('player_4_hand');
    var end_turn = id('end_turn');
    var lay_down = id('lay_down');

    //these only need to be assigned once, but the deck and discard pile are recreated every round so need new
    //listeners attached to them.
    if(round_constants.round == 1){
        player_1.addEventListener('click', named_event_listener, false);
        player_2.addEventListener('click', named_event_listener, false);
        player_3.addEventListener('click', named_event_listener, false);
        player_4.addEventListener('click', named_event_listener, false);
        end_turn.addEventListener('click', named_event_listener, false);
        lay_down.addEventListener('click', named_event_listener, false);
    }
    deck.addEventListener("click", function(){_game.handle_events(event);}, false);
    discard_pile.addEventListener('click', function(){_game.handle_events(event);}, false);

}

// This is needed so that I can mass de-assign event listeners when starting a new game, otherwise my event listeners 
// hold on to an old copy of the _game instance
function named_event_listener(event){
    _game.handle_events(event);
}

