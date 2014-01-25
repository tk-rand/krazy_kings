
//computer ai class
//computer is a subclass of player 
function Computer(){
    player.apply();
  
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
    var wild_card_value = round_constants.round + 2; //add 2 cause round starts at one but card values start at 3
    
    //make whatever card that is wild this round worth 100
    this.card_values[wild_card_value] = 100;
    
    for(var c in this.hand){
        if(this.hand.hasOwnProperty(c)){
            initial_hand_points += this.card_values[this.hand[c].value];
        }
    }
    return initial_hand_points;
};

Computer.prototype.calculate_new_hand_value = function(hand){
            
};

/*
 * Thoughts: I can go one of 2 ways: Either I can check to see if the value and suite of the card on the discard 
 * match any of the cards in the computers hand, OR I can evaluate, add the discard card and evaluate again to see 
 * if I get a bigger set or run.
 * I believe that I need to go with the second one because the first one wouldn't work for runs, which means no matter
 * what I have to evaluate the cards.
*/
Computer.prototype.decide_what_to_draw = function(initial_hand_points, round_constants) {
    var temp_hand = {};
    var temp_hand_with_discard = [];
    var partial_sets = [];
    var partial_runs = [];
    var drawn_card_value = 0;
    var dc_pile_length = round_constants.discard_pile.length;
    
    this.hand.forEach(function(card){
        temp_hand.push(card);
    });
    
    drawn_card_value = this.card_values[round_constants.discard_pile[dc_pile_length - 1]];
    
    var sets_and_runs = this.evaluate_hand(temp_hand);
    
    sets_and_runs.r_sets.forEach(function(card){
       partial_sets.push(card); 
    });
    
    sets_and_runs.r_runs.forEach(function(card){
       partial_runs.push(card); 
    });
    
    if(partial_runs.length == 0 && partial_sets.length == 0){
        var low = this.card_values[temp_hand[0].value];
        var temp_discarded_card = {};
        for(var i = 1; i <= temp_hand.length; i++){
            if(this.card_values[temp_hand[i].value] < low){
                low = this.card_values[temp_hand[i].value];
            }
        }
        //temp_discarded_card = temp_hand.pop();
               
    }
    
    if (partial_sets.length >= 2) {
       temp_hand_with_discard.push(round_constants.discard_pile[dc_pile_length - 1]);
       
       partial_sets.forEach(function(card){
           temp_hand_with_discard.push(card);
       });
       
    }
}; 

Computer.prototype.evaluate_to_discard = function(current_hand_points){  
    //this means they have a perfect score
    if(current_hand_points == wild_card_value * 100){
        this.lay_down(this.hand);
    }  
};

Computer.prototype = new player;