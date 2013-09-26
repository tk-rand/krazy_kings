 //player class
function player(){
	this.hand = [];
	this.name = '';
	this.score = 0;
	this.hand_area = '';
    this.actions_taken = []
	
	this.deal = function(deck_ref, round){
		var _hand = [];
		for(var i = 0; i< round+2; i++){ //11 rounds starts at 1 (3 cards) last round has 13 cards 11+2
			_hand[i] = deck_ref.pop()
		}
		return {'hand': _hand, 'deck_ref': deck_ref};
	}

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
	}

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
	}
	
	this.lay_down = function(){
        var temp_hand = [];
        for(var i = 0; i < this.hand.length; i++){
        	temp_hand[i] = this.hand[i];	
        }
        var _set = [];
        var _run = [];
        var can_laydown = false;
        var cant_laydown = false;

        do{
            var first_card = temp_hand.shift(0); //make a temp copy of the first card since we have to push it onto both set and run
             _set.push(first_card);
             _run.push(first_card);

            var set_return = this.set(_set, temp_hand);
            console.log(set_return, "and the length:", set_return.length, "and the hand length:", this.hand);
            if(set_return.length == this.hand.length){
                can_laydown = true;
            }else{
                var run_return = this.run(_run, temp_hand, 0);
                if(run_return.length == this.hand.length){
                    can_laydown = true;
                }else{
                    cant_laydown = true;
                }
            }
        }while(!can_laydown && !cant_laydown)
        return can_laydown;
	}
	
	this.laydown_to_win = function(){
		
	}
	
	//helper methods
	this.sort_player_cards = function(){
		
	}
	
	this.running_score_total = function(){
	
	}
	
	this.end_turn = function(_game){
		if(_game.current_player < _game.players.length - 1 ){
			_game.current_player += 1;		
		}else{
			_game.current_player = 0;	
		}
		this.clear_actions();
		return _game.current_player;
	}
	
	this.clear_actions = function(){
		if(this.actions_taken.length == 2){
			if(this.actions_taken.indexOf('discarded') != -1){
				this.actions_taken = [];
			}
		}
	} 

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
    }
    
	this.set = function(_set, hand){
        if(_set[0].is_wild && _set.length == 1){
            _set[0].value = hand[0].value;
        }
        if(_set[0].value == hand[0].value || hand[0].is_wild){
            _set.push(hand.shift());
            if(hand.length == 0){
                return _set;
            }else{
                return this.set(_set, hand);
            }
        }else{
            return _set;
        }
    }

    this.run = function(_run, hand, index){
        if(hand[0].is_wild){
            _run.push(hand.shift());
            if(hand.length == 0){
                return _run;
            }else{
                return this.run(_run, hand, index++);
            }
        }else{
            if(_run[index].is_wild){
                _run.push(hand.shift());
                index++;
                if(hand.length == 0){
                    return _run;
                }else if(hand.length != 0){
                    return this.run(_run, hand, index);
                }
            }else {
                if(_run[0].name == hand[0].name){
                    var temp_card_pos = hand[0].value + 1;
                    var temp_card_neg = hand[0].value - 1;
                    if(_run[index].value == temp_card_pos || _run[index].value == temp_card_neg){
                        _run.push(hand.shift());
                        if(hand.length == 0){
                            return _run;
                        }else{
                            return this.run(_run, hand, index++);
                        }
                    }else{
                        return _run;
                    }
                }else{
                    return _run;
                }
            }
        }
    }
}
