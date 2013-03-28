
function navigation(partial_name){
    var partial = get_partial_file(partial_name);
    
    var content = id('main_content');
    content.innerHTML = partial;
}