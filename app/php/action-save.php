<?php
	use PHPImageWorkshop\ImageWorkshop; // Use the namespace of ImageWorkshop
	require_once('PHPImageWorkshop/ImageWorkshop.php'); // Be sure of the path to the class

	$data = json_decode($_POST['data']);
 
	$backgroundLayer = ImageWorkshop::initFromPath('files/'.data['background']['url']);
 	$watermarkLayer = ImageWorkshop::initFromPath('files/'.data['watermark']['url']);
 	$watermarkLayer->opacity(40);
 	$backgroundLayer->addLayer(1, $watermarkLayer, 12, 12, "LB");
 	$image = $backgroundLayer->getResult();



 	//создаем имя: 
   $name = time().'.png';
   //записываем, перекодируя в base64
   file_put_contents($name, $image);
   //возвращаем имя созданного файла 
   echo( $name );
?>