Player.prototype.evaluate_cards = function(hand){
	function Evaluated_hand(hand){
		var matrix = [[0,0,0,0,0,0,0,0,0,0,0],  //clubs
					  [0,0,0,0,0,0,0,0,0,0,0],  //diamonds
					  [0,0,0,0,0,0,0,0,0,0,0],  //hearts
					  [0,0,0,0,0,0,0,0,0,0,0],  //spades
					  [0,0,0,0,0,0,0,0,0,0,0]]; //stars
		var wilds = 0;
		var melds = [];
		var value = this.leftover_value();
		var round = game_constants.round_instance.round;
		
		hand.forEach(function(card){
			if(card.is_wild){
				wilds++;
			}else{
				switch (card.suite){
					case 'clubs':{
						matrix[0][card.value]++;
						break;
					}
					case 'diamonds':{
						matrix[1][card.value]++;
						break;
					}
					case 'hearts':{
						matrix[2][card.value]++;
						break;
					}
					case 'spades':{
						matrix[3][card.value]++;
						break;
					}
					case 'stars':{
						matrix[4][card.value]++;
						break;
					}
				}
			}
		});
	}
	
	Evaluated_hand.prototype.find_melds = function(suite, num){
		if(suite == undefined || num == undefined){
			suite = num = 0;
		}
		
		if(this.wilds > 2){
			for(var i = 0; i < this.wilds; i++){
				//recrusion s == suite, n == num
				this.melds.push({suite: -1, num: -1});
			}
			 this.value -= 25 * this.wilds - (22 - this.round) * this.wilds;
		}
		
		//search until laydown or final value is found
		while(this.value > 0){
			//find the next card in matrix
			while(num > 10 || this.matrix[suite][num] == 0){
				if(++num > 10){
					num = 0;
					if(++suite > 4){
						return;
					}
				}
			}
			
			for(var meld_type = 0; meld_type < 2; meld_type++){
				//find a set or run at current matrix position
				var meld = meld_type ? this.find_set(suite, num) : this.find_run(suite, num);
				
				//try different lengths for long sets or runs
				for(var len = 3; len <= meld.length; len++){
					var test = new Evaluated_hand(hand)
					this.remove_cards(meld.slice(0, len));
					
					meld_type ? this.find_melds(suite, num) : this.find_melds(0,0);
					
					if(test.value < this.value){
						this.value = test.value;
						this.melds.length = 0;
						this.melds = [].concat(meld.slice(0, len), test.melds);
					}
				}
			}
			num++;
		}
	};
	
	Evaluated_hand.prototype.find_run = function(suite, num){
		var run = [];
		var wilds = this.wilds;
		while(num < 11){
			if(this.matrix[suite][num] > 0){
				run.push({suite: suite, num: num});
			}else if(wilds > 0){
				run.push({suite: -1, num: -1});
				wilds --;
			}else{
				break;
			}
			num++;
		}
		
		while(wilds-- > 0){
			run.push({suite: -1, num: -1});
		}
		return run;	
	};
	
	Evaluated_hand.prototype.find_set = function(suite, num){
		var set = [];
		while(suite < 5){
			for(var i = 0; i < this.matrix[suite][num]; i++){
				set.push({suite: suite, num: num});
			}
			suite++;
		}
		
		for(var i = 0; i < this.wilds; i++){
			set.push({suite: -1, num: -1});
		}
		return set;
	};
	
	Evaluated_hand.prototype.leftover_value = function(){
		var leftover = 0;
		for(var i = 0; i < 5; i++){
			for(var j = 0; j < 11; j++){
				leftover += this.matrix[i][j] * (j + 3);
			}
		}
		return leftover + 25 * this.wilds - (22 - this.round) * (this.wilds);	
	};
	
	var results = new Evaluated_hand(hand);
	results.find_melds();
	console.log("melds:", results.melds, "\n value: ", results.value);
}