
function player(){
	
	this.deal = function(){
		switch(current_round.get){
			case 1:
				{
					return 3; //TODO change this to return 3 cards not just 3
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
	
	var current_round = {
		cur_round : 1,
		
		get : function(){
			return this;
		},
		
		set : function(){
			this.cur_round += 1; 
		}
	}
}


function deck(){
	this.cards = {
		'three' : {
			red : 2,
			blue : 2,
			green : 2,
			yellow : 2,
			black : 2,
			is_wild : true //three starts every game as wild so it's default is set to true.
		},
		'four' : {
			red : 2,
			blue : 2,
			green : 2,
			yellow : 2,
			black : 2,
			is_wild : false
		},
		'five' : {
			red : 2,
			blue : 2,
			green : 2,
			yellow : 2,
			black : 2,
			is_wild : false
		},
		'six' : {
			red : 2,
			blue : 2,
			green : 2,
			yellow : 2,
			black : 2,
			is_wild : false
		},
		'seven' : {
			red : 2,
			blue : 2,
			green : 2,
			yellow : 2,
			black : 2,
			is_wild : false
		},
		'eight' : {
			red : 2,
			blue : 2,
			green : 2,
			yellow : 2,
			black : 2,
			is_wild : false
		},
		'nine' : {
			red : 2,
			blue : 2,
			green : 2,
			yellow : 2,
			black : 2,
			is_wild : false
		},
		'ten' : {
			red : 2,
			blue : 2,
			green : 2,
			yellow : 2,
			black : 2,
			is_wild : false
		},
		'jack' : {
			red : 2,
			blue : 2,
			green : 2,
			yellow : 2,
			black : 2,
			is_wild : false
		},
		'queen' : {
			red : 2,
			blue : 2,
			green : 2,
			yellow : 2,
			black : 2,
			is_wild : false
		},
		'king' : {
			red : 2,
			blue : 2,
			green : 2,
			yellow : 2,
			black : 2,
			is_wild : false
		},
		'joker' : {
			number : 6,
			is_wild : true //jokers are always wild
		},
			
		get : function(){
			return this;
		},
	
		set_is_wild : function (round) {
			switch(round){
				case 'four':
				{
					this.three.is_wild = false;
					this.four.is_wild = true;
					break;	
				}
				case 'five':
				{
					this.four.is_wild = false;
					this.five.is_wild = true;
					break;
				}
				case 'six':
				{
					this.five.is_wild = false;
					this.six.is_wild = true;
					break;
				}
				case 'seven':
				{
					this.six.is_wild = false;
					this.seven.is_wild = true;
					break;
				}
				case 'eight':
				{
					this.seven.is_wild = false;
					this.eight.is_wild = true;
					break;
				}
				case 'nine':
				{
					this.eight.is_wild = false;
					this.nine.is_wild = true;
					break;
				}
				case 'ten':
				{
					this.nine.is_wild = false;
					this.ten.is_wild = true;
					break;
				}
				case 'jack':
				{
					this.ten.is_wild = false;
					this.jack.is_wild = true;
					break;
				}
				case 'queen':
				{
					this.jack.is_wild = false;
					this.queen.is_wild = true;
					break;
				}
				case 'king':
				{
					this.queen.is_wild = false;
					this.king.is_wild = true;
					break;
				}				
			}
			return "This round "+round+"'s are wild!";		  
		}
	}
	
	this.shuffle = function(){
		
	}
	
}

function game(){
	var _deck = new deck;
	console.log(_deck.cards.get());
	console.log(_deck.cards.set_is_wild('queen'));	
}



