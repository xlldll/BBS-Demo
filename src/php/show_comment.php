<?php
	require 'config.php';
	$_sql = mysql_query("SELECT COUNT(*) AS count FROM comment WHERE titleid='{$_POST['titleid']}'") or die('$_sql 错误！');
	$_result = mysql_fetch_array($_sql,MYSQL_ASSOC);
	//每页两条
	$_pagesize = 2;
	//总页码数
	$_count = ceil($_result['count'] / $_pagesize);
	$_page  = 1;
	if(!isset($_POST['page'])){
		$_page = 1;
	}else{
		$_page = $_POST['page'];
		if($_page > $_count){
			$_page = $_count;
		}
	}
	//$_page：2 $_limit：2
	//$_page：3 $_limit：4
	//$_page：4 $_limit：6
	//$_page：5 $_limit：8
	$_limit = ($_page - 1) * $_pagesize;
	$query = mysql_query("SELECT ({$_count}) AS count,titleid,comment,user,date FROM comment WHERE titleid='{$_POST['titleid']}' ORDER BY date ASC LIMIT {$_limit},{$_pagesize}") or die('$query 错误！');
	$json = '';
	while(!!$row = mysql_fetch_array($query,MYSQL_ASSOC)){
		foreach($row as $key => $value){
			$row[ $key ] = urlencode(str_replace("\n","",$value));
		}
		$json .= urldecode(json_encode($row)) . ',';
	}
	echo '[' . substr($json,0,strlen($json) - 1) . ']';
	mysql_close();
?>