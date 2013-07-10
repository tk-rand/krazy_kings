
//deck class
function deck(){

    this.create_card = function(value, name, is_wild, suite, display) {
        var card = {
            value : value,
            name : name,
            is_wild : is_wild,
            suite : suite,
            display : display
        }
        return card;
    }

    this.build_deck = function(){
        var _deck = [];
        var card_names = ['three','four','five','six','seven','eight','nine','ten','jack','queen','king'];
        var card_values = [3,4,5,6,7,8,9,10,11,12,13];
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
                    _deck[cc] = this.create_card(card_values[i], card_names[i], is_wild, suite,
                        "<div class='card "+ suite + card_values[i]+"' onclick='card_handler(this);'></div>");
                    cc++; //increment the card count each time
                }else if(j > 1 && j <= 3){
                    suite = 'hearts';
                    _deck[cc] = this.create_card(card_values[i], is_wild, suite,
                        "<div class='card "+ suite + card_values[i]+"' onclick='card_handler(this);'></div>");
                    cc++;
                }else if(j > 3 && j <= 5){
                    suite = 'diamonds';
                    _deck[cc] = this.create_card(card_values[i], card_names[i], is_wild, suite,
                        "<div class='card "+ suite + card_values[i]+"' onclick='card_handler(this);'></div>");
                    cc++;
                }else if (j > 5 && j <= 7){
                    suite = 'spades';
                    _deck[cc] = this.create_card(card_values[i], card_names[i], is_wild, suite,
                        "<div class='card "+ suite + card_values[i]+"' onclick='card_handler(this);'></div>");
                    cc++;
                }else if(j > 7 && j <= 9){
                    suite = 'clubs';
                    _deck[cc] = this.create_card(card_values[i], card_names[i], is_wild, suite,
                        "<div class='card "+ suite + card_values[i]+ "' onclick='card_handler(this);'></div>");
                    cc++;
                }
            }
        }
        //in a double deck there are 6 jokers
        for (var i = 0; i < 6; i++){
            _deck.push(this.create_card(1,'joker', true, 'none'));
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

    //helper methods
    this.set = function(_set, hand){
        if(_set[0].is_wild && _set.length == 1){
            _set[0].value = hand[0].value;
        }
        if(_set[0].value == hand[0].value || hand[0].is_wild){
            _set.push(hand.shift());
            if(hand.length == 0){
                return _set;
            }else{
                return this.set(_set, hand);
            }
        }else{
            return _set;
        }
    }

    this.run = function(_run, hand, index){
        if(hand[0].is_wild){
            _run.push(hand.shift());
            if(hand.length == 0){
                return _run;
            }else{
                return this.run(_run, hand, index++);
            }
        }else{
            if(_run[index].is_wild){
                _run.push(hand.shift());
                index++;
                if(hand.length == 0){
                    return _run;
                }else if(hand.length != 0){
                    return this.run(_run, hand, index);
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
                            return this.run(_run, hand, index++);
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
}