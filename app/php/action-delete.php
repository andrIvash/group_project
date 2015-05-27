<?php
//Deleting files  Переписать функцию под массив аргументов
	function deleteFiles($backUrl, $waterUrl) {
	    if (file_exists($backUrl) && file_exists($waterUrl)) {
	    	unlink($backUrl);
	    	unlink($waterUrl);
		}
	}
?>