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
                UplFileModul.newImg.watermark.opacity = ui.value;
	        }

			
		// Возвращаем в глобальную область видимости
			return {
				init: function () {
					_setUpListners();
				}
			}

	}());


    //Сохранение итогового изображения и удаление исходный изображений
    var saveResult = (function(){

            // Подключаем прослушку событий
            function _setUpListners(){
                $('.submit-btn').on('click', _saveResultImg);
               

            }

            function _saveResultImg(e) {
                e.preventDefault();
                
                console.log('click submit form')
                
                  
                    //Записываем в основной объект инфрмацию о размерах изображений (в px)
                    UplFileModul.getImgSize();

                    var url = 'php/action-save.php',
                        data = UplFileModul.newImg;

                    if ( data['background']['height'] !== undefined && data['watermark']['height'] !== undefined) {    
                        
                        var    defObject = _ajaxForm(data, url);                                 
                        
                        console.log(data);    
                            
                        defObject.done(function(ans){

                            console.log(ans);
                            window.location.href='php/download.php?url='+ans;
                            //дописать запрос про удаление файлов
                            

                            
                            
                            
                            clearForm.clear();
                            $('#options').trigger( 'reset' );

                        })
                    } 

                

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

    
    //Очистка данных
    var clearForm = (function(){
            function _binds(){
                $('#options').on('reset', _clearOllData);
            }

            function _clearOllData(){
                $('#blBg').html('');
                $('#blWtk').html('');
                UplFileModul.clearNewImg();
                var    defObject = _ajaxForm(data, url);
            }

            // Возвращаем в глобальную область видимости
            return {
                init: function () {
                    _binds();
                },
                clear: function () {
                    _clearOllData();
                }
            }
    })();





	$(document).ready(function(){

		setOpacity.init();
        saveResult.init();
        clearForm.init();

	})

})(jQuery);


//Модуль загрузки изображений
var UplFileModul = (function($) {
    'use strict';
    var init = function(bgInp, wtkInp, blBg, blWtk){//инициализация плагина
        _c("Инициализировали модуль UplFileModul");

        var $_bgInp = $('#'+bgInp),
            $_wtkInp = $('#'+wtkInp),
            $_cls_bgInp = $('.'+bgInp),
            $_cls_wtkInp = $('.'+wtkInp),
            $_blBg = $('#'+blBg),
            $_blWtk = $('#'+blWtk);

        if($_bgInp.length === 0 || $_wtkInp.length === 0 || $_blBg.length === 0 || $_blWtk.length === 0){
            console.error('Ошибка инициализации плагина UplFileModul - переданные блоки не существуют!');
            return false;
        }


        _addUplPlgn({
            'bg' : {
                'name': 'background',
                'inp' : $_bgInp,
                'blk' : $_blBg,
                'view': $_cls_bgInp
            },
            'wtk' :{
                'name': 'watermark',
                'inp' : $_wtkInp,
                'blk' : $_blWtk,
                'view': $_cls_wtkInp
            }
        });
    },
    _c = function(mas){//console.log
        var flag = false;
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
            this.posX = 0;
            this.posY = 0;
            this.opacity = 100;

    },
    newImg = {//Объект с полной информациях о загруженных изображениях
        'background' : new _createObj(),
        'watermark' : new _createObj()
    },
    getImgSize = function(){//получаем размеры загруженных изображений

        var bg = $(blBg).children('img')[0]

        if(bg) {
            var bgH = bg.naturalHeight,
                bgW = bg.naturalWidth;
        }
        
        var     wtr = $(blWtk).children('img')[0];
        
        if(wtr) {
            var wtrH = wtr.naturalHeight,
                wtrW = wtr.naturalWidth;
        }

        newImg.background.height = bgH;
        newImg.background.width = bgW;
        newImg.watermark.height = wtrH;
        newImg.watermark.width = wtrW;
        
    },
    clearNewImg = function(){
        newImg.background = new _createObj();
        newImg.watermark = new _createObj();
    },
    _addUplPlgn = function(obj){//инициализируем плагин  jQuery-File-Upload https://github.com/blueimp/jQuery-File-Upload

      for (var key in obj) {
          _c('//Устанавливаем file-upl на элементы объекта - '+key);

        (function(key){
            obj[key].inp.fileupload({
                dataType: 'json',
                done: function (e, data) {
                    $.each(data.result.files, function (index, file) {
                        var classImg = key === 'bg' ? 'img source__img' : 'img watermark';
                        obj[key].blk.html('<img src="php/files/'+file.name+'" alt="" class="'+classImg+'" >');

                        for (var prop in file) {
                            newImg[obj[key].name][prop] = file[prop];
                        };

                        obj[key].view.val(newImg[obj[key].name].name);

                        _c(file);//отображаем данные загруженного изображения
                    });
                    WaterMarkDragAndDrop.Init();
                }
            });

        })(key)

      };

    };

    return {
        init : init, 
        newImg : newImg, 
        getImgSize : getImgSize, 
        clearNewImg : clearNewImg
    };

})(jQuery);


//Модуль изменения положения watermark
var WaterMarkDragAndDrop = (function(){
    var main = $('#blBg'),
        watermark = $('#blWtk'),
        watermarkParent = watermark.parent(),
        watermarkOriginWidth = 'null',
        wtmX = $('#wtmX'),
        wtmY = $('#wtmY'),
        rate = 0,
        _init = function(){
            _setUpListeners();
            _setDefaults();
        },
        _setUpListeners = function(){
            _changePositionEventHandler();
            _dragEventHandler();
        },
        _setDefaults = function(){
            var image = main.find('.source__img'),
                wtm = watermark.find('.img');

            wtmX.val(0);
            wtmY.val(0);

            image.load(_onImageLoad);
            wtm.load(_onImageLoad);

            watermark.css({'left':0, 'top':0});
        },
        _onImageLoad = function(){
            var image = main.find('.source__img'),
                wtm = watermark.find('.img'),
                wtmWidth = typeof wtm[0] === 'undefined' ? 0 : wtm[0].naturalWidth,
                wtmHeight = typeof wtm[0] === 'undefined' ? 1 : wtm[0].naturalHeight,
                naturalWidth = typeof image[0] === 'undefined' ? 0 : image[0].naturalWidth,
                naturalHeight = typeof image[0] === 'undefined' ? 0 : image[0].naturalHeight,
                currentWidth = typeof image[0] === 'undefined' ? 1 : image[0].clientWidth,
                currentHeight = typeof image[0] === 'undefined' ? 1 : image[0].clientHeight,
                ratio = naturalWidth / currentWidth,
                relWidth = wtmWidth / ratio;

            rate = ratio;

            if(wtmWidth >= wtmHeight){
                if(naturalWidth <= wtmWidth){
                    relWidth = currentWidth;
                }else if(naturalHeight <= wtmHeight){
                    relWidth = wtmWidth / (naturalHeight / wtmHeight);
                    console.log('height ' + relWidth);
                }
            }else{

                if(naturalWidth <= wtmWidth){
                    relWidth = currentWidth;
                    if(naturalHeight <= wtmHeight){
                        relWidth = (wtmWidth ) / (wtmHeight / currentHeight);
                    }
                }else if(naturalHeight <= wtmHeight){
                    relWidth = wtmWidth / (naturalHeight / wtmHeight);
                    console.log('height ' + relWidth);
                }
            }

            if(relWidth !== 0){
                wtm.css({"width": relWidth + "px"});
            }
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

            wtmX.val(left / rate);
            wtmY.val(top / rate);

            //Записываем информацию о положении watermark в основной объект с данными (в px)
            UplFileModul.newImg.watermark.posX = left*rate;
            UplFileModul.newImg.watermark.posY = top*rate;
        },
        _changePosition = function(e){
            var $this = $(this),
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