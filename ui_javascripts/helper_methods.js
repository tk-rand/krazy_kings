//helper function
function get_partial_file(partial_name){
    var file = get_partial_file_path(partial_name);
    var reader = new FileReader();
    var partial = reader.readAsText(file);
    return partial;
}

function get_partial_file_path(partial_name){
    return File("/html/"+partial_name);
}

function id(id){
   return document.getElementById(id);
}

function cls(class_name){
    return document.getElementsByClassName(class_name);
}