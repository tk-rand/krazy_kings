//helper functions

function id(ele_id){
   return document.getElementById(ele_id);
}

function cls(class_name){
    return document.getElementsByClassName(class_name);
}

function return_svg_cards_as_assets(){
    $.ajax({
        url: "/home/ryan/other_dev/5_crowns_phone_gap/assets/svg-cards.svg",
        type: "get",
        dataType: "text",
        success: function(svgText){
            var parser = new DOMParser();
            parser.async = false;

            var svgs = $(parser.parseFromString(svgText, 'text/xml').documentElement);

            return svgs;
        }
    });
}