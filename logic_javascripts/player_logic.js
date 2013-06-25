
function player(){
	this.hand = [];
	this.name = '';
	this.score = 0;
	
	this.deal = function(deck_ref, round){
		var _hand = [];
		for(var i = 0; i< round+2; i++){ //11 rounds starts at 1 (3 cards) last round has 13 cards 11+2
			_hand[i] = deck_ref.pop()
		}
		return {'hand': _hand, 'deck_ref': deck_ref};
	}
	
	this.draw_from_deck_or_discard = function(deck_ref){
		
		
	}
	
	this.discard = function(){
		
	}
	
	this.laydown = function(hand){
        var temp_hand = hand; // copy hand to work with
        var _set = [];
        var _run = [];
        var can_laydown = false;
        var cant_laydown = false;

        do{
            var first_card = temp_hand[0]; //make a temp copy of the first card since we have to push it onto both set and run
            _set.push(first_card);
            _run.push(first_card);

            var set_return = this.set(_set, temp_hand);
            if(set_return.length == hand.length){
                can_laydown = true;
            }else{
                var run_return = this.run(_run, temp_hand, 0);
                if(run_return.length == hand.length){
                    can_laydown = true;
                }else{
                    cant_laydown = true;
                }
            }
        }while(!can_laydown || !cant_laydown)
	}
	
	this.laydown_to_win = function(){
		
	}
	
	//helper methods
	this.sort_player_cards = function(){
		
	}
	
	this.running_score_total = function(){
	
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


//deck class
function deck(){	

	this.create_card = function(value, name, is_wild, suite) {
		var card = {
			value : value,
			name : name,
			is_wild : is_wild,
			suite : suite,
			display : ''	
		}
		return card;
	}
	
	this.build_deck = function(){
		var _deck = [];
		var card_names = ['three','four','five','six','seven','eight','nine','ten','jack','queen','king'];
		var card_values = [3,4,5,6,7,8,9,10,11,12,13];
		var suite = '';
		var cc = 0; //cc is the card count
		var is_wild = false;
        var svg_cards = return_svg_cards_as_assets();
        console.log(svg_cards);
		for(var i = 0; i < card_values.length; i++){
			for(var j = 0; j < 10; j++){
				if(i == 0){
					is_wild = true;
				}else{
					is_wild = false;
				}	
				if( j <= 1){
					suite = 'stars'; //and change the suite after 2 of each card in a suite is made.
					_deck[cc] = this.create_card(card_values[i], card_names[i], is_wild, suite,
						"<div class='"+suite + card_values[i]+"' onclick='card_handler(this);'></div>");
					cc++; //increment the card count each time				
				}else if(j > 1 && j <= 3){	
					suite = 'hearts'; 
					_deck[cc] = this.create_card(card_values[i], is_wild, suite,
						"<div class='"+suite + card_values[i]+"' onclick='card_handler(this);'></div>");
					cc++;
				}else if(j > 3 && j <= 5){
					suite = 'dimonds';
					_deck[cc] = this.create_card(card_values[i], card_names[i], is_wild, suite,
						"<div class='"+suite + card_values[i]+"' onclick='card_handler(this);'></div>");
					cc++;
				}else if (j > 5 && j <= 7){
					suite = 'spades';
					_deck[cc] = this.create_card(card_values[i], card_names[i], is_wild, suite,
						"<div class='"+suite + card_values[i]+"' onclick='card_handler(this);'></div>");
					cc++;
				}else if(j > 7 && j <= 9){
					suite = 'clubs';
					_deck[cc] = this.create_card(card_values[i], card_names[i], is_wild, suite,
						"<div class='"+suite + card_values[i]+ "' onclick='card_handler(this);'></div>");
					cc++;
				}
			}
		}
		//in a double deck there are 6 jokers
		for (var i = 0; i < 6; i++){
			_deck.push(this.create_card(1,'joker', true, 'none'));
		}
		return _deck;					
	} 
	
	this.shuffle = function(deck){
		for(var i = deck.length - 1; i > 0; i--){
			var j = Math.floor(Math.random() * (i+1));
			var temp = deck[i];
			deck[i] = deck[j];
			deck[j] = temp;
		}
		return deck;
	}	
}

function round() {	
	this.get_round = function(cur_round){
		return ++cur_round;		
	}
}

function game(){	
	//num of players and name of players must be same,
	//pass computer 1, computer 2, etc... for computer players
	this.initialize_game = function(num_of_players, name_of_players){
		var deck_instance = new deck;
		var round_instance = new round;
		var players = []
		for(var i = 0; i< num_of_players; i++){
			players[i] = new player;
			players[i].name = name_of_players[i];	

		}
		var _deck = deck_instance.build_deck();
		
		return 	{'deck_instance': deck_instance, 'round_instance': round_instance, 'deck': _deck, 'players': players};
	}
	
	this.new_round = function(game_constants){
		var _deck_instance = game_constants.deck_instance;
		var _deck = game_constants.deck;
		var _round = game_constants.round || 0;
		var _round_instance = game_constants.round_instance;
		var _players = game_constants.players;
		var _discard_pile = {};
		var deal_return = [];
		
		_deck = _deck_instance.shuffle(_deck);
		_round = _round_instance.get_round(_round);
		
		for(var i = 0; i < _players.length; i++){
			if(i == 0){
				deal_return	= _players[i].deal(_deck, _round);
			}else{
				deal_return = _players[i].deal(deal_return.deck_ref, _round);
			}
			_players[i].hand = deal_return.hand;	
		}
		//turn over the first card of the game
		//this will always be the zero index of the discard pile
		_discard_pile[0] = deal_return.deck_ref.pop();
		
		return {'players': _players, 'deck': deal_return.deck_ref, 'round_instance': _round_instance, 'round': _round, 'deck_instance': _deck_instance, 'discard_pile': _discard_pile};			
	}		
}



