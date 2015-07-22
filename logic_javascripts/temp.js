function evaluate_cards(hand) { 
    var suites = {
        'clubs' : [],
        'diamonds' : [],
        'hearts' : [],
        'spades' : [],
        'stars' : []
    };
    var wilds = [];
    var buckets = {
        3 : [],
        4 : [],
        5 : [],
        6 : [],
        7 : [],
        8 : [],
        9 : [],
        10 : [],
        11 : [],
        12 : [],
        13 : []
    };
    var runs = [];
    var sets = [];
    var r_num = -1; //starts at -1 so ++ will give 0 index
    var s_num = -1;
    var has_been_evaluated = false;
	var hand_length = hand.length;

    hand.forEach(function(card) {
        if (card.is_wild) {
            wilds.push(card);
        } else {
            buckets[card.value].push(card);
        }
    });

    //deletes empty buckets
    for (var k in buckets) {
        if (buckets.hasOwnProperty(k)) {
            if (buckets[k].length == 0) {
                delete buckets[k];
            }
        }
    }

    //pushes cards into suites
    for (var b in buckets) {
        if (buckets.hasOwnProperty(b)) {
            if (buckets[b].length > 1) {
                buckets[b].forEach(function(card) {
                    suites[card.suite].push(card);
                });
            } else {
                suites[buckets[b][0].suite].push(buckets[b][0]);
            }
        }
    }

    //deletes empty suites
    for (var s in suites) {
        if (suites.hasOwnProperty(s)) {
            if (suites[s].length == 0) {
                delete suites[s];
            }
        }
    }
	
	// test case: [3,3,3 5,6,7,8, 13,13,13] with 3,5,6,7,8,13 (one of 3 and 13) being in the same suite
	//fail run test: [3,4,4,5], [3,5,5,w]
	//pass run test: [3,4,5,6]
	
	
	for (var suite in suites) {
		if (suites.hasOwnProperty(suite)) {
			var suite_array = suites[suite];
			var s_length = suite_array.length;
			
			//first check: see if hand length is greater then 5
			if(hand_length > 5 && s_length >= 6){
				
			}else if(hand_length > 5 && s_length >= 3){
                
            }else if(hand_length < 5 && s_length >= 3){
            
				//see if the run is all the cards we have
				if(s_length === hand_length){
					var range = suite_array[s_length - 1] - suite_array[0];
					
					//perfect range with less then 6 cards means no dupes and we have a run we can laydown
					if( (range + 1)  === s_length){
						r_num++;
						suite_array.forEach(function(card){
							runs[r_num].push(card);
						});
					}else{ //wasn't a perfect run but we know we arn't working with wilds because of first if s_length === hand_length
                        var temp_suite = suite_array.remove_dupes();
                        if(temp_suite.length >= 3){
                            r_num++;
                            temp_suite.forEach(function(card){
                                runs[r_num++].push(card);    
                            });
                        } 
                    }
				}else{ //working with more cards then just a single suite
                    var poss_sets = [];
                    suite_array.forEach(function(card){
                        if(buckets[card.value].length > 1){
                            poss_sets.push(card.value);
                        }
                    });
                    //nope no possible sets
                    if(poss_sets.length === 0){
                        var temp_suite = suite_array.remove_dupes();
                        var range = temp_suite[s_length - 1] - temp_suite[0];
                        
                        //cases involving wilds and runs and only one suite in hands with less then 5 cards go here
                        if(wilds.length > 0){
                            //valid run of wilds and suite with no possiblity of sets
                            if(range === temp_suite.length || range === 1 || (range + 1) === temp_suite.length){
                                if( (wilds.length + temp_suite.length) >= 3 ){
                                    r_num++;
                                    temp_suite.forEach(function(card){
                                        runs[r_num].push(card);
                                    });
                                    wilds.forEach(function(card){
                                       runs[r_num].push(card); 
                                    });
                                }
                            }
                        }
                    }else{ //there are some possible sets
                        poss_sets.forEach(function(value){
                            //valid set without wilds to begin with
                            if(buckets[value].length >= 3){
                                s_num++;
                                buckets[value].forEach(function(card){
                                    sets[s_num].push(card);
                                });
                                //if we only have 1 or 2 cards left and any happen to be wild toss them on the set
                                if(hand_length - sets[s_num].length <= 2 && wilds.length > 0 ){
                                    wilds.forEach(function(card){
                                        sets[s_num].push(card);
                                    })
                                }
                            }else { //had some duplicates but not enough to make a set by themselves
                                //can only do something with these if we have some wilds
                                if(wilds.length > 0){
                                    var temp_suite = suite_array.remove_dupes();
                                    var run_total = 0;
                                    var set_total = 0;
                                    
                                    for(var i = 0; i < temp_suite.length; i++){
                                        run_total += temp_suite[i].value
                                    }
                                    for(var j = 0; j < buckets[value].length; j++){
                                        set_total += buckets[value][j].value;
                                    }
                                    //run is more valuable partial laydown then set
                                    if(run_total >= set_total){
                                        r_num++;
                                        suite_array.forEach(function(card){
                                            runs[r_num].push(card);    
                                        });
                                        wilds.forEach(function(card){
                                            runs[r_num].push(card);
                                        });
                                    }else{ //set is worth more then run in partial laydown
                                        s_num++;
                                        buckets[value].forEach(function(card){
                                            sets[s_num].push(card);    
                                        });
                                        wilds.forEach(function(card){
                                            sets[s_num].push(card); 
                                        });
                                    }
                                }
                            }
                        });
                    } 
                }
			}
		}
	}
};

function test_hand_evaluation(){
    // test case: [3,3,3 5,6,7,8, 13,13,13] with 3,5,6,7,8,13 (one of 3 and 13) being in the same suite
	//fail run test: [3,4,4,5]
	//pass run test: [3,4,5,6]
    //partial laydown tests: [3,3,4,w] = 3 LO, [3,4,4,w] = 3 LO, [3,3,4,5,w] = 3 LO
	
    var test_hands = {
        'one': [
            {
                value: 4,
                suite: 'clubs',
                is_wild: false
            },
            {
                value: 3,
                suite: 'clubs',
                is_wild: false
            },
            {
                value: 5,
                suite: 'clubs',
                is_wild: false
            },
            {
                value: 6,
                suite: 'clubs',
                is_wild: false
            }
        ]
    }
    
    var test_results = evaluate_cards(test_hands.one);
    console.log(test_results);
}