<?php
	require_once('action-delete.php');
	//сохранение итогового файла на диск пользователю
	 $url = $_GET['url'];
	
	header('Content-Type: '.$ctype.'; charset=utf-8');
  	header("Content-Disposition: attachment; filename=".$url);
  	ob_clean();
  	readfile($url);
  	
  	if (isset($url)) {
		deleteFiles($url);
		
	}
  	exit();
	


?>