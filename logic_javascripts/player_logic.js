//player class
function Player() {
    this.hand = [];
    this.name = '';
    this.score = 0;
    this.hand_area = '';
    this.actions_taken = [];
    this.has_been_scored = false;
}

Player.prototype.deal = function(deck_ref, round) {
    var _hand = [];
    for (var i = 0; i < round + 2; i++) {//11 rounds starts at 1 (3 cards) last round has 13 cards 11+2
        _hand[i] = deck_ref.pop();
    }
    return {
        'hand' : _hand,
        'deck_ref' : deck_ref
    };
};

Player.prototype.draw_from_deck_or_discard = function(deck_and_dc, d_or_dc) {
    if (d_or_dc == 'deck') {
        this.hand.push(deck_and_dc.pop());
        this.actions_taken.push('drew');
        return deck_and_dc;
    } else if (d_or_dc == 'discard') {
        this.hand.push(deck_and_dc.discard_pile.pop());
        this.actions_taken.push('drew');
    }
};

Player.prototype.discard = function(card_to_discard, round_constants) {
    var card_name = '';
    var element_data = card_to_discard.getAttribute('data-element');

    for (var i = 0; i < this.hand.length; i++) {
        card_name = this.hand[i].suite + this.hand[i].value;
        if (element_data == card_name) {
            var discarded_card = this.hand.splice(i, 1);
            this.actions_taken.push('discarded');
            round_constants.discard_pile.push(discarded_card[0]); //splice returns an array, facepalm
            break; //only want to discard one card not all the cards in the hand that have the same name            
        }
    }
};

Player.prototype.lay_down = function() {
    var temp_hand = [];
    var non_empty_key = {};
    var total_cards_laid_down = 0;
    var second_results = {};
    var evaluated = false;

    for (var i = 0; i < this.hand.length; i++) {
        temp_hand[i] = this.hand[i];
    }

    var results = this.evaluate_cards(temp_hand, false);
    
    this.determin_number_laid_down = function(the_results){
        for (var k in the_results) {
            if (the_results.hasOwnProperty(k)) {
                non_empty_key[k] = 0;
                the_results[k].forEach(function(an_array){
                    if(typeof an_array != undefined && an_array.length >= 3){
                        non_empty_key[k] += an_array.length;
                    }
                });
            }
        }
    
        for (var k in non_empty_key) {
            if (non_empty_key.hasOwnProperty(k)) {
                total_cards_laid_down += non_empty_key[k];
            }
        }
    };
    
    if(evaluated == false){
        this.determin_number_laid_down(results);
        evaluated = true;
    }
    
    
    if(game_constants.round_instance.round >= 2 && total_cards_laid_down != this.hand.length){
        var save_num_laid_down = total_cards_laid_down;
        //reset for vars used in determin_number_laid_down closure
        total_cards_laid_down = 0;
        non_empty_key = {};
        
        second_results = this.evaluate_cards(temp_hand, true);
        this.determin_number_laid_down(second_results);
        
        if(total_cards_laid_down > save_num_laid_down){
            results = second_results;
        }else{
            total_cards_laid_down = save_num_laid_down;
        }
    }

    if (total_cards_laid_down != this.hand.length && total_cards_laid_down > 2) {
        results.message = "partial laydown";
    } else if (total_cards_laid_down == this.hand.length) {
        results.message = "full laydown";
    } else {
        results.message = "can't laydown";
    }

    return results;
};

//helper methods
Player.prototype.sort_player_cards = function() {

};

Player.prototype.running_score_total = function(cards_laid_down) {
    
    if(!this.has_been_scored){
        var temp_hand = [];
    
        for (var i = 0; i < this.hand.length; i++) {
            temp_hand[i] = this.hand[i];
        }
        
        // I am passing a zero from end turn if they haven't been scored yet. Means they haven't been able to lay down at all
        if(cards_laid_down != 0){ 
            for (var key in cards_laid_down) {
                if (cards_laid_down.hasOwnProperty(key)) {
                    var sub_array = cards_laid_down[key];
                    if (sub_array.length != 0) {
                        for(var i = 0; i < sub_array.length; i++){
                            sub_array[i].forEach(function(card) {
                                for (var j = 0; j < temp_hand.length; j++) {
                                    if (card.value == temp_hand[j].value || temp_hand[j].is_wild) {
                                        temp_hand.splice(j, 1, 'empty');
                                    }
                                }
                            });   
                        }
                    }
                }
            }
        }
    
        if (temp_hand.length == 0) {
            this.score += 0;
        } else {
            for (var i = 0; i < temp_hand.length; i++) {
                if (temp_hand[i] != 'empty') {
                    this.score += temp_hand[i].value;
                }
            }
        }
        this.has_been_scored = true;    
    }
};

Player.prototype.end_turn = function(_game) {
    if (_game.current_player < _game.players.length - 1) {
        _game.current_player += 1;
    } else {
        _game.current_player = 0;
    }
    this.clear_actions();
    return _game.current_player;
};

Player.prototype.clear_actions = function() {
    if (this.actions_taken.length == 2) {
        if (this.actions_taken.indexOf('discarded') != -1) {
            this.actions_taken = [];
        }
    }
};

Player.prototype.can_player_move = function(element) {
    switch(element) {
    case 'deck': {
        if (this.actions_taken.indexOf('drew') == -1) {
            return true;
        } else {
            return false;
        }
        break;
    }
    case 'discard': { //This is actually to see if they can draw from the discard pile, not to discard a card.
        if (this.actions_taken.indexOf('drew') == -1) {
            return true;
        } else {
            return false;
        }
        break;
    }
    case this.hand_area: {
        if (this.actions_taken.indexOf('drew') != -1) {
            if (this.actions_taken.indexOf('discarded') == -1) {
                return true;
            } else {
                return false;
            }
        }
        break;
    }
    case 'end_turn': {
        if (this.actions_taken.indexOf('discarded') != -1) {
            return true;
        } else {
            return false;
        }
        break;
    }
    case 'lay_down': {
        if (this.actions_taken.indexOf('discarded') != -1) {
            return true;
        } else {
            return false;
        }

        break;
    }
    default: {
        return false;
        break;
    }
    }
};

//The reason hand is being passed instead of using `this.hand`
//is because we don't want to be poping cards off of the players hand
//so the hand being passed is a temp copy of their actual hand.
//TODO: BUG - returns partial runs and shoudn't
Player.prototype.evaluate_cards = function(hand, r_first) { 
    var suites = {
        'clubs' : [],
        'diamonds' : [],
        'hearts' : [],
        'spades' : [],
        'stars' : []
    };
    var wilds = [];
    var buckets = {
        3 : [],
        4 : [],
        5 : [],
        6 : [],
        7 : [],
        8 : [],
        9 : [],
        10 : [],
        11 : [],
        12 : [],
        13 : []
    };
    var runs = [];
    var sets = [];
    var r_num = -1; //starts at -1 so ++ will give 0 index
    var s_num = -1;
    var has_been_evaluated = false;
    var breadth_search = false;
    var buckets_used_for_sets = [];

    hand.forEach(function(card) {
        if (card.is_wild) {
            wilds.push(card);
        } else {
            buckets[card.value].push(card);
        }
    });

    //deletes empty buckets
    for (var k in buckets) {
        if (buckets.hasOwnProperty(k)) {
            if (buckets[k].length == 0) {
                delete buckets[k];
            }
        }
    }

    //pushes cards into suites
    for (var b in buckets) {
        if (buckets.hasOwnProperty(b)) {
            if (buckets[b].length > 1) {
                buckets[b].forEach(function(card) {
                    suites[card.suite].push(card);
                });
            } else {
                suites[buckets[b][0].suite].push(buckets[b][0]);
            }
        }
    }

    //deletes empty suites
    for (var s in suites) {
        if (suites.hasOwnProperty(s)) {
            if (suites[s].length == 0) {
                delete suites[s];
            }
        }
    }
        /* The following 2 lines are inside the each if statement cause we don't want a set consisting 
     * of just one card if a bucket only has one card in it, but it's easier to use wilds
     * in sets then it is in runs so if there are lots of wilds I do make valid sets out 
     * buckets with just one card in them. So I only initilize a new "set" if I can actually make one.
     * 
     * s_num++; 
     * sets[s_num] = []; */
    this.determin_sets = function(){
        for (var c in buckets) {
            if (buckets.hasOwnProperty(c)) {
                if(buckets[c].length >= 2 ){
                    if(buckets_used_for_sets.indexOf(c) == -1){
                        s_num++; 
                        sets[s_num] = [];
                        buckets_used_for_sets.push(c);
                        if (buckets[c].length == 2 && wilds.length > 0) {
                            buckets[c].forEach(function(card) {
                                sets[s_num].push(card);
                                //next 2 lines remove the card from the suite it was in so it can't be used in a run.
                                var index = suites[card.suite].map(function(a){return a.value;}).indexOf(card.value);
                                suites[card.suite].splice(index, 1);
                            });
                            sets[s_num].push(wilds.pop());
                        } else if (buckets[c].length > 2) {
                            buckets[c].forEach(function(card) {
                                sets[s_num].push(card);
                                var index = suites[card.suite].map(function(a){return a.value;}).indexOf(card.value);
                                suites[card.suite].splice(index, 1);
                            });
                        }     
                    }
                }else if (buckets[c].length == 1 && wilds.length >= 2) {
                    if(breadth_search){
                        s_num++; 
                        sets[s_num] = [];
                        
                        buckets[c].forEach(function(card) {
                            sets[s_num].push(card);
                            var index = suites[card.suite].map(function(a){return a.value;}).indexOf(card.value);
                            suites[card.suite].splice(index, 1);
                        });
                        //yes I'm repeating myself here it makes a set and that's how human players think about it.
                        sets[s_num].push(wilds.pop());
                        sets[s_num].push(wilds.pop());     
                    }
                }
            }
        }
        if(!breadth_search && wilds.length >= 2){
            breadth_search = true;
            this.determin_sets();
        } 
    };


    this.determin_runs = function(){
        for (var s in suites){
            if(suites.hasOwnProperty(s)){
                var suite_length = suites[s].length;
                if(suite_length >= 2){
                    var range = suites[s][suite_length - 1].value - suites[s][0].value;
                    r_num++;
                    runs[r_num] = [];
                    
                    if( (range - 1) >= wilds.length && (range - 1) == suite_length){
                        suites[s].forEach(function(card){
                            runs[r_num].push(card);
                            var index = buckets[card.value].map(function(a){return a.value;}).indexOf(card.value);
                            buckets[card.value].splice(index, 1);
                        });
                        while(runs[r_num].length <= (range + 1) && wilds.length != 0){
                            runs[r_num].push(wilds.pop());
                        }
                   }else if(range == 1 && wilds.length >= 1){
                        suites[s].forEach(function(card){
                            runs[r_num].push(card);
                            var index = buckets[card.value].map(function(a){return a.value;}).indexOf(card.value);
                            buckets[card.value].splice(index, 1);
                        });
                        runs[r_num].push(wilds.pop()); 
                    }else if( range == suite_length && wilds.length >= 1){
                        suites[s].forEach(function(card){
                            runs[r_num].push(card);
                            var index = buckets[card.value].map(function(a){return a.value;}).indexOf(card.value);
                            buckets[card.value].splice(index, 1);
                        });
                        runs[r_num].push(wilds.pop());
                    }else if( (range + 1) == suite_length){
                        suites[s].forEach(function(card){
                            runs[r_num].push(card);
                            var index = buckets[card.value].map(function(a){return a.value;}).indexOf(card.value);
                            buckets[card.value].splice(index, 1);
                            
                        });
                    }
                }
            }
        }
    };
    
    if(has_been_evaluated == false){
        if(r_first){
            this.determin_runs();
            this.determin_sets();
        }else{
            this.determin_sets();
            this.determin_runs();
        }
        has_been_evaluated = true;
    }


    //if I have any extra wilds throw them on where I can
    if(wilds.length != 0){
        while(wilds.length != 0){
            if(runs[0] != undefined && runs[0].length != 0){
                runs[0].push(wilds.pop());
            }else if(sets[0]!= undefined && sets[0].length != 0){
                sets[0].push(wilds.pop());
            }else if(wilds.length >= 3){ //This last case takes care of hands that are all wild by treating them like a set.
                sets[0] = [];
                sets[0].push(wilds.pop());
            }
        }
    }

    var results = {
        r_sets : sets,
        r_runs : runs
    };
    return results;
};
