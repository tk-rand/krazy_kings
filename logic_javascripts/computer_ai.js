
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

/* OR I can evaluate, add the discard card and evaluate again to see
 * if I get a bigger set or run.
 * I believe that I need to go with the second one because the first one wouldn't work for runs, which means no matter
 * what I have to evaluate the cards.
 * 
 * TODO, so I just realized that just taking the low value card and substituting it for the card on the top of the discard
 * pile or the deck will work but it will be a very stupid AI. This is because the card on the discard pile or on the deck
 * could make a set or run with the low card. 
 * TODO Refactor this so that it takes the top card from the discard pile and runs the hand **WITH** the card draw though the 
 * hand evaluator. Then I can choose to discard the low value from one of 2 options: if it returns a partial set or run,
 * I can pick the low value from the cards not in the partial hand and discard it, OR if there is no partial set or run,
 * I can just drop the lowest card value in the whole hand.
*/
Computer.prototype.decide_what_to_draw = function(initial_hand_points, round_constants) {
    var temp_hand = {};
    var temp_hand_with_discard = [];
    var temp_hand_with_deck = [];
    var partial_sets = [];
    var partial_runs = [];
    var drawn_card_value = 0;
    var sets_and_runs = {};
    var tried_dc_pile = false;
    var _this = this;
    
    //vars for the discard pile and the deck pile
    var dc_pile_length = round_constants.discard_pile.length;
    var top_card_on_dc_pile = round_constants.discard_pile[dc_pile_length - 1];
    var deck_length = _game.deck.length;
    var top_card_on_deck = _game.deck[deck_length - 1];

    
    this.hand.forEach(function(card){
        temp_hand.push(card);
    });
    
    drawn_card_value = this.card_values[top_card_on_dc_pile];
    
    this.create_partial_sets_runs = function(){
        //TODO make this work with running either sets or runs first for later hands
        sets_and_runs = this.evaluate_cards(temp_hand);
        
        sets_and_runs.r_sets.forEach(function(card){
            partial_sets.push(card); 
        });
    
        sets_and_runs.r_runs.forEach(function(card){
            partial_runs.push(card); 
        });
        _this.check_partial_sets_runs();
    }();
    
    this.check_partial_sets_runs = function(){
        if(partial_runs.length == 0 && partial_sets.length == 0){
            var low = this.card_values[temp_hand[0].value];
            var temp_discarded_card = {};
            
            for(var i = 1; i <= temp_hand.length; i++){
                if(this.card_values[temp_hand[i].value] < low){
                    low = this.card_values[temp_hand[i].value];
                }
            }
        
            var index = temp_hand.indexOf(low);
            temp_discarded_card = temp_hand.splice(index, 1);
        
            temp_hand.forEach(function(card){
                temp_hand_with_discard.push(card);
            });
            temp_hand_with_discard.push(top_card_on_dc_pile);
            
            if(tried_dc_pile == false){
                _this.create_partial_sets_runs();
                tried_dc_pile = true;
            }else{
                if(drawn_card_value > low){
                    _this.draw_from_deck_or_discard(round_constants.discard_pile, 'discard');
                    _this.draw_current_players_hand(_game);
                    _this.draw_discard_pile(round_constants);
                }else{
                    drawn_card_value = _this.card_values[top_card_on_deck];
                }
            }
                 
        }else if (partial_sets.length >= 2) {
            temp_hand_with_discard.push(top_card_on_dc_pile);
       
            partial_sets.forEach(function(card){
                temp_hand_with_discard.push(card);
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