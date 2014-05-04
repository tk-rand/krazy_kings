//TODO refactor to use prototype instead of `this` also make player uppercase

 //player class
function player(){
	this.hand = [];
	this.name = '';
	this.score = 0;
	this.hand_area = '';
    this.actions_taken = [];
    this.has_been_scored = false;
	
	this.deal = function(deck_ref, round){
		var _hand = [];
		for(var i = 0; i< round+2; i++){ //11 rounds starts at 1 (3 cards) last round has 13 cards 11+2
			_hand[i] = deck_ref.pop();
		}
		return {'hand': _hand, 'deck_ref': deck_ref};
	};

	this.draw_from_deck_or_discard = function(deck_and_dc, d_or_dc){
        if(d_or_dc == 'deck'){
            this.hand.push(deck_and_dc.pop());
            this.actions_taken.push('drew');
            return deck_and_dc;
        }else if(d_or_dc == 'discard'){
            this.hand.push(deck_and_dc.pop());
            this.actions_taken.push('drew');
            return deck_and_dc;
        }
	};

	this.discard = function(card_to_discard, discard_pile){
        var card_name = '';
        var element_data = card_to_discard.getAttribute('data-element');
        
        for(var i = 0; i < this.hand.length; i++){
        	card_name = this.hand[i].suite + this.hand[i].value;
	        if(element_data == card_name){
	        	var discarded_card = this.hand.splice(i,1);
	        	this.actions_taken.push('discarded');
	        	discard_pile.push(discarded_card[0]); //splice returns an array, facepalm
	        	return discard_pile;
	        }	       	
        }	
	};
	
	this.lay_down = function(){
        var temp_hand = [];
        
        for(var i = 0; i < this.hand.length; i++){
        	temp_hand[i] = this.hand[i];	
        }
		
		var results = this.evaluate_cards(temp_hand);

		return results;
	};
	
	//helper methods
	this.sort_player_cards = function(){
		
	};
	
	this.running_score_total = function(cards_laid_down){
	   var num_of_cards_laid_down = 0;
	   var temp_hand = [];
	   
	   for(var i = 0; i < this.hand.length; i++){
	   		temp_hand[i] = this.hand[i];
	   }
	   if(cards_laid_down != 0){
	   		for(var c in cards_laid_down){
	       		if(cards_laid_down.hasOwnProperty(c)){
	       			if(cards_laid_down[c][0] != undefined){
						num_of_cards_laid_down += cards_laid_down[c][0].length;
						popped:
						for(var i = 0; i < num_of_cards_laid_down; i++){
							for(var j = 0; j < temp_hand.length; j++){
								if(cards_laid_down[c][0][i].value == temp_hand[j].value && cards_laid_down[c][0][i].suit == temp_hand[j].suit){
									temp_hand.pop();
									continue popped;
								}
							}
						}		
	       			}
	       		}
	   		}
	   }

	   if(num_of_cards_laid_down == this.hand.length){
	   		this.score += 0;
	   }else{
	   		for(var i = 0; i < temp_hand.length; i++){
	   			this.score += temp_hand[i].value;
	   		}
	   }
	   this.has_been_scored = true;
	};
	
	this.end_turn = function(_game){
		if(_game.current_player < _game.players.length - 1 ){
			_game.current_player += 1;		
		}else{
			_game.current_player = 0;	
		}
		this.clear_actions();
		return _game.current_player;
	};
	
	this.clear_actions = function(){
		if(this.actions_taken.length == 2){
			if(this.actions_taken.indexOf('discarded') != -1){
				this.actions_taken = [];
			}
		}
	};

    this.can_player_move = function(element){ 
        switch(element){
        	case 'deck':{
	        	if(this.actions_taken.indexOf('drew') == -1){
	                return true;
	            }else{
	                return false;
	            }
	            break; 
        	}
        	case 'discard':{
	        	if(this.actions_taken.indexOf('drew') == -1){
        			return true;
        		}else{
        			return false;
        		}
	        	break;	
        	}
        	case this.hand_area:{
        		if(this.actions_taken.indexOf('drew') != -1){
        			if(this.actions_taken.indexOf('discarded') == -1){
        				return true;
        			}else{
        				return false;
        			}
        		}
        		break;
        	}
        	case 'end_turn':{
        		if(this.actions_taken.indexOf('discarded') != -1){
        			return true;
        		}else{
        			return false;
        		}
        		break;
        	}
        	case 'lay_down':{
				return true;
				break;	
        	}
        	default:{
        		return false;
        		break;
        	}
        } 
    };
    
    //The reason hand is being passed instead of using `this.hand` 
    //is because we don't want to be poping cards off of the players hand
    //so the hand being passed is a temp copy of their actual hand.
    this.evaluate_cards = function(hand){
		var suites = {'clubs': [], 'diamonds': [], 'hearts': [], 'spades': [], 'stars': []};
		var wilds = [];
		var buckets = {3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: []};
		var runs = [];
		var count = 1;
		var sets = [];

		hand.forEach(function(card){
			if(card.is_wild){
				wilds.push(card);	
			}else{
				buckets[card.value].push(card);	
			}
		});
		
		//deletes empty buckets
		for(var k in buckets){
			if(buckets.hasOwnProperty(k)){
				if(buckets[k].length == 0){
					delete buckets[k];
				}
			}
		};
		
        /* This for loop evaluates for sets.
         * The reason that it's here before the cards are seperated into suits
         * is so that if all the cards are used for a set, it doesn't have to go though 
         * the run logic. This should work for the first 3 rounds, 
         * TODO add extra logic for handling multiple sets/run
         * TODO make sets return an array of sets/partial sets like runs do
         */
        for (var i in buckets) {
            if (buckets.hasOwnProperty(i)) {
                if (buckets[i].length == 2 && wilds.length > 0) {
                    buckets[i].forEach(function(card){
                        sets.push(card);   
                    });  
                    sets.push(wilds.pop());
                } else if (buckets[i].length > 2) {
                    buckets[i].forEach(function(card){
                        sets.push(card);   
                    });
                } else if(buckets[i].length == 1 && wilds.length >= 2){
                	buckets[i].forEach(function(card){
                		sets.push(card);
                	});
                	for(var c = 0; c < 2; c++){
                		sets.push(wilds.pop());
                	}
                }
            }
        }

		//pushes cards into suites
		for(var b in buckets){
			if(buckets.hasOwnProperty(b)){
				if(buckets[b].length > 1 ){
					buckets[b].forEach(function(card){
						suites[card.suite].push(card);
					});
				}else{
					suites[buckets[b][0].suite].push(buckets[b][0]);
				}	
			}
		};

        //deletes empty suites
		for(var s in suites){
			if(suites.hasOwnProperty(s)){
				if(suites[s].length == 0){
					delete suites[s];
				} 
			}
		};
		
		//determins runs
		for(var s in suites ){
			if(suites.hasOwnProperty(s)){
				if(suites[s].length >= 2){
					for(var i = 0; i < suites[s].length; i++){
						suites[s] = suites[s].sort(suites[s][i].value);
					}
					var range = suites[s][suites[s].length - 1].value - suites[s][0].value;
					if(range == suites[s].length - 1){
						runs.push(suites[s]);	
					}else if(range == 2){
						runs.push(suites[s]);
					}
				}else{
					var low = suites[s][0].value;
					var range = suites[s][suites[s].length - 1].value - suites[s][0].value;
					for(var i = 1; i < range; i++){
						if(suites[s][i].value == low + 1){
							low = low + 1;
							count++;
							continue;
						}else if(suites[s][i].value <= low + wilds.length){
							var run = [];
							if(low + wilds.length < suites[s].length){
								if(count > 2 || wilds.length > 2){
									run.push(suites.splice(0, low + wilds.length));		
								}
							}else{
								do{
									low = low + wilds.length;
									wilds.length--;
								}while(low > suites[s].length);
									if(count > 2 || 0 + low > 3){
										run.push(suites[s].splice(0, low));	
									}
							}
							runs.push(run[0]); //splice returns an array
						}	
					}
				}
			}
		};
		
		if(typeof runs[0] != 'undefined' && (runs[0].length == 2 && wilds.length > 0)){
		    runs[0].push(wilds.pop());
		}
		var results = {
		    r_sets: [sets],
		    r_runs: runs
		};
		return results;	
	};	
}
