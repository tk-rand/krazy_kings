/* global _game */

//computer ai class
//computer is a subclass of player
function Computer(){
    Player.apply();
}

Computer.prototype.decide_what_to_draw = function(round_constants) {
    var h_length = this.hand.length;
    var n = 0;
    var discarded_card_index = 0;
    var lowest_score = 0;
    var temp_hand = [];
    
    for(var i = 0; i < h_length; i++){
        temp_hand[i] = this.hand[i];
    }
    
    var current_hand_score = this.eveluate_cards(temp_hand); 
    
    while(n < h_length){
        temp_hand = [];
        
        if(n === 0){
            lowest_score = current_hand_score;
        }
        
        for(var i = 0; i < h_length; i++){
            temp_hand[i] = this.hand[i];
        }
        //can't use pop() here or it would shorten the discard pile stack
        //so making a copy of last card on the stack instead.
        temp_hand.push(round_constants.discard_pile[round_constants.discard_pile.length - 1]);
        temp_hand.splice(n, 1);
        
        var evaluated_hand = this.evaluate_cards(temp_hand);
        
        if(evaluated_hand.value < lowest_score){
            discarded_card_index = n;
            lowest_score = evaluated_hand.value;
        }
        n++;
    }
    
    if(lowest_score !== 0 && lowest_score < current_hand_score){
        _game.handle_events('discard');
        this.evaluate_and_discard(n)
        this.handle_events('end_turn');
    }else if(lowest_score === 0){
        _game.handle_events('discard');
        this.evaluate_and_discard(n);
        this.handle_events('lay_down');
    }else{
        _game.handle_events('deck');
        n = 0;
        lowest_score = current_hand_score;
        while(n < h_length){
            temp_hand = [];
            for(var i = 0; i < h_length; i++){
                temp_hand[i] = this.hand[i];
            }
            temp_hand.splice(n, 1);
            var evaluated_hand = this.evaluate_cards(temp_hand);
            
            if(evaluated_hand.value < lowest_Score){
                discarded_card_index = n;
                lowest_score = evaluated_hand.value;
            }
            n++;
        }
        //if the score didn't get better or got worse get rid of card just drawn
        if(lowest_score >= current_hand_score){
            this.evaluate_and_discard(h_length - 1);
        }else if(lowest_score === 0){
            this.evaluate_and_discard(n);
            this.handle_events('lay_down');
        }else{
            this.evaluate_and_discard(n);
            this.handle_events('end_turn');
        }
    }
};

Computer.prototype.evaluate_and_discard = function(card_index){
        var discarded_card = this.hand[card_index].display;
        
        //display is a string not a dom element
        var index = discarded_card.search('t=');
        var card_name = discarded_card.substring(index + 3, discarded_card.length - 8);
        var current_player = "player_" + _game.current_player + 'hand';
        
        //discard the bad card
        _game.handle_events(current_player, card_name);
};

Computer.prototype = new Player();