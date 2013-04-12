

//Main Game class instansiates a new game
//Also starts the game which deals the first round to each player
function Game(){
	this.game = new game;
	var player_names = ['ryan','computer_1', 'computer_2', 'computer_3'];
	this.num_of_players = 4;
	this.player_that_ends_round = null;
	//create the players and the deck
	this.game_constants = _game.initialize_game(4, player_names);
	this.game_constants = _game.new_round(game_constants);
	
}

//current_round is called by a player action
//@obj is the object that the player action happened on
Game.prototype.current_round = function(obj){
	var action = obj.getAttribute('id');
	var current_player = this.game_constants.players[player_num];
	
	switch(action){
		case 'draw_deck':{
			var card = current_player.draw_from_deck_or_discard(game_constants.deck);
			break;
		}
		case 'draw_discard':{
			var card = current_player.draw_from_deck_or_discard(this.game_constants.discard_pile);
			return current_playerplayer.hand.push(card);
			break;
		}case 'end_turn':{
			if(player_num <= num_of_players ){
				return player_num++;
			}else{
				return player_num = 0; //go back to first player
			}
			break;
		}case 'laydown':{
			var can_laydown = this.can_player_laydown(current_player.hand);
			if(can_laydown.can){
				current_player.hand = current_player.laydown(current_player.hand);
				current_player.score = this.calculate_score(current_player.hand);
			}else{
				alert('You can not lay down at this time');
			}
			break;	
		}case 'laydown_to_win':{
			var can_laydown = this.can_player_laydown(current_player.hand);
			if(can_laydown.can){
				this.current_player.laydown_to_win(current_player.hand);
				this.player_that_ends_round = player_num;
				this.warn_other_players();
			}else{
				alert("You don't have the correct cards to laydown!");
			}
			break;
		}
		
	}			
}

//accepts a players hand
//returns a bool named can, and an array of objects that represent
//what's left in the hand and what was layed down.  
Game.prototype.can_player_laydown = function(hand){
	
}

Game.prototype.warn_other_players = function(){
	
}

function laydown(hand){
    var temp_hand = hand; // copy hand to work with
    var _set = [];
    var _run = [];
    var can_laydown = false;
    var cant_laydown = false;

    do{
        var first_card = temp_hand[0]; //make a temp copy of the first card since we have to push it onto both set and run
        _set.push(first_card);
        _run.push(first_card);

        var set_return = set(_set, temp_hand);
        if(set_return.length == hand.length){
            can_laydown = true;
        }else{
            var run_return = run(_run, temp_hand, 0);
            if(run_return.length == hand.length){
                can_laydown = true;
            }else{
                cant_laydown = true;
            }
        }
    }while(!can_laydown || !cant_laydown)
}

function set(_set, hand){

    if(_set[0].value == hand[0].value || hand[0].is_wild){
        _set.push(hand.shift());
        if(hand.length == 0){
            return _set;
        }else{
            return set(_set, hand);
        }
    }else{
        return _set;
    }
}

function run(_run, hand, index){
    if(hand[0].is_wild){
        _run.push(hand.shift());
        if(hand.length == 0){
            return _run;
        }else{
            return run(_run, hand, index++);
        }
    }else{
        if(_run[index].is_wild){
            _run.push(hand.shift());
            index++;
            if(hand.length == 0){
                return _run;
            }else if(hand.length != 0){
                return run(_run, hand, index);
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
                        return run(_run, hand, index++);
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
