<?php
//Deleting files
	function deleteFiles($backUrl, $waterUrl) {
	    if (file_exists($backUrl) && file_exists($waterUrl)) {
	    	unlink($backUrl);
	    	unlink($waterUrl);
		}
	}
?>