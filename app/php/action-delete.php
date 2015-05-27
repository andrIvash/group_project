<?php
//Deleting files


	function deleteFiles() {

		$args = func_get_args();

		foreach ($args as $k => $v) {
			if (file_exists($v)) {
		    	unlink($v);
		    	
			}
		}
	}

	if (isset($_POST['url'])) {
		deleteFiles($_POST['url']);
		echo $_POST['url'];
	}

?>