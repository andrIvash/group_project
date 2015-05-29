(function($){
    //Размножение Watermark
    var setTile = (function(){

            // Подключаем прослушку событий
            function _setUpListners(){
                $('.pos-trigger').on('click', _setTile);
                

            }

            function _setTile(e, ui) {

                var target = e.target,
                    trigger = $('.trigger-btn');
                   
                trigger.each(function( index ) {
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                    }
                }); 

                $(target).addClass('active');
                
            }

            
        // Возвращаем в глобальную область видимости
            return {
                init: function () {
                    _setUpListners();
                }
            }

    }());






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
                var tileOn = $('#tileon'),
                    single = $('#single');
                
                console.log('click submit form')
                
                  
                    //Записываем в основной объект инфрмацию о размерах изображений (в px)
                    UplFileModul.getImgSize();

                    //перехватываем событие размножения ватермарки
                    if ($(tileOn).hasClass('active')) {
                        UplFileModul.newImg.tile = 'on';
                    }

                    if ($(single).hasClass('active')) {
                        UplFileModul.newImg.tile = 'off';
                    }

                    UplFileModul.newImg.event = 'save';//Записываем информацию о кнопке вызвавшей событие 

                    var url = 'php/action-save.php',
                        data = UplFileModul.newImg;

                    if ( data['background']['height'] !== undefined && data['watermark']['height'] !== undefined) {    
                        
                        var defObject = ajaxForm(data, url);                                 
                        
                        console.log(data);    
                            
                        defObject.done(function(ans){

                            console.log(ans);
                            window.location.href='php/download.php?url='+ans;
                            
                            clearForm.clear();
                            $('#options').trigger( 'reset' );
                        })
                                                    
                            
                        

                    } 

                

            }

           

            // Универсальная функция ajax
            function ajaxForm(data, url){
 
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
                },
                ajaxForm :  ajaxForm
            }

    }());

    
    //Очистка данных
    var clearForm = (function(){
            function _binds(){
                $('#options').on('reset', _clearOllData);
            }

            function _clearOllData(){
                UplFileModul.newImg.event = 'reset';//Записываем информацию о кнопке вызвавшей событие 
                saveResult.ajaxForm(UplFileModul.newImg, 'php/action-delete.php');
               
                $('#blBg').html('');
                $('#blWtk').html('');
                UplFileModul.clearNewImg();
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
        setTile.init();
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
        },
        _setDefaults = function(){
            var image = main.find('.source__img'),
                wtm = watermark.find('.img');

            wtmX.val(0);
            wtmY.val(0);

            image.load(_onImageLoad);
            wtm.load(_onImageLoad);

            watermark.css({'left':0, 'top':0});

            _syncObjectOnPositionChange(0, 0);
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
            _dragEventHandler();

            $('.nav-field')
                .find('.nav-item')
                .unbind()
                .on('click', _changePosition);

            $('.arrows-wrap div').unbind().on('click', _onArrowClick);
            $('#wtmX').unbind().on('change', _onInputValuePositionChanged);
            $('#wtmY').unbind().on('change', _onInputValuePositionChanged);
        },
        _positionChanged = function() {
            var left = parseInt(watermark.position().left),
                top = parseInt(watermark.position().top);

            wtmX.val(parseInt(left / rate));
            wtmY.val(parseInt(top / rate));

            _syncObjectOnPositionChange(left, top);
        },
        _onInputValuePositionChanged = function(){
            var left = wtmX.val(),
                top = wtmY.val()
            _setPositionCoords(left, top);
            _syncObjectOnPositionChange(left, top);
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
        },
        _onArrowClick = function(e){
            var arrow = $(e.target),
                isLeftAlign = arrow.parent().hasClass('position-left'),
                left = wtmX.val(),
                top = wtmY.val(),
                leftRelative = parseInt(left * rate),
                topRelative = parseInt(top * rate);

            if(isLeftAlign === true){
                _changePositionInputValue(wtmX, arrow);
            }else{
                _changePositionInputValue(wtmY, arrow);
            }

            _setPositionCoords(leftRelative, topRelative);
            _syncObjectOnPositionChange(leftRelative, topRelative);
        },
        _setPositionCoords = function(left, top){
            watermark.css({'left':left+'px' , 'top':top+'px'});
        },
        _changePositionInputValue = function(inputElement, arrow){
            if(arrow.hasClass('position-dec')){
                inputElement.val(parseInt(inputElement.val()) - 1);
            }else{
                inputElement.val(parseInt(inputElement.val()) + 1);
            }
        },
        //Записываем информацию о положении watermark в основной объект с данными (в px)
        _syncObjectOnPositionChange = function(left, top){
            UplFileModul.newImg.watermark.posX = left*rate;
            UplFileModul.newImg.watermark.posY = top*rate;
        }
    return {
        Init: _init 
    }
})();