//Game class
function Game(){
    this.current_player = 0;
    this.players = [];
    //num of players and name of players must be same,
    //pass computer 1, computer 2, etc... for computer players
    this.initialize_game = function(num_of_players, name_of_players){
        var deck_instance = new deck;
        var round_instance = new round;
        for(var i = 0; i< num_of_players; i++){
            this.players[i] = new player;
            this.players[i].name = name_of_players[i];

        }
        var _deck = deck_instance.build_deck();

        return 	{'deck_instance': deck_instance, 'round_instance': round_instance, 'deck': _deck};
    }

    this.new_round = function(game_constants){
        var _deck_instance = game_constants.deck_instance;
        var _deck = game_constants.deck;
        var _round = game_constants.round || 0;
        var _round_instance = game_constants.round_instance;
        var _discard_pile = [];
        var deal_return = [];

        _deck = _deck_instance.shuffle(_deck);
        _round = _round_instance.get_round(_round);

        for(var i = 0; i < this.players.length; i++){
            if(i == 0){
                deal_return	= this.players[i].deal(_deck, _round);
            }else{
                deal_return = this.players[i].deal(deal_return.deck_ref, _round);
            }
            this.players[i].hand = deal_return.hand;
        }
        //turn over the first card of the game
        //this will always be the zero index of the discard pile
        _discard_pile[0] = deal_return.deck_ref.pop();

        return {'deck': deal_return.deck_ref, 'round_instance': _round_instance, 'round': _round, 'deck_instance': _deck_instance, 'discard_pile': _discard_pile};
    }

    this.update_current_player = function(){
        this.current_player++;
    }

}


function round() {
    this.get_round = function(cur_round){
        return ++cur_round;
    }
}

Game.prototype.draw_game = function(round_constants){

    var screen = id("main_screen");
    var deck_area = id("deck_and_discard");
    var player_1_area = id("player_1_hand");
    var player_2_area = id("player_2_hand");
    var player_3_area = id("player_3_hand");
    var player_4_area = id("player_4_hand");

    var _deck = document.createElement('div');

    _deck.setAttribute("id", 'playing_deck');
    _deck.setAttribute('class', "cards back");
    _deck.setAttribute('data-element', 'deck')

    deck_area.appendChild(_deck);
    deck_area.innerHTML += round_constants.discard_pile[round_constants.discard_pile.length - 1].display;

    //TODO This needs to be cleaned up I am sure there is a better way to determine how many hands need to be shown.
    for (var i = 0; i< round_constants.round + 2; i++){
        player_1_area.innerHTML += this.players[0].hand[i].display;
        player_2_area.innerHTML += this.players[1].hand[i].display;
        if(this.players.length > 2){
            player_3_area.innerHTML += this.players[2].hand[i].display;
            if(this.players.length > 3){
                player_4_area.innerHTML += this.players[3].hand[i].display;
            }
        }
    }
}

Game.prototype.handle_events = function(){
    console.log(this)
    if(this.players[this.current_player].can_player_move(event.target)){

    }
}