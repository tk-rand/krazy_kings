//helper functions
/* global game_mode */
/* global game_started */

function id(ele_id){
   return document.getElementById(ele_id);
}

function cls(class_name){
    return Array.prototype.slice.call(document.querySelectorAll(class_name));
}

function get_number_of_players_and_names(callback){    
    var input_popup = id('input_popup');
    
    dialog_confirm('number', game_mode, function(value){
        var player_names = [];
        
        if(game_mode){
            dialog_confirm('text', game_mode, function(name){
                var n = sanatize(name)
                player_names[0] = n;
                
                for(var i = 1; i <= value; i++){
                    player_names[i] = "Bot Man" + i; 
                }
                input_popup.style.display = 'none';
                callback(player_names);
            });
        }else{
            var i = 0;
            dialog_confirm('text', game_mode, function(name){
                player_names[i] = sanatize(name);
                i++;
                dialog_confirm('text', game_mode, function(name2){
                    player_names[i] = sanatize(name2);
                    i++;
                    if(i < value){
                        dialog_confirm('text', game_mode, function(name3){
                            player_names[i] = sanatize(name3);
                            i++;
                            if(i < value){
                                dialog_confirm('text', game_mode, function(name4){
                                    player_names[i] = sanatize(name4);
                                    input_popup.style.display = 'none';
                                    callback(player_names);
                                });
                            }else{
                                input_popup.style.display = 'none';
                                callback(player_names);
                            }
                        });
                    }else{
                        input_popup.style.display = 'none';
                        callback(player_names); 
                    }    
                });
            });
        }
    });
}

//@type = string, value = text or number
//@computer, bool, true = playing against bots, false = hotseat
function dialog_confirm(type, computer, callback){
    var input_popup = id('input_popup');
    var title = id('input_title');
    var input = id('player_input');
    var ok_button = id('dialog_ok_button');
    var error = id('input_error');
    this.new_callback = callback; //avoids the closure callback hell

    input.value = '';
    input_popup.style.display = 'block';
    input.focus();
    
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
            title.innerText = "Number of Computers? \n (between 1 - 3)";
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
    
    //since this function is called multiple times don't want duplicate events added.
    input.removeEventListener('keyup', handle_input_button, false);
    ok_button.removeEventListener('click', handle_input_button, false);
    
    ok_button.addEventListener('click', handle_input_button, false);
    input.addEventListener('keyup', handle_input_button, false);
    
    var self = this;
    
    function handle_input_button(event){
        if(event.keyCode === 13 || event.type === 'click'){
            if(game_started){
                return;
            }
            if(input.value === ''){
                error.setAttribute('display', 'inline-block');
            }else{
                self.new_callback(input.value);
            }  
        } 
    }
}

function sanatize(str){
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
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