<?php
	use PHPImageWorkshop\ImageWorkshop; // Use the namespace of ImageWorkshop
	require_once('PHPImageWorkshop/ImageWorkshop.php'); // Be sure of the path to the class
	require_once('action-delete.php');
	//$backUrl = $_POST['background']['url'];
 	//$waterUrl = $_POST['watermark']['url'];
 	//
 	ini_set("memory_limit", "2048M");
 	$backUrl = '../php/files/' . $_POST['background']['name'];
 	$waterUrl = '../php/files/' . $_POST['watermark']['name'];
 	$waterOpacity = $_POST['watermark']['opacity'];
 	$waterPositionX = $_POST['watermark']['posX'];
 	$waterPositionY = $_POST['watermark']['posY'];

	$backgroundLayer = ImageWorkshop::initFromPath($backUrl);
 	$watermarkLayer = ImageWorkshop::initFromPath($waterUrl);
 	$watermarkLayer->opacity($waterOpacity);

 	if ($_POST['tile'] == 'off') {
 		$backgroundLayer->addLayer(1, $watermarkLayer, $waterPositionX, $waterPositionY, "LT");
 	}
 	
 	if ($_POST['tile'] == 'on') {


		$watermarkWidth = $watermarkLayer->getWidth();
		$watermarkHeight = $watermarkLayer->getHeight();
		$backgroundWidth = $backgroundLayer->getWidth();
		$backgroundHeight = $backgroundLayer->getHeight();

		$xCoord = 0;
		$yCoord = 0;
		$bottomInt = $_POST['bInt'];
		$leftInt = $_POST['lInt'];
		
		while ($xCoord < $backgroundWidth && $yCoord < $backgroundHeight){

			$backgroundLayer->addLayerOnTop($watermarkLayer, $xCoord, $yCoord, 'LT');
			$xCoord += $watermarkWidth + $leftInt;
			if ($xCoord >= $backgroundWidth){
				$xCoord = 0;
				$yCoord += $watermarkHeight + $bottomInt;
			}
		}
 	}

 	






 	// Saving the result
	$dirPath = "../uploads/2015/";
	
	$filename = time().'.png';
	$createFolders = true;
	$imageQuality = 95; // useless for GIF, usefull for PNG and JPEG (0 to 100%)
  
	$backgroundLayer->save($dirPath, $filename, $createFolders, $imageQuality);
    
    echo $fname = $dirPath. $filename;
	
   
    deleteFiles($backUrl, $waterUrl);

    
    

  
?>