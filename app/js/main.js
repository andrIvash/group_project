var likeBtn = $('.like-btn'),
    socialsList = $(".socials_list");


var showHide = function(blk, margin){
    if (blk.hasClass('active')) {
        blk.animate({
            'marginLeft': margin},
            250, function() {
            blk.removeClass('active');
        });
   }else{
        blk.animate({
            'marginLeft': '0px'},
            250, function() {
            blk.addClass('active');
        });
   };
}



$(document).ready(function(){
	UplFileModul.init('bgInp', 'wtkInp', 'blBg', 'blWtk');
    WaterMarkDragAndDrop.Init();
    $( "#slider" ).slider({
        value: 100,
        animate:"slow",
        orientation: "horizontal"
    });

    likeBtn.on('click', function(event) {
        event.preventDefault();
        showHide(socialsList, '-43px');
    });
});
