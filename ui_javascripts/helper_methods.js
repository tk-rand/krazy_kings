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
    dialog_confirm('number', true, function(value){

    });
    
    

}

function another_handler(value){
        var number_of_bots = value;
        var players_names = [];
        var players_name = '';
        
        console.log(number_of_bots);
    
        var total_players = parseInt(number_of_bots, 10) + 1;
    
        players_names[0] = players_name;
        for(var i = 1; i < total_players; i++){
            players_names[i] = "Bot Man #" + i;
        }
    
        return players_names;
}

//@type string, text or number
//@computer, bool, true = playing against bots, false = hotseat
function dialog_confirm(type, computer, callback){
    var input_popup = id('input_popup');
    var title = id('input_title');
    var input = id('player_input');
    var ok_button = id('dialog_ok_button');
    var error = id('input_error');

    input.value = '';
    input_popup.style.display = 'block';
    
    if(type === 'text'){
        input.setAttribute('placeholder', "Name:");
        input.setAttribute('type', 'text');
        if(computer){
            title.innerText = "Please Enter Your Name:";
        }else{
            title.innerText = "Enter Players Name:";
        }
    }else{
        input.setAttribute('type', 'number');
        if(computer){
            title.innerText = "Number of Computers? (between 1 - 3)";
            input.value = 1;
            input.setAttribute('min', '1');
            input.setAttribute('max', '3');
        }else{
            title.innerText = "Number of Players? (up to 4)";
            input.value = 2;
            input.setAttribute('min', '2');
            input.setAttribute('max', '4');
        }
    }
    
    ok_button.removeEventListener('click', handle_input_button, false);
    ok_button.addEventListener('click', handle_input_button, false);
    
    function handle_input_button(event){
        if(input.value === ''){
            error.setAttribute('display', 'inline-block');
        }else{
            callback(input.value);
        }  
    } 
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
