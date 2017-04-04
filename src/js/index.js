/**
 * Created by LIN on 2016/2/10.
 */
//替换特殊字符的函数
function replacePos(strObj,pos,replaceText){
	return strObj.substr(0,pos-1)+replaceText+strObj.substring(pos,strObj.length);
}
$(function(){
	/*初始化*/
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
	$('[data-toggle="tooltip"]').tooltip({
		placement:'top'
	});
	/*注册登录按钮*/
	if($.cookie('user')){
		$('#member, #logout').show();
		$('#reg, #log').hide();
		$('#member').html($.cookie('user'));
	}else{
		$('#member, #logout').hide();
		$('#reg, #log').show();
	}

	$('#reg').click(function(){
		$('#regBox').modal({
			show    :true,
			keyboard:true
		});
		$('#regForm').resetForm();
	});
	$('#log').click(function(){
		$('#logBox').modal({
			show    :true,
			keyboard:true
		});
		$('#logForm').resetForm();
	});
	$('#logout').click(function(){
		$.removeCookie('user');
		window.location.href="/src/html/";
	});

	/*注册框*/
	$('#regForm').validate({
		rules              :{
			userN:{
				required :true,
				minlength:6,
				remote   :{
					url :'php/is_user.php',
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
				url         :'php/add.php',
				type        :'POST',
				beforeSubmit:function(formData,jqForm,options){
					$('#regDiv').popover({
						html     :true,
						content  :'正在为您注册&nbsp;<img src="../img/loading.gif"/>',
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
							content  :'已经注册成功&nbsp;<img src="../img/success.gif"/>',
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
	/*登录框*/
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
				url         :'php/login.php',
				type        :'POST',
				beforeSubmit:function(formData,jqForm,options){
					$('#logDiv').popover({
						html     :true,
						content  :'正在为您登录&nbsp;<img src="../img/loading.gif"/>',
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
							content  :'已经登录成功&nbsp;<img src="../img/success.gif"/>',
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

	/*返回按钮*/
	$('#returnLog').click(function(){
		$(this).parents('.modal-footer').prev('.modal-body').find('input').removeClass('invalid valid');
		$('#logWarn').children().css('display','none');
	});
	$('#returnReg').click(function(){
		$(this).parents('.modal-footer').prev('.modal-body').find('input').removeClass('invalid valid');
		$('#regWarn').children().css('display','none');
	});
	$('#returnQues').click(function(){
		$(this).parents('.modal-footer').prev('.modal-body').find('input').removeClass('invalid valid');
		$('#quesWarn').children().css('display','none');
		$('#quesForm').resetForm();
		um.execCommand('cleardoc');
	});

	/*显示用户发布的问题*/
	$.ajax({
		//所有发布的问题以及相对应的评论数量，JSON数组
		//[{"count":"0","id":"37","title":"“乱世用重典”京东全球购有新意",}]
		url    :'php/show_content.php',
		type   :'POST',
		//success参数：由服务器返回，并根据dataType参数进行处理后的数据；描述状态的字符串；jqXHR（在jQuery 1.4.x的中，XMLHttpRequest） 对象
		success:function(response,status,xhr){
			var json=$.parseJSON(response);
			//console.log(json);
			//[Object { count="10",  id="52",  title="Web前端是不是被过度的炒作了？",  更多...}, Object { count="0",  id="51",
			// title="资深 IT 技术人员比新入职场 1-2 年的 IT 技术人员贵在哪？",  更多...}, Object { count="0",  id="50",  title="为什么留不住人才？",
			// 更多...}]
			var html='';
			//生成用户发布的问题列表
			//jQuery.each(object, [callback])不同于$().each() 方法，此方法可用于例遍任何对象。
			//回调函数拥有两个参数：第一个为对象的成员或数组的索引，第二个为对应变量或内容。如果需要退出 each 循环可使回调函数返回 false，其它返回值将被忽略。
			$.each(json,function(index,value){
				html+='<h4>'+value.user+' 发表于 '+value.date+'</h4><h3>'+value.title+'</h3><div class="editor">'+value.content+'</div><div class="bottom"><span class="comment" data-id="'+value.id+'">'+value.count+'条评论</span><span class="up">收起</span></div><hr noshade="noshade" size="1" /><div class="comment_list"></div>';
			});
			$('.content').append(html);
			//显示200字符摘要以及显示全部功能
			var arr    =[];
			var summary=[];
			$.each($('.editor'),function(index,value){
				arr[index]    =$(value).html();
				summary[index]=arr[index].substr(0,200);
				if(summary[index].substring(199,200)=='<'){
					summary[index]=replacePos(summary[index],200,'');
				}
				if(summary[index].substring(198,200)=='</'){
					summary[index]=replacePos(summary[index],200,'');
					summary[index]=replacePos(summary[index],199,'');
				}
				//当问题描述大于200个字时
				if(arr[index].length>200){
					//尾部自动添加显示全部以及省略号
					summary[index]+='...<span class="down">显示全部</span>';
					$(value).html(summary[index]);
				}
				$('.bottom .up').hide();
			});
			//点击显示全部时
			$.each($('.editor'),function(index,value){
				//委托绑定,通过父节点on()来绑定
				$(this).on('click','.down',function(){
					//eq(index|-index)获取当前链式操作中第N个jQuery对象，返回jQuery对象，当参数大于等于0时为正向选取，比如0代表第一个，1代表第二个。当参数为负数时为反向选取，比如-1为倒数第一个
					$('.editor').eq(index).html(arr[index]);
					$(this).hide();
					$('.bottom .up').eq(index).show();
				});
			});
			//点击收起时
			$.each($('.bottom'),function(index,value){
				$(this).on('click','.up',function(){
					$('.editor').eq(index).html(summary[index]);
					$(this).hide();
					$('.editor .down').eq(index).show();
				});
			});
			//点击查看评论时
			$.each($('.bottom'),function(index,value){
				//委托绑定,通过父节点on()来绑定
				$(this).on('click','.comment',function(){
					var comment_this=this;
					var commentL    =$('.comment_list').eq(index);
					//登陆之后才能查看以及评论
					if($.cookie('user')){
						//如果不存在表单的话,才新增评论表单带加载评论功能
						if(!commentL.has('form').length){
							//将加载评论代码放置于此,是为了只添加一次即可
							$.ajax({
								url       :'php/show_comment.php',
								type      :'POST',
								data      :{
									titleid:$(comment_this).attr('data-id')
								},
								beforeSend:function(jqXHR,settings){
									commentL.append('<dl class="comment_load"><dd>正在加载评论</dd></dl>');
								},
								success   :function(response,status){
									//隐藏正在加载评论
									commentL.find('.comment_load').hide();
									//show_comment.php中读到的用户评论转换为JSON
									var json_comment=$.parseJSON(response);
									var count       =0;
									$.each(json_comment,function(index2,value){
										//show_comment.php中得到总页码数
										count=value.count;
										commentL.append('<dl class="comment_content"><dt>'+value.user+'</dt><dd>'+value.comment+'</dd><dd class="date">'+value.date+'</dd></dl>');
									});
									commentL.append('<dl><dd><span class="load_more">加载更多评论</span></dd></dl>');
									////当0条评论或者只有一页的时候，隐藏加载更多
									var page=2;
									if(page>count){
										commentL.find('.load_more').off('click');
										commentL.find('.load_more').hide();
									}
									//当总页码数大于1时，点击加载更多
									//改为on()事件更容易销毁
									commentL.find('.load_more').button().on('click',function(){
										//防止在加载时候快速连续点击导致重复事件发生
										commentL.find('.load_more').button('disable');
										$.ajax({
											url       :'php/show_comment.php',
											type      :'POST',
											data      :{
												titleid:$(comment_this).attr('data-id'),
												//传入加载的页码
												page   :page
											},
											beforeSend:function(jqXHR,settings){
												commentL.find('.load_more').html('<img src="../img/more_load.gif" />');
											},
											success   :function(response,status){
												var json_comment_more=$.parseJSON(response);
												//加载的新内容
												$.each(json_comment_more,function(index3,value){
													commentL.find('.comment_content').last().after('<dl class="comment_content"><dt>'+value.user+'</dt><dd>'+value.comment+'</dd><dd class="date">'+value.date+'</dd></dl>');
												});
												commentL.find('.load_more').button('enable');
												commentL.find('.load_more').html('加载更多评论');
												page++;
												if(page>count){
													commentL.find('.load_more').off('click');
													commentL.find('.load_more').hide();
												}
											}
										});
									});
									//服务器端评论加载好之后才加载评论功能
									commentL.append('<form><dl class="comment_add"><dt><textarea name="comment"></textarea></dt><dd><input type="hidden" name="titleid" value="'+$(comment_this).attr('data-id')+'" /><input type="hidden" name="user" value="'+$.cookie('user')+'" /><input type="button" value="发表" /></dd></dl></form>');
									//添加评论表单之后添加btn提交功能
									commentL.find('input[type=button]').button().click(function(){
										var _this=this;
										//alert(_this);//INPUT
										commentL.find('form').ajaxSubmit({
											url         :'php/add_comment.php',
											type        :'POST',
											beforeSubmit:function(formData,jqForm,options){
												$(_this).popover({
													html     :true,
													content  :'正在发表评论&nbsp;<img src="../img/loading.gif"/>',
													placement:'top',
													delay    :{"show":50,"hide":50},
													trigger  :'manual'
												});
												$(_this).popover('show');
												$(_this).attr("disabled","");
											},
											success     :function(responseText,statusText){
												$(_this).popover({
													html     :true,
													content  :'评论提交成功&nbsp;<img src="../img/success.gif"/>',
													placement:'top',
													delay    :{"show":50,"hide":50},
													trigger  :'manual'
												});
												if(responseText){
													setTimeout(function(){
														$(_this).removeAttr("disabled","");
														var date=new Date();
														$(_this).popover('hide');
														commentL.prepend('<dl class="comment_content"><dt>'+$.cookie('user')+'</dt><dd>'+commentL.find('textarea').val()+'</dd><dd>'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'</dd></dl>');
														commentL.find('form').resetForm();
													},1000);
												}
											}
										});
									});
								}
							});
						}
						//点击评论列表时
						if(commentL.is(':hidden')){
							commentL.show();
						}else{
							commentL.hide();
						}
					}else{
						$('.comment').eq(index).popover({
							html     :true,
							content  :'您还未登录！&nbsp;<img src="../img/error.png"/>',
							placement:'right',
							delay    :{"show":50,"hide":50},
							trigger  :'manual'
						});
						$('.comment').eq(index).popover('show');
						setTimeout(function(){
							$('.comment').eq(index).popover('hide');
							$('#logBox').modal({
								show    :true,
								keyboard:true
							});
						},1000);
					}
				});
			});
		}
	});
	/*提问框*/
	$('#question_button').popover({
		html     :true,
		content  :'您还未登录！&nbsp;<img src="../img/error.png"/>',
		placement:'bottom',
		delay    :{"show":50,"hide":50},
		trigger  :'manual'
	});
	var um=UM.getEditor('myEditor');
	um.execCommand('cleardoc');
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
	//发布问题框
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
				url         :'php/add_content.php',
				type        :'POST',
				data        :{
					user   :$.cookie('user'),
					content:um.getContentTxt()
				},
				beforeSubmit:function(formData,jqForm,options){
					$('#quesBtn').popover({
						html     :true,
						content  :'正在提交问题&nbsp;<img src="../img/loading.gif"/>',
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
						content  :'问题提交成功&nbsp;<img src="../img/success.gif"/>',
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
});



































