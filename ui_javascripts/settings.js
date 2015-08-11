window.onload = function(){
    add_settings_listeners();
};


function add_settings_listeners(){
    var sort_toggle = id('sort_toggle');
    var sort_type = id('sort_type_toggle');
    var type_container = id('sort_type_toggle_container');
    var settings = {
        sort_cards: false,
        sort_type: 'suite'
    };
    sort_toggle.addEventListener('change', function(e){
        if(e.srcElement.checked){
            settings.sort_cards = true;
            type_container.style.display = 'block';
        }else{
            settings.sort_cards = false;
            type_container.style.display = 'none';    
        }
        window.localStorage.setItem('settings', JSON.stringify(settings));    
    });
    
    sort_type.addEventListener('change', function(e){
       if(e.srcElement.checked){
           settings.sort_type = 'value';
       } else{
           settings.sort_type = 'suite';
       }
       window.localStorage.setItem('settings', JSON.stringify(settings));
    });
}
