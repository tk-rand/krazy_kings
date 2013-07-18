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

    for(var i = 0; i < num_of_players; i++){
        name_of_players[i] = prompt("Enter the name of player"+ i+1);
    }

    return name_of_players;
}


//function drag_card_handler(e){
//    console.log('hello');
//    this.style.opacity = '0.5';
//
//}
//
//function card_drop_handler(event){
//    if(event.stopPropagation){
//        event.stopPropagation();
//    }
//}
//
//function handleDragOver(e){
//    if(e.preventDefault){
//        e.preventDefault();
//    }
//
//    e.dataTransfer.dropEffect = 'move';
//    return false;
//}
//function handleDragEnter(e){
//    e.target.classList.add('over');
//}
//function handleDragLeave(e){
//    e.target.classList.remove('over');
//}
//
//function initialize_event_listeners(){
//
//    var cards = id('card_1');
//    cards.addEventListener('dragstart', drag_card_handler, false);
//    cards.addEventListener('dragenter', handleDragEnter, false);
//    cards.addEventListener('dragover', handleDragOver, false);
//    cards.addEventListener('dragleave', handleDragLeave, false);
//
//}initialize_event_listeners();


