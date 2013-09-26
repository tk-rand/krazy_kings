
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
                        "<div class='card "+ suite + card_values[i]+"' data-element='"+suite + card_values[i]+"'></div>");
                    cc++; //increment the card count each time
                }else if(j > 1 && j <= 3){
                    suite = 'hearts';
                    _deck[cc] = this.create_card(card_values[i], card_names[i], is_wild, suite,
                        "<div class='card "+ suite + card_values[i]+"' data-element='"+suite + card_values[i]+"'></div>");
                    cc++;
                }else if(j > 3 && j <= 5){
                    suite = 'diamonds';
                    _deck[cc] = this.create_card(card_values[i], card_names[i], is_wild, suite,
                        "<div class='card "+ suite + card_values[i]+"' data-element='"+suite + card_values[i]+"'></div>");
                    cc++;
                }else if (j > 5 && j <= 7){
                    suite = 'spades';
                    _deck[cc] = this.create_card(card_values[i], card_names[i], is_wild, suite,
                        "<div class='card "+ suite + card_values[i]+"' data-element='"+suite + card_values[i]+"'></div>");
                    cc++;
                }else if(j > 7 && j <= 9){
                    suite = 'clubs';
                    _deck[cc] = this.create_card(card_values[i], card_names[i], is_wild, suite,
                        "<div class='card "+ suite + card_values[i]+ "' data-element='"+suite + card_values[i]+"'></div>");
                    cc++;
                }
            }
        }
        //in a double deck there are 6 jokers
        for (var i = 0; i < 6; i++){
            _deck.push(this.create_card(1,'joker', true, 'all', "<div class='cards joker' data-element='joker1'></div>"));
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

}