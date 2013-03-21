
function player(){
	var hand = [];

	this.deal = function(deck_ref, round){
		switch(round){
			case 1:
				{	
					for(var i = 0;i <= 2; i++){
						hand[i] = deck_ref.pop();	
					}
					return hand;
					break;
				}
			case 2:
				{
					return 4;
				}
			case 3:
				{
					return 5;
				}
			case 4:
				{
					return 6;
				}
			case 5:
				{
					return 7;
				}
		}
	}
	
	this.hand = function(){
		
	}
	
	this.draw_from_deck_or_discard = function(){
		
	}
	
	this.discard = function(){
		
	}
	
	this.laydown = function(){
		
	}
	
	this.laydown_to_win = function(){
		
	}
	
	//helper methods
	this.sort_player_cards = function(){
		
	}
	
	this.running_score_total = function(){
	
	}
}


//deck class
function deck(){	

	this.create_card = function(value, is_wild, suite) {
		var card = {
			value : value,
			is_wild : is_wild,
			suite : suite	
		}
		return card;
	}
	
	this.build_deck = function(){
		var _deck = [];
		var card_values = ['three','four','five','six','seven','eight','nine','ten','jack','queen','king'];
		var suite = '';
		var cc = 0; //cc is the card count
		var is_wild = false;
		for(var i = 0; i < card_values.length; i++){
			for(var j = 0; j < 10; j++){
				if(i == 0){
					is_wild = true;
				}else{
					is_wild = false;
				}	
				if( j <= 1){
					suite = 'stars'; //and change the suite after 2 of each card in a suite is made.
					_deck[cc] = this.create_card(card_values[i], is_wild, suite);
					cc++; //increment the card count each time				
				}else if(j > 1 && j <= 3){	
					suite = 'hearts'; 
					_deck[cc] = this.create_card(card_values[i], is_wild, suite);
					cc++;
				}else if(j > 3 && j <= 5){
					suite = 'dimonds';
					_deck[cc] = this.create_card(card_values[i], is_wild, suite);
					cc++;
				}else if (j > 5 && j <= 7){
					suite = 'spades';
					_deck[cc] = this.create_card(card_values[i], is_wild, suite);
					cc++;
				}else if(j > 7 && j <= 9){
					suite = 'clubs';
					_deck[cc] = this.create_card(card_values[i], is_wild, suite);
					cc++;
				}
			}
		}
		//in a double deck there are 6 jokers
		for (var i = 0; i < 6; i++){
			_deck.push(this.create_card('joker', true, 'none'));
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
	
	this.round = function(){
		var cur_round = 0;
		return ++cur_round;		
	}
}


function game(){
	var game = new deck;
	var _deck = game.build_deck();
	var current_round = new round;
	_deck = game.shuffle(_deck);

	var players = new player;

	return players.deal(_deck, current_round.round());
		
}



