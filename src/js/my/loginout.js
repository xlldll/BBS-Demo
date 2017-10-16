/**
 * Created by LinChuQiang.
 */
$( function() {
	/***************************全局模块*****************************/
	
	//后台服务器url地址
	var url='bbs-github:80';
	
	//注册表单的生日日期选择器
	$('.form_date').datetimepicker({
		language      :'zh-CN',
		weekStart     :1,
		todayBtn      :1,
		autoclose     :1,
		todayHighlight:1,
		startView     :2,
		minView       :2,
		forceParse    :0
	});
	//表单输入的提示框
	$('[data-toggle="tooltip"]').tooltip({
		placement:'top'
	});
	
	/****************************注册登录模块***********************/
	
	//如果cookie:user存在，则显示用户和退出；否则，显示登录和注册
	if($.cookie('user')){
		$('#member, #logout').show();
		$('#reg, #log').hide();
		$('#member').html($.cookie('user'));
	}else{
		$('#member, #logout').hide();
		$('#reg, #log').show();
	}
	//点击注册按钮时，弹出注册框，重置注册内容
	$('#reg').click(function(){
		$('#regBox').modal({
			show    :true,
			keyboard:true
		});
		$('#regForm').resetForm();
	});
	//点击登录按钮时，弹出登录框，重置登录内容
	$('#log').click(function(){
		$('#logBox').modal({
			show    :true,
			keyboard:true
		});
		$('#logForm').resetForm();
	});
	//点击退出按钮时，清除user的cookie，跳转到主页
	$('#logout').click(function(){
		$.removeCookie('user');
		window.location.href=window.location.href;
		//window.location.href="../";
	});
	
	//点击登录表单返回按钮时，清除验证class类，隐藏警告框
	$('#returnLog').click(function(){
		$(this).parents('.modal-footer').prev('.modal-body').find('input').removeClass('invalid valid');
		$('#logWarn').children().css('display','none');
	});
	//点击注册表单返回按钮时，同上
	$('#returnReg').click(function(){
		$(this).parents('.modal-footer').prev('.modal-body').find('input').removeClass('invalid valid');
		$('#regWarn').children().css('display','none');
	});
	//注册表单验证
	$('#regForm').validate({
		rules              :{
			userN:{
				required :true,
				minlength:6,
				remote   :{
					url :'http://'+url+'/src/php/is_user.php',
					type:'POST'
				}
			},
			pw   :{
				required :true,
				minlength:6
			},
			email:{
				required:true,
				email   :true
			}
		},
		messages           :{
			userN:{
				required :'帐号不得为空！',
				minlength:jQuery.format('帐号不得小于{0}位！'),
				remote   :'帐号被占用！'
			},
			pw   :{
				required :'密码不得为空！',
				minlength:jQuery.format('密码不得小于{0}位！')
			},
			email:{
				required :'邮箱不得为空！',
				minlength:'请输入正确的邮箱地址！'
			}
		},
		errorLabelContainer:'#regWarn',
		wrapper            :'span',
		submitHandler      :function(form){
			$(form).ajaxSubmit({
				url         :'http://'+url+'/src/php/add.php',
				type        :'POST',
				beforeSubmit:function(formData,jqForm,options){
					$('#regDiv').popover({
						html     :true,
						content  :'正在为您注册&nbsp;<img src="img/loading.gif"/>',
						placement:'top',
						delay    :{"show":50,"hide":50},
						trigger  :'manual'
					});
					$('#regDiv').popover('show');
					$('#regBtn').attr("disabled","");
				},
				success     :function(responseText,statusText){
					if(responseText){
						$('#regDiv').popover({
							html     :true,
							content  :'已经注册成功&nbsp;<img src="img/success.gif"/>',
							placement:'top',
							delay    :{"show":50,"hide":50},
							trigger  :'manual'
						});
						$.cookie('user',$('#account').val());
						setTimeout(function(){
							$('#regBox').modal('hide');
							$('#regForm').resetForm();
							$('#regBtn').removeAttr("disabled","");
							$('#regDiv').popover('hide');
							$('#member, #logout').show();
							$('#reg, #log').hide();
							$('#member').html($.cookie('user'));
						},2000);
					}
				}
			});
		},
		highlight          :function(element,errorClass){
			$(element).removeClass('valid');
			$(element).addClass('invalid');
		},
		unhighlight        :function(element,errorClass){
			$(element).removeClass('invalid');
			$(element).addClass('valid');
		}
	});
	//登录表单验证
	$('#logForm').validate({
		rules              :{
			logAccount :{
				required :true,
				minlength:5
			},
			logPassword:{
				required :true,
				minlength:6
			}
		},
		messages           :{
			logAccount :{
				required :'帐号不得为空！',
				minlength:jQuery.format('帐号不得小于{0}位！')
			},
			logPassword:{
				required :'密码不得为空！',
				minlength:jQuery.format('密码不得小于{0}位！')
			}
		},
		errorLabelContainer:'#logWarn',
		wrapper            :'span',
		submitHandler      :function(form){
			$(form).ajaxSubmit({
				url         :'http://'+url+'/src/php/login.php',
				type        :'POST',
				beforeSubmit:function(formData,jqForm,options){
					$('#logDiv').popover({
						html     :true,
						content  :'正在为您登录&nbsp;<img src="img/loading.gif"/>',
						placement:'top',
						delay    :{"show":50,"hide":50},
						trigger  :'manual'
					});
					$('#logDiv').popover('show');
					$('#logBtn').attr("disabled","");
				},
				success     :function(responseText,statusText){
					if(responseText){
						$('#logDiv').popover({
							html     :true,
							content  :'已经登录成功&nbsp;<img src="img/success.gif"/>',
							placement:'top',
							delay    :{"show":50,"hide":50},
							trigger  :'manual'
						});
						if($('#logExp').is(':checked')){
							$.cookie('user',$('#logAccount').val(),{
								expires:7
							});
						}else{
							$.cookie('user',$('#logAccount').val());
						}
						setTimeout(function(){
							$('#logDiv').popover('hide');
							$('#logBtn').removeAttr("disabled","");
							$('#logBox').modal('hide');
							$('#logForm').resetForm();
							$('#member, #logout').show();
							$('#reg, #log').hide();
							$('#member').html($.cookie('user'));
						},2000);
					}
				}
			});
		},
		highlight          :function(element,errorClass){
			//$(element).css({'border':'1px solid rgba(253, 8, 8, 0.29)','background':'url("../img/invalid.png")
			// no-repeat right','padding-right':'3px'});
			$(element).removeClass('valid');
			$(element).addClass('invalid');
		},
		unhighlight        :function(element,errorClass){
			//$(element).css({'border':'1px solid green','background':'url("../img/valid.png") no-repeat
			// right','padding-right':'3px'});
			$(element).removeClass('invalid');
			$(element).addClass('valid');
		}
	});
	
});