Player.prototype.evaluate_cards = function(hand){
	var matrix = {
		'clubs'    :   {3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0},
        'diamonds' :   {3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0},
        'hearts'   :   {3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0},
        'spades'   :   {3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0},
        'stars'    :   {3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0, 9 : 0, 10 : 0, 11 : 0, 12 : 0, 13 : 0}
	}
	var wilds = 0;
	var melds = [];
	var value = this.leftover_value();
	
	hand.forEach(function(card){
		if(card.is_wild){
			wilds++;
		}else{
			matrix[card.suite][card.value]++;
		}
	});
	
	this.find_melds = function(suite, num, multi){
		if(suite == undefined || num == undefined || multi == undefined){
			suite = num = multi = 0;
		}
		
		if(wilds > 2){
			for(var i = 0; i < wilds; i++){
				//recrusion s == suite, n == num, m == multi
				melds.push({s: -1, n: -1, m: -1});
			}
		}
		
		//search until laydown or final value is found
		while(value > 0){
			//find the next card in matrix
			while(matrix[suite][num] <= multi){
				multi = 0;
				if(++num > 10){
					num = 0;
					if(++suite > 4){
						return;
					}
				}
			}
			
			//t == type, type is reserved
			for(var t = 0; t < 2; t++){
				//find a set or run at current matrix position
				var meld = t ? this.find_set(suite, num, multi) : this.find_run(suite, num, multi);
				
				//try different lengths for long sets or runs
				for(var len = 3; len <= meld.length; len++){
					
				}
			}
		}
	};
}