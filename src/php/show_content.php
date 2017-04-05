<?php
	require 'config.php';
	//$query = mysql_query("SELECT title,content,user,date FROM question ORDER BY date DESC LIMIT 0,10") or die('SQL 错误！');
	$query = mysql_query("SELECT (SELECT COUNT(*) FROM comment WHERE titleid=a.id) AS count,a.id,a.title,a.content,a.user,a.date FROM question a ORDER BY a.date ASC LIMIT 0,10")
	or die('SQL 错误！');
	$json = '';
	while(!!$row = mysql_fetch_array($query,MYSQL_ASSOC)){
		foreach($row as $key => $value){
			$row[ $key ] = urlencode(str_replace("\n","",$value));
		}
		//urlencode()函数原理就是首先把中文字符转换为十六进制，然后在每个字符前面加一个标识符%。
		//urldecode()函数与urlencode()函数原理相反，用于解码已编码的 URL 字符串，其原理就是把十六进制字符串转换为中文字符
		//json_encode — 对变量进行 JSON 编码
		$json .= urldecode(json_encode($row)) . ',';
	}
	//print_r($json);
	echo '[' . substr($json,0,strlen($json) - 1) . ']';
	mysql_close();
?>