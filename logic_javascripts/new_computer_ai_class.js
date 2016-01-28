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

};

Computer.prototype.evaluate_to_discard = function(current_hand_points){
    //this means they have a perfect score
    if(current_hand_points == this.wild_card_value * 100){
        this.lay_down(this.hand);
    }
};

Computer.prototype = new Player();