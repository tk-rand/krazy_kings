//helper functions

function id(ele_id){
   return document.getElementById(ele_id);
}

function cls(class_name){
    return Array.prototype.slice.call(document.querySelectorAll(class_name));
}

function get_number_of_players_and_player_names(){
    var num_of_players = prompt("Enter number of players desired (up to 4).");
    var player_names = [];

    for(var i = 0; i < num_of_players; i++){
        var player_num = i +1;
        player_names[i] = prompt("Enter the name of player "+ player_num);
    }

    return player_names;
}

function get_number_of_bots_and_players_name(){
    var num_of_players = prompt("How many computers would you like to play with? (between 1 - 3).");
    var players_name = prompt("Enter your name.");
    var players_names = [];
    var total_players = parseInt(num_of_players, 10) + 1;
    
    players_names[0] = players_name;
    for(var i = 1; i < total_players; i++){
        players_names[i] = "Bot Man #" + i;
    }
    
    return players_names;
}

Array.prototype.remove_dupes = function(){
    if(this === void 0 || this === null){
        throw new TypeError();
    }
    
    var seen = {};
    var out = [];
    var arr = arguments[1];
    var len = arr.length;
    var j = 0;
    for(var i = 0; i < len; i++){
        var item = arr[i];
        if(seen[item] !== 1){
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
}
