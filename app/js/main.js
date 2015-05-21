$(document).ready(function(){
	UplFileModul.init('#bgInp', '#wtkInp', '#blBg', '#blWtk');
    WaterMarkDragAndDrop.Init();
    $( "#slider" ).slider({
               value: 60,
               animate:"slow",
               orientation: "horizontal"
            });
});