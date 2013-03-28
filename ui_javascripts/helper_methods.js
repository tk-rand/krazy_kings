//helper function
function get_partial_file(partial_name){
    var file = get_partial_file_path(partial_name);
    var reader = new FileReader();
    var partial = reader.readAsText(file);
    if (reader.readyState == 'DONE'){
        return partial.result;	
    }

}

function get_partial_file_path(partial_name){
    return File("/html/"+partial_name);
}

function id(ele_id){
	console.log(document.getElementById(ele_id))
   return document.getElementById(ele_id);
}

function cls(class_name){
    return document.getElementsByClassName(class_name);
}