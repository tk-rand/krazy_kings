<<<<<<< HEAD
//Main Game class creates a new game
=======


//Main class creates a new game
>>>>>>> a037bcdcd2f4aef610f16788b0434bf3995c8ce4
//Also starts the game which deals the first round to each player
function Main(){
    var player_names = get_number_of_players_and_player_names();
    var _game = new Game();

    var _constants = _game.initialize_game(player_names.length, player_names);
    var round = _game.new_round(_constants);
    _game.draw_game(round);
    assign_event_listeners(_game);
}

function assign_event_listeners(_game){
    var cards = cls('card');
    var deck = id('playing_deck');

    for(var i = 0; i < cards.length; i++){
        cards[i].addEventListener('click', function(){_game.handle_events(event, _game)}, false);
    }
    deck.addEventListener("click", function(){_game.handle_events(event, _game)}, false);

}

