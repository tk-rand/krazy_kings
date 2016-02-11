/* global _game */
/* global game_constants */

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

//@deck_and_dc, round_constants object
//@d_or_dc, string, value is either deck or discard.
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

    for (var i = 0; i < this.hand.length; i++) {
        card_name = this.hand[i].suite + this.hand[i].value;
        if (card_to_discard == card_name) {
            var discarded_card = this.hand.splice(i, 1);
            this.actions_taken.push('discarded');
            round_constants.discard_pile.push(discarded_card[0]); //splice returns an array, facepalm
            break; //only want to discard one card not all the cards in the hand that have the same name            
        }
    }
};

Player.prototype.lay_down = function() {
    var temp_hand = [];

    for (var i = 0; i < this.hand.length; i++) {
        temp_hand[i] = this.hand[i];
    }

    var results = this.evaluate_cards(temp_hand);
    console.log(results);
    return results.value;
};

//helper methods

Player.prototype.sort_player_cards = function() {
    var suites = {
            'clubs' : [],
            'diamonds' : [],
            'hearts' : [],
            'spades' : [],
            'stars' : []
    };
    var wilds = [];
    var sorted_hand = [];
    var settings =  window.localStorage.getItem('settings');
    var sort_type = JSON.parse(settings).sort_type;
    
    if(sort_type == 'suite'){
        this.hand.forEach(function(card){
            if(card.is_wild){
                wilds.push(card);
            }else{
                suites[card.suite].push(card);
            }
        });
        
        for(var suite in suites){
            if(suites.hasOwnProperty(suite)){
                if(suites[suite].length == 0){
                    delete suites[suite];
                }else{
                    suites[suite].sort(function(a, b){
                        return a.value - b.value;
                    });
                   sorted_hand = sorted_hand.concat(suites[suite]); 
                }
            }
        }
        
        this.hand = sorted_hand.concat(wilds);
        
    }else if(sort_type == 'value'){
        this.hand.sort(function(a, b) {
           return a.value - b.value; 
        });
    }
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

Player.prototype.running_score_total = function(result) {
    
    if(!this.has_been_scored){
        this.score += result;
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

//Passing a copy of hand instead of using this.hand since this function
//could mess with the players hand

Player.prototype.evaluate_cards = function(hand) {
	//@copy bool says whether or not this is a recursive copy being constructed
    function Evaluated_hand(hand, wilds, copy){
		this.matrix = [[0,0,0,0,0,0,0,0,0,0,0],  //clubs
					  [0,0,0,0,0,0,0,0,0,0,0],  //diamonds
					  [0,0,0,0,0,0,0,0,0,0,0],  //hearts
					  [0,0,0,0,0,0,0,0,0,0,0],  //spades
					  [0,0,0,0,0,0,0,0,0,0,0]]; //stars
		this.wilds = wilds || 0;
		this.melds = [];
		this.round = game_constants.round_instance.round - 1;
        var self = this;
		var loc_wilds = 0;
        
		if(!copy){
            hand.forEach(function(card){
    			if(card.is_wild){
    				loc_wilds++;
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
        }else{
            this.matrix = this.clone_matrix(hand);
        }
        if(loc_wilds > 0 && this.wilds == 0){
            this.wilds = loc_wilds;
        }
           
        this.value = this.leftover_value();
	};
	
	Evaluated_hand.prototype.find_melds = function(suite, num){
		if(suite == undefined || num == undefined){
			suite = num = 0;
		}
		
		if(this.wilds > 2){
			for(var i = 0; i < this.wilds; i++){
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
					var test = new Evaluated_hand(this.matrix, this.wilds, true);
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
				wilds--;
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
    };
	
	Evaluated_hand.prototype.leftover_value = function(){
		var leftover = 0;
		for(var i = 0; i < 5; i++){
			for(var j = 0; j < 11; j++){
				leftover += this.matrix[i][j] * (j + 3);
			}
		}
		return leftover + 25 * this.wilds - (22 - this.round) * this.wilds;	
	};
    
    Evaluated_hand.prototype.clone_matrix = function(arr){
        var b = [];
        for(var i = 0; i < arr.length; i++){
            b[i] = arr[i].slice();
        }
        return b;
    };
	
	var results = new Evaluated_hand(hand, 0, false);
	results.find_melds();

	return results;
};
