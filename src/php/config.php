<?php
    // 指定允许其他域名访问
    header('Access-Control-Allow-Origin:*');
    // 响应类型
    header('Access-Control-Allow-Methods:POST');
    // 响应头设置
    header('Access-Control-Allow-Headers:x-requested-with,content-type');
    header('Content-Type:text/html; charset=utf-8;');
	define('DB_HOST','localhost');
	define('DB_USER','root');
	define('DB_PWD','136626');
	define('DB_NAME',"bbsdemo");
	$conn = @mysql_connect(DB_HOST,DB_USER,DB_PWD) or die('数据库链接失败：' . mysql_error());
	@mysql_select_db(DB_NAME) or die('数据库错误：' . mysql_error());
	@mysql_query('SET NAMES UTF8') or die('字符集错误：' . mysql_error());
?>