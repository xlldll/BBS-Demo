<?php
	require 'config.php';
	$user=$_POST['userN'];
	$pw=sha1($_POST['pw']);
	$email=$_POST['email'];
	$sex=$_POST['sex'];
	$birthday=$_POST['birthday'];
	//持久类的映射文件中的字段顺序必须和数据库中标的字段顺序一致
	//$query = "INSERT INTO `user` (userN, pass, email, sex, birthday, date) VALUES ('".$user."', '".$pw."', '".$email."', '".$sex."', '".$birthday."', NOW())";
	$query = "INSERT INTO `user` (userN, pass, email, sex, birthday, date) VALUES ('".$user."', '".$pw."', '".$email."', '".$sex."', '".$birthday."', NOW())";
	mysql_query($query) or die('新增失败！' . mysql_error());
	echo mysql_affected_rows();
	mysql_close();
?>