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

function assign_event_listeners(_game, round){
    var cards = cls('card');
    var deck = id('playing_deck');
    var discard_pile = id('discard_pile');
    var player_1 = id('player_1_hand');
    var player_2 = id('player_2_hand');
    var player_3 = id('player_3_hand');
    var player_4 = id('player_4_hand');

    for(var i = 0; i < cards.length; i++){
        //cards[i].addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
    }
    deck.addEventListener("click", function(){_game.handle_events(event, _game, round)}, false);
	discard_pile.addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
	player_1.addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
	player_2.addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
	player_3.addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
	player_4.addEventListener('click', function(){_game.handle_events(event, _game, round)}, false);
}

