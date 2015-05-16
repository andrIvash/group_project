
(function($){

	var saveScreen = (function(){

			// Подключаем прослушку событий
			function _setUpListners(){
				$('.save-button').on('click', _saveData)
				
			}

			function _saveData(e) {
				e.preventDefault();

				//инициализация плагина
				$('.save-img').html2canvas();

				var	url = 'php/action-save.php',
				    canvas = $('canvas')[0],
	                data = canvas.toDataURL('image/png').replace(/data:image\/png;base64,/, ''),
	                defObject = _ajaxForm(data, url);

	            
	            $('canvas').remove();

	            defObject.done(function(ans){
	               	console.log('Изображение '+ans+' сохранено');
	            })
	                    
			// Универсальная функция ajax
			function _ajaxForm(data, url){

				var data = form.serialize(),

					defObj = $.ajax({
						type : "POST",
						url : url,
						data: data
					}).fail(function(){
						console.log('Проблемы на стороне сервера');
					})

				return defObj;
			}
		
		// Возвращаем в глобальную область видимости
			return {
				init: function () {
					_setUpListners();
				}
			}


 $(document).ready(function() {

	//saveScreen.init();



 })



                   

})(jQuery);
            