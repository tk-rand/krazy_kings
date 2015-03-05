
//computer ai class
//computer is a subclass of player
function Computer(){
    Player.apply();

    this.card_values = {
        1: 100, //1 is the value assigned to Joker, which is always wild.
        3: 75,
        4: 70,
        5: 65,
        6: 60,
        7: 55,
        8: 50,
        9: 45,
        10: 40,
        11: 35,
        12: 30,
        13: 25
    };
    this.doubles = 85;
    this.partial_runs = 80;
}

Computer.prototype.initial_hand_value = function(round_constants){
    var initial_hand_points = 0;
    this.wild_card_value = round_constants.round + 2; //add 2 cause round starts at one but card values start at 3

    //make whatever card that is wild this round worth 100
    this.card_values[this.wild_card_value] = 100;

    for(var c in this.hand){
        if(this.hand.hasOwnProperty(c)){
            initial_hand_points += this.card_values[this.hand[c].value];
        }
    }
    return initial_hand_points;
};

Computer.prototype.calculate_new_hand_value = function(hand){

};

Computer.prototype.decide_what_to_draw = function(initial_hand_points, round_constants) {
    var temp_hand_with_discard_card = {};
    var temp_hand_with_deck_card = {};
    var _this = this;
    var sets_and_runs = {};
    var possible_discards = {};
    var temp_hand = {};

    //vars for the discard pile and the deck pile
    var dc_pile_length = round_constants.discard_pile.length;
    var top_card_on_dc_pile = round_constants.discard_pile[dc_pile_length - 1];
    var deck_length = _game.deck.length;
    var top_card_on_deck = _game.deck[deck_length - 1];

    this.hand.forEach(function (card) {
        temp_hand_with_discard_card.push(card);
        temp_hand_with_deck_card.push(card);
    });
    temp_hand_with_discard_card.push(top_card_on_dc_pile);

    this.create_partial_sets_runs = function () {
        //TODO make this work with running either sets or runs first for later hands
        sets_and_runs = _this.evaluate_cards(temp_hand_with_discard_card); 
        if (sets_and_runs.r_sets.length == 0 && sets_and_runs.r_sets.length == 0) {
            temp_hand_with_deck_card.push(top_card_on_deck);
        } else {
            _this.determin_possible_discards();
        }
    };

    this.determin_possible_discards = function () {
        if (sets_and_runs.r_sets.length != 0) {
            var partial_set = {};
            sets_and_runs.r_sets.forEach(function (card) {
                partial_set.push(card);
            });
            temp_hand_with_discard_card.forEach(function (card) {
                var index_of_card = temp_hand_with_discard_card.indexOf(card);
                for (var i = 0; i < partial_set.length; i++) {
                    if (_game.deck.compare(temp_hand_with_discard_card[card], partial_set[i])) {
                        temp_hand.push(temp_hand_with_deck_card.slice(index_of_card, 1));
                    } else {
                        possible_discards.push(temp_hand_with_discard_card.slice(index_of_card, 1));
                    }
                }
            });
        }
        //duplicate if, so that it's always checked because a hand can contain both a set and a run. Can't assume it's one or the other.
        if (sets_and_runs.r_runs.length != 0) {
            var partial_run = {};
            sets_and_runs.r_runs.forEach(function (card) {
                partial_run.push(card);
            });
            temp_hand_with_discard_card.forEach(function (card) {
                var index_of_card = temp_hand_with_discard_card.indexOf(card);
                for (var i = 0; i < partial_run.length; i++) {
                    if (_game.deck.compare(temp_hand_with_discard_card[card], partial_run[i])) {
                        temp_hand.push(temp_hand_with_deck_card.slice(index_of_card, 1));
                    } else {
                        possible_discards.push(temp_hand_with_discard_card.slice(index_of_card, 1));
                    }
                }
            });
        }
    };
};

Computer.prototype.evaluate_to_discard = function(current_hand_points){
    //this means they have a perfect score
    if(current_hand_points == this.wild_card_value * 100){
        this.lay_down(this.hand);
    }
};

Computer.prototype = new Player();