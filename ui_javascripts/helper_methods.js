//helper functions

function id(ele_id){
   return document.getElementById(ele_id);
}

function cls(class_name){
    return Array.prototype.slice.call(document.querySelectorAll(class_name));
}



function get_number_of_players_and_player_names(){
    var num_of_players =  prompt("Enter number of players desired (up to 4).");
    var name_of_players = [];

    for(var i = 0; i < num_of_players; i++){
        name_of_players[i] = prompt("Enter the name of player "+ i);
    }

    return name_of_players;
}


