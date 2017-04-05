<?php
	//sleep(3);
	require 'config.php';
	$_pass = sha1($_POST['logPassword']);

	$query = mysql_query("SELECT userN,pass FROM `user` WHERE userN='{$_POST['logAccount']}' AND pass='{$_pass}'")
	or die('SQL 错误！');
	if(mysql_fetch_array($query,MYSQL_ASSOC)){
		echo 'true';
	}else{
		echo 'false';
	}
	mysql_close();
?>