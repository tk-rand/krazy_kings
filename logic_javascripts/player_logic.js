 //player class
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
}
