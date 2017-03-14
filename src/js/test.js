/**
 * Created by LIN on 2016/2/18.
 */
$(function(){
	/**************************************************************/
	//登录框
	/**************************************************************/
	var logB=$('#logBox');
	logB.dialog({
		minWidth :350,
		minHeight:300,
		title    :'用户登录',
		buttons  :{
			'登录':function(){
				$(this).submit();
			},
			'返回':function(){
				$(this).dialog('close');
			}
		},
		show     :'puff',
		hide     :'scale',
		autoOpen :true,
		resizable:false,
		modal    :true,
		closeText:'关闭'
	});
});
