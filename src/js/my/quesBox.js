/**
 * Created by LinChuQiang.
 */
$( function() {
	
	
	//后台服务器url地址
	var url='bbs-github:80';
	
	//点击提问按钮时，根据cookie是否弹出问题发布框
	$('#question_button').click(function(){
		if($.cookie('user')){
			$('#quesBox').modal({
				show    :true,
				keyboard:true
			});
		}else{
			$('#question_button').popover('show');
			setTimeout(function(){
				$('#question_button').popover('hide');
				$('#logBox').modal({
					show    :true,
					keyboard:true
				});
			},1000);
		}
	});
	
	//提问按钮的提示框
	$('#question_button').popover({
		html     :true,
		content  :'您还未登录！&nbsp;<img src="img/error.png"/>',
		placement:'bottom',
		delay    :{"show":50,"hide":50},
		trigger  :'manual'
	});
	
	var um=UM.getEditor('myEditor');
	//设置编辑器内容
	um.ready(function() {
		um.setContent('<p>如题所示。</p>');
	});
	
	//清空内容
	um.execCommand('cleardoc');
	
	//点击发布问题表单返回按钮时
	$('#returnQues').click(function(){
		$(this).parents('.modal-footer').prev('.modal-body').find('input').removeClass('invalid valid');
		$('#quesWarn').children().css('display','none');
		$('#quesForm').resetForm();
		um.execCommand('cleardoc');
	});
	
	//发布问题框的验证
	$('#quesForm').validate({
		rules              :{
			quesN:{
				required :true,
				minlength:6
			}
		},
		messages           :{
			quesN:{
				required :'问题标题不得为空！',
				minlength:jQuery.format('标题不得小于{0}位！')
			}
		},
		errorLabelContainer:'#quesWarn',
		wrapper            :'span',
		submitHandler      :function(form){
			$(form).ajaxSubmit({
				url         :'http://'+url+'/src/php/add_content.php',
				type        :'POST',
				data        :{
					user   :$.cookie('user'),
					//获取纯文本内容
					content:um.getContentTxt()
				},
				beforeSubmit:function(formData,jqForm,options){
					$('#quesBtn').popover({
						html     :true,
						content  :'正在提交问题&nbsp;<img src="img/loading.gif"/>',
						placement:'top',
						delay    :{"show":50,"hide":50},
						trigger  :'manual'
					});
					$('#quesBtn').popover('show');
					$('#quesBtn').attr("disabled","");
				},
				success     :function(responseText,statusText){
					$('#quesBtn').popover({
						html     :true,
						content  :'问题提交成功&nbsp;<img src="img/success.gif"/>',
						placement:'top',
						delay    :{"show":50,"hide":50},
						trigger  :'manual'
					});
					if(responseText){
						setTimeout(function(){
							$('#quesBox').modal('hide');
							$('#quesForm').resetForm();
							$('#quesBtn').removeAttr("disabled","");
							$('#quesBtn').popover('hide');
							um.execCommand('cleardoc');
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
})