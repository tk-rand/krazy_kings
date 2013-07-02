//game class
function game(){
    //num of players and name of players must be same,
    //pass computer 1, computer 2, etc... for computer players
    this.initialize_game = function(num_of_players, name_of_players){
        var deck_instance = new deck;
        var round_instance = new round;
        var players = []
        for(var i = 0; i< num_of_players; i++){
            players[i] = new player;
            players[i].name = name_of_players[i];

        }
        var _deck = deck_instance.build_deck();

        return 	{'deck_instance': deck_instance, 'round_instance': round_instance, 'deck': _deck, 'players': players};
    }

    this.new_round = function(game_constants){
        var _deck_instance = game_constants.deck_instance;
        var _deck = game_constants.deck;
        var _round = game_constants.round || 0;
        var _round_instance = game_constants.round_instance;
        var _players = game_constants.players;
        var _discard_pile = {};
        var deal_return = [];

        _deck = _deck_instance.shuffle(_deck);
        _round = _round_instance.get_round(_round);

        for(var i = 0; i < _players.length; i++){
            if(i == 0){
                deal_return	= _players[i].deal(_deck, _round);
            }else{
                deal_return = _players[i].deal(deal_return.deck_ref, _round);
            }
            _players[i].hand = deal_return.hand;
        }
        //turn over the first card of the game
        //this will always be the zero index of the discard pile
        _discard_pile[0] = deal_return.deck_ref.pop();

        return {'players': _players, 'deck': deal_return.deck_ref, 'round_instance': _round_instance, 'round': _round, 'deck_instance': _deck_instance, 'discard_pile': _discard_pile};
    }
}


function round() {
    this.get_round = function(cur_round){
        return ++cur_round;
    }
}

