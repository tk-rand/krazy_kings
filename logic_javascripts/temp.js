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

//old evaluate code
// var suites = {
//         'clubs' : [],
//         'diamonds' : [],
//         'hearts' : [],
//         'spades' : [],
//         'stars' : []
//     };
//     var wilds = [];
//     var buckets = {
//         3 : [],
//         4 : [],
//         5 : [],
//         6 : [],
//         7 : [],
//         8 : [],
//         9 : [],
//         10 : [],
//         11 : [],
//         12 : [],
//         13 : []
//     };
//     var runs = [];
//     var sets = [];
//     var r_num = -1; //starts at -1 so ++ will give 0 index
//     var s_num = -1;
//     var has_been_evaluated = false;

//     hand.forEach(function(card) {
//         if (card.is_wild) {
//             wilds.push(card);
//         } else {
//             buckets[card.value].push(card);
//         }
//     });

//     //deletes empty buckets
//     for (var k in buckets) {
//         if (buckets.hasOwnProperty(k)) {
//             if (buckets[k].length == 0) {
//                 delete buckets[k];
//             }
//         }
//     }

//     //pushes cards into suites
//     for (var b in buckets) {
//         if (buckets.hasOwnProperty(b)) {
//             if (buckets[b].length > 1) {
//                 buckets[b].forEach(function(card) {
//                     suites[card.suite].push(card);
//                 });
//             } else {
//                 suites[buckets[b][0].suite].push(buckets[b][0]);
//             }
//         }
//     }

//     //deletes empty suites
//     for (var s in suites) {
//         if (suites.hasOwnProperty(s)) {
//             if (suites[s].length == 0) {
//                 delete suites[s];
//             }
//         }
//     }
    
//     this.determin_sets = function(){
//         for (var c in buckets) {
//             if (buckets.hasOwnProperty(c)) {
//                 if(buckets[c].length >= 2 ){
//                     /* The following 2 lines are inside the each if statement cause we don't want a set consisting 
//                      * of just one card if a bucket only has one card in it, but it's easier to use wilds
//                      * in sets then it is in runs so if there are lots of wilds I do make valid sets out 
//                      * buckets with just one card in them. So I only initilize a new "set" if I can actually make one.
//                      */
//                     s_num++; 
//                     sets[s_num] = [];
               
//                     if (buckets[c].length == 2 && wilds.length > 0) {
//                         buckets[c].forEach(function(card) {
//                             sets[s_num].push(card);
//                             //next 2 lines remove the card from the suite it was in so it can't be used in a run.
//                             var index = suites[card.suite].map(function(a){return a.value;}).indexOf(card.value);
//                             suites[card.suite].splice(index, 1);
//                         });
//                         sets[s_num].push(wilds.pop());
//                     } else if (buckets[c].length > 2) {
//                         buckets[c].forEach(function(card) {
//                             sets[s_num].push(card);
//                             var index = suites[card.suite].map(function(a){return a.value;}).indexOf(card.value);
//                             suites[card.suite].splice(index, 1);
//                         });
//                     }      
//                 }else if (buckets[c].length == 1 && wilds.length >= 2) {
//                     s_num++; 
//                     sets[s_num] = [];
                    
//                     buckets[c].forEach(function(card) {
//                         sets[s_num].push(card);
//                         var index = suites[card.suite].map(function(a){return a.value;}).indexOf(card.value);
//                         suites[card.suite].splice(index, 1);
//                     });
//                     //yes I'm repeating myself here it makes a set and that's how human players think about it.
//                     sets[s_num].push(wilds.pop());
//                     sets[s_num].push(wilds.pop()); 
//                 }
//             }
//         }
//     };


//     this.determin_runs = function(){
//         for (var s in suites){
//             if(suites.hasOwnProperty(s)){
//                 var suite_length = suites[s].length;
//                 if(suite_length >= 2){
//                     var range = suites[s][suite_length - 1].value - suites[s][0].value;
//                     r_num++;
//                     runs[r_num] = [];
                    
//                     if( (range - 1) >= wilds.length && (range - 1) == suite_length){
//                         suites[s].forEach(function(card){
//                             runs[r_num].push(card);
//                         });
//                         while(runs[r_num].length <= (range + 1) && wilds.length != 0){
//                             runs[r_num].push(wilds.pop());
//                         }
//                    }else if(range == 1 && wilds.length >= 1){
//                         suites[s].forEach(function(card){
//                             runs[r_num].push(card);
//                         });
//                         runs[r_num].push(wilds.pop()); 
//                     }else if( range == suite_length && wilds.length >= 1){
//                         suites[s].forEach(function(card){
//                             runs[r_num].push(card);
//                         });
//                         runs[r_num].push(wilds.pop());
//                     }else if( (range + 1) == suite_length){
//                         suites[s].forEach(function(card){
//                             runs[r_num].push(card);
//                         });
//                     }
//                 }
//             }
//         } 
//     };
    
//     if(has_been_evaluated == false){
//         if(r_first){
//             this.determin_runs();
//             this.determin_sets();
//         }else{
//             this.determin_sets();
//             this.determin_runs();
//         }
//         has_been_evaluated = true;
//     }


//     //if I have any extra wilds throw them on where I can
//     if(wilds.length != 0){
//         while(wilds.length != 0){
//             if(runs[0] != undefined && runs[0].length != 0){
//                 runs[0].push(wilds.pop());
//             }else if(sets[0]!= undefined && sets[0].length != 0){
//                 sets[0].push(wilds.pop());
//             }else if(wilds.length >= 3){ //This last case takes care of hands that are all wild by treating them like a set.
//                 sets[0] = [];
//                 sets[0].push(wilds.pop());
//             }
//         }
//     }

//     var results = {
//         r_sets : sets,
//         r_runs : runs
//     };
//     return results;