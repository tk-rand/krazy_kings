//initilize fastclick js
(function(){
    if('addEventListener' in document){
        document.addEventListener('DOMContentLoaded', function(){
            var attachFastClick = Origami.fastclick;
            attachFastClick(document.body);
            window.addEventListener('beforeunload', handle_game_pause, false);
            check_for_saved_game();
        }, false);
    }
})();

function handle_game_pause(event){
    var confirm_message = "\o/";
    var player_length = _game.players.length;
    var game_state = JSON.parse(window.localStorage.getItem('game_state')) || {};
    
    _game.deck.forEach(function(card){
        return stringify_nodes(card);
    });
    
    for(var i = 0; i < player_length; i++){
        _game.players[i].hand.forEach(function(card){
           return stringify_nodes(card); 
        });
    }
    
    _game.round_constants.discard_pile.forEach(function(card){
        return stringify_nodes(card);
    })
    
    game_state = JSON.stringify(_game);
    window.localStorage.setItem('game_state', game_state);
    
    event.preventDefault();
    return confirm_message;
}

function stringify_nodes(card){
    card.display = card.display.outerHTML;
    return card;
}

function create_node_from_string(card){
    var temp_div = document.createElement('div');
    
    temp_div.innerHTML = card.display;
    card.display = temp_div.firstChild;
    
    return card;
}

function check_for_saved_game(){
    if(window.localStorage.getItem('game_state') === null){
        return;
    }
    var continue_button = id('continue_button');

    continue_button.style.display = "block";
}

function continue_game(){
    var game_state = JSON.parse(window.localStorage.getItem('game_state'));
    var player_length = game_state.players.length;
    var player_names = [];
    
    game_state.deck.forEach(function(card){
        return create_node_from_string(card);
    });
    
    for(var i = 0; i < player_length; i++){
        game_state.players[i].hand.forEach(function(card){
            return create_node_from_string(card); 
        });
        player_names.push(game_state.players[i].name);
    }
    
    game_state.round_constants.discard_pile.forEach(function(card){
        return create_node_from_string(card);
    });
    
    if(game_state.players[1].name.indexOf('Man1') !== -1){
        game_mode = true;
    }
    game_constants = _game.initialize_game(player_length, player_names);
    game_started = true;
    _game.deck = [];
    _game.deck = game_state.deck;
    
    for(var j = 0; j < player_length; j++){
        _game.players[j].hand = game_state.players[j].hand;
        _game.players[j].score = game_state.players[j].score;
        _game.players[j].actions_taken = game_state.players[j].actions_taken;
        _game.players[j].has_been_scored = game_state.players[j].has_been_scored;
    }
    
    _game.round_constants.discard_pile = game_state.round_constants.discard_pile;
    _game.round_constants.round = game_state.round_constants.round;
    game_constants.round_instance.round = game_state.round_constants.round;
    _game.round_constants.round_instance = game_constants.round_instance;
    _game.round_constants.deck_instance = game_constants.deck_instance;
    _game.current_wilds = game_state.current_wilds;

    navigation("main_screen");
    Main(game_mode, true);
}