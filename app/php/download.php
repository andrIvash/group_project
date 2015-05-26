<?php
	
	//сохранение итогового файла на диск пользователю
	 $url = $_GET['url'];
	 $file = $url;
	header('Content-Type: '.$ctype.'; charset=utf-8');
  	header("Content-Disposition: attachment; filename=".$file);
  	ob_clean();
  	readfile($file);
  	exit();
 //  	
 //  	


?>