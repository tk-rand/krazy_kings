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

    var results = this.evaluate_cards(temp_hand);
    
    // this.determin_number_laid_down = function(the_results){
    //     for (var k in the_results) {
    //         if (the_results.hasOwnProperty(k)) {
    //             non_empty_key[k] = 0;
    //             the_results[k].forEach(function(an_array){
    //                 if(typeof an_array != undefined && an_array.length >= 3){
    //                     non_empty_key[k] += an_array.length;
    //                 }
    //             });
    //         }
    //     }
    
    //     for (var k in non_empty_key) {
    //         if (non_empty_key.hasOwnProperty(k)) {
    //             total_cards_laid_down += non_empty_key[k];
    //         }
    //     }
    // };
    
    // if(evaluated == false){
    //     this.determin_number_laid_down(results);
    //     evaluated = true;
    // }
    
    
    // if(game_constants.round_instance.round >= 2 && total_cards_laid_down != this.hand.length){
    //     var save_num_laid_down = total_cards_laid_down;
    //     //reset for vars used in determin_number_laid_down closure
    //     total_cards_laid_down = 0;
    //     non_empty_key = {};
        
    //     second_results = this.evaluate_cards(temp_hand, true);
    //     this.determin_number_laid_down(second_results);
        
    //     if(total_cards_laid_down > save_num_laid_down){
    //         results = second_results;
    //     }else{
    //         total_cards_laid_down = save_num_laid_down;
    //     }
    // }

    // if (total_cards_laid_down != this.hand.length && total_cards_laid_down > 2) {
    //     results.message = "partial laydown";
    // } else if (total_cards_laid_down == this.hand.length) {
    //     results.message = "full laydown";
    // } else {
    //     results.message = "can't laydown";
    // }

    return results;
};

//helper methods
Player.prototype.sort_player_cards = function() {

};

Player.prototype.compare_cards = function(card1, card2){
    for(var key in card1){
        if(card1.hasOwnProperty(key)){
            if(!card2.hasOwnProperty(key)){
                return false;
            }
            if(card1[key] == card2[key]){
                continue;
            }else{
                return false;
            }
        }
    }
    return true;
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
	function Evaluated_hand(hand){
		this.matrix = [[0,0,0,0,0,0,0,0,0,0,0],  //clubs
					  [0,0,0,0,0,0,0,0,0,0,0],  //diamonds
					  [0,0,0,0,0,0,0,0,0,0,0],  //hearts
					  [0,0,0,0,0,0,0,0,0,0,0],  //spades
					  [0,0,0,0,0,0,0,0,0,0,0]]; //stars
		this.wilds = 0;
		this.melds = [];
		this.round = game_constants.round_instance.round;
        var self = this;
		
        hand.forEach(function(card){
			if(card.is_wild){
				self.wilds++;
			}else{
				switch (card.suite){
					case 'clubs':{
                        // -3 because cards start with value of 3 but array is zero based
						self.matrix[0][card.value - 3]++;
						break;
					}
					case 'diamonds':{
						self.matrix[1][card.value - 3]++;
						break;
					}
					case 'hearts':{
						self.matrix[2][card.value - 3]++;
						break;
					}
					case 'spades':{
						self.matrix[3][card.value - 3]++;
						break;
					}
					case 'stars':{
						self.matrix[4][card.value - 3]++;
						break;
					}
				}
			}
		});
        
        this.value = this.leftover_value();
	}
	
	Evaluated_hand.prototype.find_melds = function(suite, num){
		if(suite == undefined || num == undefined){
			suite = num = 0;
		}
		
		if(this.wilds > 2){
			for(var i = 0; i < this.wilds; i++){
				//recrusion s == suite, n == num
				this.melds.push({suite: -1, num: -1});
			}
			 this.value -= 25 * this.wilds - (22 - this.round) * this.wilds;
		}
		
		//search until laydown or final value is found
		while(this.value > 0){
			//find the next card in matrix
			while(num > 10 || this.matrix[suite][num] == 0){
				if(++num > 10){
					num = 0;
					if(++suite > 4){
						return;
					}
				}
			}
			
			for(var meld_type = 0; meld_type < 2; meld_type++){
				//find a set or run at current matrix position
				var meld = meld_type ? this.find_set(suite, num) : this.find_run(suite, num);
				
				//try different lengths for long sets or runs
				for(var len = 3; len <= meld.length; len++){
					var test = new Evaluated_hand(hand)
					test.remove_cards(meld.slice(0, len));
					
					meld_type ? test.find_melds(suite, num) : test.find_melds(0,0);
					
					if(test.value < this.value){
						this.value = test.value;
						this.melds.length = 0;
						this.melds = [].concat(meld.slice(0, len), test.melds);
					}
				}
			}
			num++;
		}
	};
	
	Evaluated_hand.prototype.find_run = function(suite, num){
		var run = [];
		var wilds = this.wilds;
		while(num < 11){
			if(this.matrix[suite][num] > 0){
				run.push({suite: suite, num: num});
			}else if(wilds > 0){
				run.push({suite: -1, num: -1});
				wilds --;
			}else{
				break;
			}
			num++;
		}
		
		while(wilds-- > 0){
			run.push({suite: -1, num: -1});
		}
		return run;	
	};
	
	Evaluated_hand.prototype.find_set = function(suite, num){
		var set = [];
		while(suite < 5){
			for(var i = 0; i < this.matrix[suite][num]; i++){
				set.push({suite: suite, num: num});
			}
			suite++;
		}
		
		for(var i = 0; i < this.wilds; i++){
			set.push({suite: -1, num: -1});
		}
		return set;
	};
    
    Evaluated_hand.prototype.remove_cards = function(cards){
        for(var i = 0; i < cards.length; i++){
            if(cards[i].suite >= 0){
                this.matrix[cards[i].suite][cards[i].num]--;
            }else{
                this.wilds--;
            }
        }
        this.value = this.leftover_value();
    }
	
	Evaluated_hand.prototype.leftover_value = function(){
		var leftover = 0;
		for(var i = 0; i < 5; i++){
			for(var j = 0; j < 11; j++){
				leftover += this.matrix[i][j] * (j + 3);
			}
		}
		return leftover + 25 * this.wilds - (22 - this.round) * (this.wilds);	
	};
	
	var results = new Evaluated_hand(hand);
	results.find_melds();
	return results.value;
};