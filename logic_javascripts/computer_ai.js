

//computer ai class
function Computer(_game, round_constants){
    var _current_player = _game.players[_game.current_player];
    var wild_card_value = round_constants.round + 2; //add 2 cause round starts at one but card values start at 3
    var current_hand_points = 0;
    var temp_hand = {};
    var doubles = 80;
    var partial_runs = 80;
    
    _current_player.hand.forEach(function(card){
        temp_hand.push(card);
    });
    
    var card_values = {
        1: 100, //1 is the value assigned to Joker, which is always wild. 
        3: 75,
        4: 70,
        5: 65,
        6: 60, 
        7: 55,
        8: 50,
        9: 45,
        10: 40, 
        11: 35,
        12: 30,
        13: 25
    };
    
    //make whatever card that is wild this round worth 100
    card_values[wild_card_value] = 100;
    
    for(var c in temp_hand){
        if(temp_hand.hasOwnProperty(c)){
            current_hand_points += card_values[temp_hand[c].value];
        }
    }
    
    var sets_and_runs = _current_player.evaluate_hand(_current_player.hand);
    
}