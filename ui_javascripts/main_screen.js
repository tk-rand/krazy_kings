

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

var laydown_logic = {
	three : function(hand){
		 var _set = [];
		 var _run = [];

		 for(var i = hand.length; i > 0; i--){
		 	if(_set.length == 0){ //set is empty to start
		 		_set.push(hand[i]);
		 		_run.push(hand[i]);
		 	}else{
		 		for(var j = 0; j < _set.length; j++){
		 			if(_set[j].value == hand[i].value){
		 				if(_set.length <= 3){
		 					_set.push(hand[i]);	
		 				}else if(_run[j].suite == hand[i].suite){
		 					var hand_next = hand[i].value + 1;
		 					var hand_prev = hand[i].value - 1;
		 					var run_next = _run[j].value + 1;
		 					var run_prev = _run[j].value - 1;
		 					//2 is not valid values start at 3 except for jokers which are permanently wild and have a value of 1
		 					if(hand[i].name == 'joker' || run_prev != 2 || _run[j].name == 'joker'){
		 						//
		 						if(run_next == hand_next || run_prev == hand_prev){
		 							_run.push(hand[i]);	
		 						}		
		 					}
		 				}	
		 			}
		 		} 
		 	}	
		}
	}
}
