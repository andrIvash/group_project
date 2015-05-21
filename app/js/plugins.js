(function($){
   //Изменение прозрачности Watermark
	var setOpacity = (function(){

			// Подключаем прослушку событий
			function _setUpListners(){
				$('#slider').on('slidechange', _changeOpacity);

			}

			function _changeOpacity(e, ui) {

				var watermark = $('#blWtk');

                watermark.fadeTo( "fast", ui.value/100 );
                console.log("opacity changed to", ui.value);
	        }

			
		// Возвращаем в глобальную область видимости
			return {
				init: function () {
					_setUpListners();
				}
			}

	}());


    //Сохранение итогового изображения
    var saveResult = (function(){

            // Подключаем прослушку событий
            function _setUpListners(){
                $('.submit-btn').on('click', _saveResultImg);

            }

            function _saveResultImg(e) {
                e.preventDefault();
                console.log('click submit form')

                var url = 'php/action-save.php',
//-----------------------data = ,  !!cюда передать объект
                    defObject = _ajaxForm(data, url);                                 
                
                console.log(data);    
                    
                defObject.done(function(ans){
                    console.log('Изображение '+ans+' сохранено');
                })    

            }

            // Универсальная функция ajax
            function _ajaxForm(data, url){
 
                var defObj = $.ajax({
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

    }());





	$(document).ready(function(){

		setOpacity.init();
        saveResult.init();

	})

})(jQuery);


//Модуль загрузки изображений
var UplFileModul = (function($) {
    'use strict';
    var init = function(bgInp, wtkInp, blBg, blWtk){//инициализация плагина
        _c("Инициализировали модуль formValModul");

        var $_bgInp = $(bgInp),
            $_wtkInp = $(wtkInp),
            $_blBg = $(blBg),
            $_blWtk = $(blWtk);

        if($_bgInp.length === 0 || $_wtkInp.length === 0 || $_blBg.length === 0 || $_blWtk.length === 0){
            console.error('Ошибка инициализации плагина UplFileModul - переданные блоки не существуют!');
        }


        _addUplPlgn({
            'bg' : {
                'name': 'background',
                'inp' : $_bgInp,
                'blk' : $_blBg
            },
            'wtk' :{
                'name': 'watermark',
                'inp' : $_wtkInp,
                'blk' : $_blWtk
            }
        });
    },
    _c = function(mas){//console.log
        var flag = true;
        if (flag) {console.log(mas);};
    },
    _createObj = function(){
            this.name = '';
            this.url = '';
            this.deleteType = '';
            this.deleteUrl = '';
            this.size = '';
            this.thumbnailUrl = '';
            this.type = '';
            this.width = '';
            this.height = '';
            this.posX = '';
            this.posY = '';

    },
    _newImg = {//Объект с полной информациях о загруженных изображениях
        'background' : new _createObj(),
        'watermark' : new _createObj()
    },
    _addUplPlgn = function(obj){//инициализируем плагин  jQuery-File-Upload https://github.com/blueimp/jQuery-File-Upload

      for (var key in obj) {
          _c('//Устанавливаем file-upl на элементы объекта - '+key);

        (function(key){
            obj[key].inp.fileupload({
                dataType: 'json',
                done: function (e, data) {
                    $.each(data.result.files, function (index, file) {
                        obj[key].blk.html('<img src="../app/php/files/'+file.name+'" alt="" >');
                        _c(obj[key].name);
                        //----------------  добавление класов к картинкам
                        if(key == 'bg') {
                           $('#blBg img').addClass('img source__img');
                        }

                        if(key == 'wtk') {
                           $('#blWtk img').addClass('img watermark');
                        }

                        //--------------------
                        for (var prop in file) {
                            _newImg[obj[key].name][prop] = file[prop];
                        };
                        _c(_newImg);//отображаем данные загруженного изображения
                    });
                }
            });

        })(key)

      };

    };

    return {init : init};
})(jQuery);


//Модуль изменения положения watermark
var WaterMarkDragAndDrop = (function(){
    var watermark = $('#blWtk'),
        watermarkParent = watermark.parent(),
        wtmX = $('#wtmX'),
        wtmY = $('#wtmY'),
        _init = function(){
            _setUpListeners();
            _setDefault();
        },
        _setUpListeners = function(){
            _changePositionEventHandler();
            _dragEventHandler();
        },
        _setDefault = function(){
            wtmX.val(0);
            wtmY.val(0);

            _positioning('left', 'top', watermarkParent);
        },
        _dragEventHandler = function(){
                watermark.draggable({
                    containment:watermarkParent,
                    scroll: false,
                    drag: _positionChanged
                });
        },
        _changePositionEventHandler = function(){
            $('.nav-field')
                .find('.nav-item')
                .on('click', _changePosition);
        },
        _positionChanged = function() {
            var left = watermark.position().left,
                top = watermark.position().top;

            wtmX.val(left);
            wtmY.val(top);
        },
        _changePosition = function(e){
            var $this = $(this);
                positions = $this.data('target-position').split(',');

            $('.nav-item').each(function( index ) {
                $( this).removeClass('current');
            });

            $this.addClass('current');
            _positioning(positions[0], positions[1], watermarkParent);
            _positionChanged();
        },
        _positioning = function(horizontalAlign, verticalAlign, parent){
            var myHor = horizontalAlign,
                myVert = verticalAlign;

            watermark.position({
                collision: 'fit',
                of: parent,
                my: horizontalAlign + " " + verticalAlign,
                at: horizontalAlign + " " + verticalAlign
            });
        }
    return {
        Init: _init
    }
})();