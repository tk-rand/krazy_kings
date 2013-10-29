 //player class
function player(){
	this.hand = [];
	this.name = '';
	this.score = 0;
	this.hand_area = '';
    this.actions_taken = [];
	
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
		
		console.log(results);
		return results;
	};
	
	this.laydown_to_win = function(){
		
	};
	
	//helper methods
	this.sort_player_cards = function(){
		
	};
	
	this.running_score_total = function(){
	
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
        	}
        } 
    };
    
    this.evaluate_cards = function(hand){
		var suites = {'clubs': [], 'diamonds': [], 'hearts': [], 'spades': [], 'stars': []};
		var wilds = [];
		var buckets = {3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: []};
		var runs = [];
		var count = 1;

		hand.forEach(function(card){
			if(card.is_wild){
				wilds.push(card);	
			}else{
				buckets[card.value].push(card);	
			}
		});
		
		for(var k in buckets){
			if(buckets.hasOwnProperty(k)){
				if(buckets[k].length == 0){
					delete buckets[k];
				}
			}
		};
		
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
		
		for(var s in suites){
			if(suites.hasOwnProperty(s)){
				if(suites[s].length == 0){
					delete suites[s];
				} 
			}
		};
		
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
		console.log(runs);	
	};	
}
