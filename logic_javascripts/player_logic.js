//player class
function Player() {
    this.hand = [];
    this.name = '';
    this.score = 0;
    this.hand_area = '';
    this.actions_taken = [];
    this.has_been_scored = false;
}
Player.prototype.deal = function(deck_ref, round){
    var _hand = [];
    for(var i = 0; i< round+2; i++){ //11 rounds starts at 1 (3 cards) last round has 13 cards 11+2
        _hand[i] = deck_ref.pop();
    }
    return {'hand': _hand, 'deck_ref': deck_ref};
};

Player.prototype.draw_from_deck_or_discard = function(deck_and_dc, d_or_dc){
    if(d_or_dc == 'deck'){
        this.hand.push(deck_and_dc.pop());
        this.actions_taken.push('drew');
        return deck_and_dc;
    }else if(d_or_dc == 'discard'){
        this.hand.push(deck_and_dc.discard_pile.pop());
        this.actions_taken.push('drew');
    }
};

Player.prototype.discard = function(card_to_discard, round_constants){
    var card_name = '';
    var element_data = card_to_discard.getAttribute('data-element');

    for(var i = 0; i < this.hand.length; i++){
        card_name = this.hand[i].suite + this.hand[i].value;
        if(element_data == card_name){
            var discarded_card = this.hand.splice(i,1);
            this.actions_taken.push('discarded');
            round_constants.discard_pile.push(discarded_card[0]); //splice returns an array, facepalm
        }
    }
};

Player.prototype.lay_down = function(){
    var temp_hand = [];

    for(var i = 0; i < this.hand.length; i++){
        temp_hand[i] = this.hand[i];
    }

    var results = this.evaluate_cards(temp_hand);

    return results;
};

//helper methods
Player.prototype.sort_player_cards = function(){

};

Player.prototype.running_score_total = function(cards_laid_down){
    var cards_not_laid_down = [];
    var compare = _game.round_constants.deck_instance.compare;
    if(cards_laid_down != 0 && cards_laid_down != undefined){
        for(var key in cards_laid_down){
            if(cards_laid_down.hasOwnProperty(key)){
                var sub_array = cards_laid_down[key];
                popped:
                for(var i = 0; i < this.hand.length; i++){
                    for(var j = 0; j < sub_array.length; j++){
                        if(compare(this.hand[i], sub_array[j])){
                            continue popped;
                        }else if(j == sub_array.lengh -1){
                            cards_not_laid_down.push(this.hand[i]);
                        }
                    }
                }
            }
        }
    }
    if(cards_not_laid_down.length == 0){
        this.score += 0;
    }else{
        for(var i = 0; i < cards_not_laid_down.lengh; i++){
            this.score += cards_not_laid_down[i].value;
        }
    }
    this.has_been_scored = true;
};


Player.prototype.end_turn = function(_game){
    if(_game.current_player < _game.players.length - 1 ){
        _game.current_player += 1;
    }else{
        _game.current_player = 0;
    }
    this.clear_actions();
    return _game.current_player;
};

Player.prototype.clear_actions = function(){
    if(this.actions_taken.length == 2){
        if(this.actions_taken.indexOf('discarded') != -1){
            this.actions_taken = [];
        }
    }
};

Player.prototype.can_player_move = function(element){
    switch(element){
        case 'deck':{
            if(this.actions_taken.indexOf('drew') == -1){
                return true;
            }else{
                return false;
            }
            break;
        }
        case 'discard':{
            if(this.actions_taken.indexOf('drew') == -1){
                return true;
            }else{
                return false;
            }
            break;
        }
        case this.hand_area:{
            if(this.actions_taken.indexOf('drew') != -1){
                if(this.actions_taken.indexOf('discarded') == -1){
                    return true;
                }else{
                    return false;
                }
            }
            break;
        }
        case 'end_turn':{
            if(this.actions_taken.indexOf('discarded') != -1){
                return true;
            }else{
                return false;
            }
            break;
        }
        case 'lay_down':{
            if(this.actions_taken.indexOf('discarded') != -1){
                return true;
            }else{
                return false;
            }
            
            break;
        }
        default:{
            return false;
            break;
        }
    }
};

//The reason hand is being passed instead of using `this.hand`
//is because we don't want to be poping cards off of the players hand
//so the hand being passed is a temp copy of their actual hand.
Player.prototype.evaluate_cards = function(hand){
    var suites = {'clubs': [], 'diamonds': [], 'hearts': [], 'spades': [], 'stars': []};
    var wilds = [];
    var buckets = {3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: []};
    var runs = [];
    var count = 1;
    var sets = [];

    hand.forEach(function(card){
        if(card.is_wild){
            wilds.push(card);
        }else{
            buckets[card.value].push(card);
        }
    });

    //deletes empty buckets
    for(var k in buckets){
        if(buckets.hasOwnProperty(k)){
            if(buckets[k].length == 0){
                delete buckets[k];
            }
        }
    }

    //pushes cards into suites
    for(var b in buckets){
        if(buckets.hasOwnProperty(b)){
            if(buckets[b].length > 1 ){
                buckets[b].forEach(function(card){
                    suites[card.suite].push(card);
                });
            }else{
                suites[buckets[b][0].suite].push(buckets[b][0]);
            }
        }
    }

    //deletes empty suites
    for(var s in suites){
        if(suites.hasOwnProperty(s)){
            if(suites[s].length == 0){
                delete suites[s];
            }
        }
    }

    //determins runs
    for(var s in suites ){
        if(suites.hasOwnProperty(s)){
            if(suites[s].length >= 2){
                for(var i = 0; i < suites[s].length; i++){
                    suites[s] = suites[s].sort(suites[s][i].value);
                }
                var range = suites[s][suites[s].length - 1].value - suites[s][0].value;
                if(range == suites[s].length - 1){
                    runs.push(suites[s]);
                }else if(range == 2){
                    runs.push(suites[s]);
                }
            }else{
                var low = suites[s][0].value;
                var range = suites[s][suites[s].length - 1].value - suites[s][0].value;
                for(var i = 1; i < range; i++){
                    if(suites[s][i].value == low + 1){
                        low = low + 1;
                        count++;
                    }else if(suites[s][i].value <= low + wilds.length){
                        var run = [];
                        if(low + wilds.length < suites[s].length){
                            if(count > 2 || wilds.length > 2){
                                run.push(suites.splice(0, low + wilds.length));
                            }
                        }else{
                            do{
                                low = low + wilds.length;
                                wilds.length--;
                            }while(low > suites[s].length);
                            if(count > 2 || 0 + low > 3){
                                run.push(suites[s].splice(0, low));
                            }
                        }
                        runs.push(run[0]); //splice returns an array
                    }
                }
            }
        }
    }

    for (var i in buckets) {
        if (buckets.hasOwnProperty(i)) {
            if (buckets[i].length == 2 && wilds.length > 0) {
                buckets[i].forEach(function(card){
                    sets.push(card);
                });
                sets.push(wilds.pop());
            } else if (buckets[i].length > 2) {
                buckets[i].forEach(function(card){
                    sets.push(card);
                });
            } else if(buckets[i].length == 1 && wilds.length >= 2){
                buckets[i].forEach(function(card){
                    sets.push(card);
                });
                for(var c = 0; c < 2; c++){
                    sets.push(wilds.pop());
                }
            }
        }
    }

    if(typeof runs[0] != 'undefined' && (runs[0].length == 2 && wilds.length > 0)){
        runs[0].push(wilds.pop());
    }
    var results = {
        r_sets: sets,
        r_runs: runs
    };
    return results;
};
