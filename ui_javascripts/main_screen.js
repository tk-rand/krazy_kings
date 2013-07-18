

//Main Game class creates a new game
//Also starts the game which deals the first round to each player
function Game(){
    var player_names = get_number_of_players_and_player_names();
    var _game = new game();

    var _constants = _game.initialize_game(player_names.length, player_names);
    var round = _game.new_round(_constants);
    draw_game(round.round);
}

function draw_game(round_num){
    var screen = document.getElementById("main_screen");
    var deck_area = document.getElementById("deck_and_discard");
    var player_1_area = document.getElementById("player_1_hand");
    var player_2_area = document.getElementById("player_2_hand");
    var player_3_area = document.getElementById("player_3_hand");
    var player_4_area = document.getElementById("player_4_hand");

    var _deck = document.createElement('div');

    _deck.setAttribute("id", 'playing_deck');
    _deck.setAttribute('class', "card back");

    deck_area.appendChild(_deck);
}


