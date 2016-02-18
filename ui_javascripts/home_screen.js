//initilize fastclick js
(function(){
    if('addEventListener' in document){
        document.addEventListener('DOMContentLoaded', function(){
            var attachFastClick = Origami.fastclick;
            attachFastClick(document.body);
        }, false);
    }
})();