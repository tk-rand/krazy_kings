/* global _game */

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
    var temp_hand = [];
    var h_length = this.hand.length;
    for(var i = 0; i < h_length; i++){
        temp_hand[i] = this.hand[i];
    }
    
    function evaluate_with_discard(val, n){
        temp_hand.push(round_constants.discard_pile.pop());
        var discarded_card = temp_hand.splice(n, 1);
        var hand_value = this.evaluate_cards(temp_hand);
        
        if(n < h_length){
            if(hand_value < val){
                return evaluate_with_discard(hand_value, n++);
            }else{
                return evaluate_with_discard(val, n++);
            }
        }else{
            if(hand_value < val){
                return {new_hand: temp_hand, discard: discarded_card}
            }
        }

    }
};

Computer.prototype.evaluate_to_discard = function(current_hand_points){
    //this means they have a perfect score
    if(current_hand_points == this.wild_card_value * 100){
        this.lay_down(this.hand);
    }
};

Computer.prototype = new Player();