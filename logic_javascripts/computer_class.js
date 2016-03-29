/* global _game */
/* global Player */

//computer ai class
//computer is a subclass of player
function Computer(){
    Player.apply(this);
    if(window.localStorage.getItem('ai_level')){
        this.settings = JSON.parse(window.localStorage.getItem('ai_level')).difficulty;
    }else{
        //set default to easy if they haven't looked at settings screen
        this.settings = 'easy';
    }
    
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
    var discard_pile_length = round_constants.discard_pile.length;
    var discard_pile_card = round_constants.discard_pile[discard_pile_length - 1];
    var used_function = false;
    
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
        temp_hand.push(discard_pile_card);
        temp_card = temp_hand.splice(n, 1);
        
        var evaluated_hand = this.evaluate_cards(temp_hand);
        
        if(evaluated_hand.value < lowest_score || evaluated_hand.value === 0){
            discarded_card = temp_card;
            lowest_score = evaluated_hand.value;
        }
        n++;
    }
    
    var self = this;
    
    if(this.settings === "medium" || this.settings === "hard"){
        //This block ensures that we "gamble on choosing the deck card" if the discard
        //pile card won't help us complete a set or run.
        var hand_difference = current_hand_score.value - lowest_score;
        var card_difference = 0;
        if(discarded_card != undefined){
            card_difference = discarded_card[0].value - discard_pile_card.value; 
        }else{
            card_difference = hand_difference; 
        }
    }

    if(this.settings === "easy"){
       drawing_from_discard_pile();
       if(!used_function){
           drawing_from_deck();
       }         
    }else if(this.settings === "medium" || this.settings === "hard"){ //currently no hard settings so send both to same place
        if(hand_difference > card_difference && !discarded_card[0].is_wild){
            drawing_from_discard_pile();
            if(!used_function){
                drawing_from_deck();
            }
        }else{
            drawing_from_deck();
        }
    }

    function drawing_from_discard_pile(){
        if(lowest_score !== 0 && lowest_score < current_hand_score.value){
            //makes AI action not instant
            window.setTimeout(function(){
                _game.handle_events('discard');
                window.setTimeout(function(){
                    return self.action_handler(discarded_card, 'end_turn');
                }, 1500);
            }, 3000);
            used_function = true;
        }else if(lowest_score === 0){
            window.setTimeout(function(){
                _game.handle_events('discard');
                window.setTimeout(function(){
                    return self.action_handler(discarded_card, 'lay_down');
                }, 1500);
            }, 3000);
            used_function = true;
        }
    }
    function drawing_from_deck(){
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
            window.setTimeout(function(){
                if(low_score > current_hand_score.value){
                    return self.action_handler(discard_card, 'end_turn');
                }else if(low_score === 0){
                    return self.action_handler(discard_card, 'lay_down');
                }else{
                    return self.action_handler(discard_card, 'end_turn');
                }    
            },1500);
        },3000);
    }
};

Computer.prototype.action_handler = function(card, action){
    this.evaluate_and_discard(card);
    _game.handle_events(action);
}

Computer.prototype.evaluate_and_discard = function(card){
        //splice above returns an array even if there is only one element
        var discarded_card = card[0].display;
        var card_name = discarded_card.getAttribute('data-element');    
        var current_player = this.hand_area;
        
        //discard the bad card
        _game.handle_events(current_player, card_name);
};