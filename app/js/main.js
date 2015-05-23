$(document).ready(function(){
	UplFileModul.init('bgInp', 'wtkInp', 'blBg', 'blWtk');
    WaterMarkDragAndDrop.Init();
    $( "#slider" ).slider({
               value: 100,
               animate:"slow",
               orientation: "horizontal"
            });
});