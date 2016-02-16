/* global _game */
/* global Player */

//computer ai class
//computer is a subclass of player

function Computer(){
    Player.apply(this);
}

Computer.prototype = Object.create(Player.prototype);
Computer.prototype.constructor = Computer;

Computer.prototype.decide_what_to_draw = function(round_constants) {
    var h_length = this.hand.length;
    var n = 0;
    var discarded_card = null;
    var lowest_score = 0;
    var temp_hand = [];
    var temp_card = null;
    
    for(var i = 0; i < h_length; i++){
        temp_hand[i] = this.hand[i];
    }
    var current_hand_score = this.evaluate_cards(temp_hand); 
    
    while(n <= h_length){
        temp_hand = [];
        
        if(n === 0){
            lowest_score = current_hand_score.value;
        }
        
        for(var i = 0; i < h_length; i++){
            temp_hand[i] = this.hand[i];
        }
        
        //can't use pop() here or it would shorten the discard pile stack
        //so making a copy of last card on the stack instead.
        temp_hand.push(round_constants.discard_pile[round_constants.discard_pile.length - 1]);
        temp_card = temp_hand.splice(n, 1);
        
        var evaluated_hand = this.evaluate_cards(temp_hand);
        
        if(evaluated_hand.value < lowest_score || evaluated_hand.value === 0){
            discarded_card = temp_card;
            lowest_score = evaluated_hand.value;
        }
        n++;
    }
    
    var self = this;
    
    if(lowest_score !== 0 && lowest_score < current_hand_score.value){
        //makes AI action not instant
        window.setTimeout(function(){
            _game.handle_events('discard');
            window.setTimeout(function(){
                self.evaluate_and_discard(discarded_card);
                _game.handle_events('end_turn');
            }, 3000);
        }, 3000);
    }else if(lowest_score === 0){
        window.setTimeout(function(){
            _game.handle_events('discard');
            window.setTimeout(function(){
                self.evaluate_and_discard(discarded_card);
                _game.handle_events('lay_down');
            }, 3000);
        }, 3000);
    }else{
        var discard_card = null;
        var temp_discard = null;
        
        window.setTimeout(function(){
            _game.handle_events('deck');
            var p = 0;
            var low_score = current_hand_score.value;
            //hand is one longer now
            var hand_length = self.hand.length;
            
            //less then instead of less or equal to like above because we add 
            //to the length outside the while loop here instead of inside it as above
            while(p < hand_length){
                temp_hand = [];
                for(var i = 0; i < hand_length; i++){
                    temp_hand[i] = self.hand[i];
                }
                temp_discard = temp_hand.splice(p, 1);
                var eval_hand = self.evaluate_cards(temp_hand);
                
                if(eval_hand.value < low_score){
                    discard_card = temp_discard;
                    low_score = eval_hand.value;
                }
                p++;
            }
            //get rid of last card if we never set discard card.    
            if(discard_card === null){
                discard_card = temp_discard;
            }
            //if the score didn't get better or got worse get rid of card just drawn
            if(low_score > current_hand_score.value){
                window.setTimeout(function(){
                    self.evaluate_and_discard(discard_card);
                    _game.handle_events('end_turn');
                },3000);
            }else if(low_score === 0){
                window.setTimeout(function(){
                    self.evaluate_and_discard(discard_card);
                    _game.handle_events('lay_down');
                },3000);
            }else{
                window.setTimeout(function(){
                    self.evaluate_and_discard(discard_card);
                    _game.handle_events('end_turn');
                },3000);
            }
        },3000);
    }
};

Computer.prototype.evaluate_and_discard = function(card){
        //splice above returns an array even if there is only one element
        var discarded_card = card[0].display;
        
        //display is a string not a dom element
        var index = discarded_card.search('t=');
        var card_name = discarded_card.substring(index + 3, discarded_card.length - 8);
        var current_player = this.hand_area;
        
        //discard the bad card
        _game.handle_events(current_player, card_name);
};

