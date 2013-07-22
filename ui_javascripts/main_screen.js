//Main Game class creates a new game
//Also starts the game which deals the first round to each player
function Game(){
    var player_names = get_number_of_players_and_player_names();
    var _game = new game();

    var _constants = _game.initialize_game(player_names.length, player_names);
    var round = _game.new_round(_constants);
    draw_game(round);
}

function draw_game(round_constants){

    var screen = document.getElementById("main_screen");
    var deck_area = document.getElementById("deck_and_discard");
    var player_1_area = document.getElementById("player_1_hand");
    var player_2_area = document.getElementById("player_2_hand");
    var player_3_area = document.getElementById("player_3_hand");
    var player_4_area = document.getElementById("player_4_hand");

    var _deck = document.createElement('div');

    _deck.setAttribute("id", 'playing_deck');
    _deck.setAttribute('class', "cards back");

    deck_area.appendChild(_deck);

    //TODO This needs to be cleaned up I am sure there is a better way to determine how many hands need to be shown.
    for (var i = 0; i< round_constants.round + 2; i++){
        player_1_area.innerHTML += round_constants.players[0].hand[i].display;
        player_2_area.innerHTML += round_constants.players[1].hand[i].display;
        if(round_constants.players.length > 2){
            player_3_area.innerHTML += round_constants.players[2].hand[i].display;
            if(round_constants.players.length > 3){
                player_4_area.innerHTML += round_constants.players[3].hand[i].display;
            }
        }
    }
}


