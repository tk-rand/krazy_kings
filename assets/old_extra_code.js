		// for(var k in buckets){
			// if(buckets.hasOwnProperty(k)){
				// if(buckets[k].length >= 3 && buckets[k] != buckets.w_bucket){
					// num_of_sets++;	
				// }else if(buckets.w_bucket.length > 0 && buckets[k].length == 2){
					// buckets[k].push(buckets.w_bucket.shift());
					// num_of_sets++;
				// }else if(buckets[k].length < 3 && buckets.w_bucket.length > 1){
						// for(var i = 0; i < buckets.w_bucket.length; i++){
							// buckets[k].push(buckets.w_bucket.shift());
						// }
						// if(buckets[k].length >= 3){
							// num_of_sets++;
						// }
				// }else if(num_of_sets == 0){
					// if(buckets[k].length > 0){
						// if(suit == ''){
							// suit = buckets[k][0].suit;		
						// }else if(suit == buckets[k][0].suit){
							// cards_in_run++;	
						// }else{
							// suit = '';
						// }
						// if(cards_in_run != 0 && cards_in_run < 3 && buckets.w_bucket.length != 0){
							// cards_in_run++;	
						// }
					// }
					// if(cards_in_run >= 3){
						// num_of_runs++;
						// cards_in_run = 0;	
					// }
				// }	
			// }
		// }
// 		
		// return {'runs':num_of_runs, 'sets': num_of_sets};	
		

	// this.set = function(_set, hand){
        // if(_set[0].is_wild && _set.length == 1){
            // _set[0].value = hand[0].value;
        // }
        // if(_set[0].value == hand[0].value || hand[0].is_wild){
            // _set.push(hand.shift());
            // if(hand.length == 0){
                // return _set;
            // }else{
                // return this.set(_set, hand);
            // }
        // }else{
            // return _set;
        // }
    // }
// 
    // this.run = function(_run, hand, index){
        // if(hand[0].is_wild){
            // _run.push(hand.shift());
            // if(hand.length == 0){
                // return _run;
            // }else{
                // return this.run(_run, hand, index++);
            // }
        // }else{
            // if(_run[index].is_wild){
                // _run.push(hand.shift());
                // index++;
                // if(hand.length == 0){
                    // return _run;
                // }else if(hand.length != 0){
                    // return this.run(_run, hand, index);
                // }
            // }else {
            	// console.log("first in run: ", _run[0], "first in hand: ", hand[0] )
                // if(_run[index].suite == hand[0].suite){
                    // var temp_card_pos = hand[0].value + 1;
                    // var temp_card_neg = hand[0].value - 1;
                    // if(_run[index].value == temp_card_pos || _run[index].value == temp_card_neg){
                        // _run.push(hand.shift());
                        // if(hand.length == 0){
                            // return _run;
                        // }else{
                            // return this.run(_run, hand, index++);
                        // }
                    // }else{
                        // return _run;
                    // }
                // }else{
                    // return _run;
                // }
            // }
        // }
    // }
    
        // do{
        	// first_card = temp_hand.shift(0); //make a temp copy of the first card since we have to push it onto both set and run
            // _set.push(first_card);
//              
            // var set_return = this.set(_set, temp_hand);
            // console.log(set_return, "and the length:", set_return.length, "and the hand length:", this.hand);
            // if(set_return.length == this.hand.length){
                // can_laydown = true;
            // }else{
            	// temp_hand = [];
//             	
            	// for(var i = 0; i < this.hand.length; i++){ //because of pass by reference the temp hand gets modified, so we have to re-copy it
        			// temp_hand[i] = this.hand[i]; 	
        		// }
//         		
        		// first_card = temp_hand.shift(0);
            	// _run.push(first_card);
                // var run_return = this.run(_run, temp_hand, 0);
                // if(run_return.length == this.hand.length){
                    // can_laydown = true;
                // }else{
                    // cant_laydown = true;
                // }
            // }
        // }while(!can_laydown && !cant_laydown)
        //return can_laydown;
        

        // var _set = [];
        // var _run = [];
        // var can_laydown = false;
        // var cant_laydown = false;
        // var first_card = {};
        
		// var num_of_sets = 0;
		// var num_of_runs = 0;
		// var cards_in_run = 0;
		// var suit = '';