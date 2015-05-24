$(document).ready(function(){
	UplFileModul.init('bgInp', 'wtkInp', 'blBg', 'blWtk');
    WaterMarkDragAndDrop.Init();
    $( "#slider" ).slider({
               value: 100,
               animate:"slow",
               orientation: "horizontal"
            });
});

//buttton "like" and socials icons
$(document).ready(function(){  
        SocialsHide();
    });

    function SocialsActive(){
        $(".socials_list").show(500); 

        $(".socials_list").addClass('.socials_list-active');
    }
    function  SocialsHide(){
    	$(".socials_list").hide(500); 
        $(".socials_list").addClass('.socials_list-hide');
    }