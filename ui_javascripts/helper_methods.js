//helper functions

function id(ele_id){
   return document.getElementById(ele_id);
}

function cls(class_name){
    return document.getElementsByClassName(class_name);
}

function get_number_of_players_and_player_names(){
    var num_of_players =  prompt("Enter number of players desired (up to 4).");
    var name_of_players = [];

    for(var i = 1; i <= num_of_players; i++){
        name_of_players[i] = prompt("Enter the name of player "+ i);
    }

    return name_of_players;
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
