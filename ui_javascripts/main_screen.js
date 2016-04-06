/* global game_mode */
/* global Game */

//Main Game class creates a new game
//Also starts the game which deals the first round to each player
var game_started = false;
var game_constants = null;
var _game = new Game();
var game_mode = false;

//@continued: bool, true means they are coming back to a saved game
function Main(mode, continued){
	if(game_started == false){
        if(window.localStorage.getItem('settings') == undefined){
            var settings = {
                sort_cards: false,
                sort_type: 'suite'
            }
            window.localStorage.setItem('settings', JSON.stringify(settings));
        }
        game_mode = mode || false;		
		init(_game, function(constants){
            game_constants = constants;
            var round_constants = _game.new_round(game_constants);
            _game.draw_game();
            assign_event_listeners(round_constants, false);
        });
	}else if(continued == false){
        var round_constants = _game.new_round(game_constants);
        _game.draw_game();
        assign_event_listeners(round_constants, false);
    }else if(continued === true){
        _game.draw_game();
        assign_event_listeners(_game.round_constants, true);
    }
}

function init(_game, callback){  
    get_number_of_players_and_names(function(player_names){
        var _constants = _game.initialize_game(player_names.length, player_names);
    
        game_started = true;
        callback(_constants);
    });
}

function assign_event_listeners(round_constants, continued){
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
    if(round_constants.round == 1 || continued){
        player_1.addEventListener('click', named_event_listener, false);
        player_2.addEventListener('click', named_event_listener, false);
        player_3.addEventListener('click', named_event_listener, false);
        player_4.addEventListener('click', named_event_listener, false);
        end_turn.addEventListener('click', named_event_listener, false);
        lay_down.addEventListener('click', named_event_listener, false);
    }
    deck.addEventListener("click", named_event_listener, false);
    discard_pile.addEventListener('click', named_event_listener, false);

}

// This is needed so that I can mass de-assign event listeners when starting a new game, otherwise my event listeners 
// hold on to an old copy of the _game instance
function named_event_listener(event){
    _game.handle_events(event);
}