//initilize fastclick js
(function(){
    if('addEventListener' in document){
        document.addEventListener('DOMContentLoaded', function(){
            var attachFastClick = Origami.fastclick;
            attachFastClick(document.body);
            window.addEventListener('beforeunload', handle_game_pause, false);
        }, false);
    }
})();

function handle_game_pause(event){
    var confirm_message = "\o/";
    
    var game_state = JSON.parse(window.localStorage.getItem('game_state')) || {};
    
    game_state = JSON.stringify(_game);
    window.localStorage.setItem('game_state', game_state);
    
    event.preventDefault();
    return confirm_message;
}