/**
 * Created by LinChuQiang.
 * 这是一个新版的，采用$.Deferred对象来处理ajax
 */

$( function() {
	//后台服务器url地址
	var url='bbs-github:80';
	var urlBase='bbs-demo:8080';
	var jqXHR_content = $.ajax( {
		url      : 'http://'+urlBase+'/src/ajax/content.json',
		type     : 'GET',
		dataType : 'json'
	} );
	//根据帖子ID显示评论
	var waitA = function( showComment,commentL ) {
		var dfd = $.Deferred();
		$.ajax( {
			url        : 'http://'+url+'/src/php/show_comment.php',
			type       : 'POST',
			dataType   : 'json',
			jsonp      : false,
			data       : {
				titleid : $( showComment ).attr( 'data-id' )
			},
			beforeSend : function( jqXHR,settings ) {
				commentL.append( '<dl class="comment_load"><dd>正在加载评论</dd></dl>' );
			}
		} ).done( function( data,textStatus,jqXHR ) {
			dfd.resolve( data );
		} );
		return dfd.promise();
	}
	//根据帖子ID以及制定页码显示评论
	var waitB = function( showComment,page,commentL ) {
		var dfd = $.Deferred();
		$.ajax( {
			url        : 'http://'+url+'/src/php/show_comment.php',
			type       : 'POST',
			dataType   : 'json',
			jsonp      : false,
			data       : {
				titleid : $( showComment ).attr( 'data-id' ),
				//传入加载的页码
				page    : page
			},
			beforeSend : function( jqXHR,settings ) {
				commentL.find( '.load_more' ).html( '<img src="img/more_load.gif" />' );
			}
		} ).done( function( data ) {
			dfd.resolve( data );
		} );
		return dfd.promise();
	}
	//添加评论内容
	var waitC = function( input,param ) {
		var dfd = $.Deferred();
		$.ajax( {
			url        : 'http://'+url+'/src/php/add_comment.php',
			type       : 'POST',
			data       : param,
			beforeSend : function() {
				$( input ).popover( {
					html      : true,
					content   : '正在发表评论&nbsp;<img src="img/loading.gif"/>',
					placement : 'top',
					delay     : { "show" : 50,"hide" : 50 },
					trigger   : 'manual'
				} );
				$( input ).popover( 'show' );
				$( input ).attr( "disabled","" );
			}
		} ).done( function( data ) {
			dfd.resolve( data );
		} )
		return dfd.promise();
	}
	//生成评论内容
	var contenting = function( data ) {
		var str = '';
		$.each( data,function( key,value ) {
			str += '<h4><strong>' + value.user + '</strong> 发表于 <strong>' + value.date + '</strong></h4><h3>' + value.title + '</h3><div class="quesContent">' + omitContent( value.content ) + '</div><div class="quesFooter"><span class="showComment" data-id="' + value.id + '">' + value.count + '条评论</span><span class="hideContent"><strong>收起内容</strong></span></div><hr noshade="noshade" size="3"><div class="commentList"></div>';
		} );
		var $myContent = $( ".myQues" ).detach();
		$myContent.html( str );
		$( '.container' ).append( $myContent );
		//隐藏收起内容按钮
		$( '.hideContent' ).hide();
		showContentEvent( data );
		hideContentEvent( data );
		commentListEvent();
	};
	//点击显示全部内容时
	var showContentEvent = function( data ) {
		$.each( $( '.quesContent' ),function( key,value ) {
			//console.log($(this));
			$( this ).on( 'click','.showAllContent',function() {
				var contentBox = $( '.quesContent' ).eq( key ).detach();
				contentBox.html( data[ key ].content );
				$( '.quesFooter' ).eq( key ).before( contentBox );
				//显示收起内容
				$( '.hideContent' ).eq( key ).show();
			} )
		} );
	}
	//点击收起内容时
	var hideContentEvent = function( data ) {
		$.each( $( '.quesFooter' ),function( key,value ) {
			var quesFooter = $( this );
			quesFooter.on( 'click','.hideContent',function() {
				var contentBox = $( '.quesContent' ).eq( key ).detach();
				//console.log(data);
				var str = omitContent( data[ key ].content );
				contentBox.html( str );
				quesFooter.before( contentBox );
				//隐藏收起内容
				$( '.hideContent' ).eq( key ).hide();
			} )
		} );
	}
	//为多余文本添加省略号
	function omitContent( str ) {
		var newstr = '';
		newstr = str.substr( 0,200 );
		//第198位字符和第199位字符
		if( newstr.substring( 198,200 ) == '</' ) {
			//替换第198位字符
			newstr = replacePos( newstr,198,'' );
			//替换第199位字符
			newstr = replacePos( newstr,199,'' );
		}
		//第199位字符
		if( newstr.substring( 199,200 ) == '<' ) {
			//替换第199位字符
			newstr = replacePos( newstr,199,'' );
		}
		newstr += '...<span class="showAllContent"><strong>显示全部</strong></span>';
		return newstr;
	}
	
	//替换特殊字符的函数
	function replacePos( strObj,pos,replaceText ) {
		//从0开始，取199个字符，加上替换的文本再加上剩余的结尾文本
		return strObj.substr( 0,pos - 1 ) + replaceText + strObj.substring( pos,strObj.length );
	}
	
	//点击评论列表
	var commentListEvent = function() {
		$.each( $( '.quesFooter' ),function( key,value ) {
			var quesFooter = $( this );
			quesFooter.on( 'click','.showComment',function() {
				var showComment = this;
				var commentL = $( '.commentList' ).eq( key );
				//console.log(showComment);
				//console.log(commentL);
				//点击评论列表时
				if( commentL.is( ':hidden' ) ) {
					commentL.show();
				} else {
					commentL.hide();
				}
				//登陆之后才能查看以及评论
				if( $.cookie( 'user' ) ) {
					//如果不存在表单的话,才新增评论表单带加载评论功能
					if( !commentL.has( 'form' ).length ) {
						waitA( showComment,commentL ).done( function( data ) {
							//隐藏正在加载评论
							commentL.find( '.comment_load' ).hide();
							var count = 0;
							$.each( data,function( key,value ) {
								//show_comment.php中得到总页码数
								count = value.count;
								commentL.append( '<dl class="comment_content"><dt>' + value.user + '</dt><dd>' + value.comment + '</dd><dd class="date">' + value.date + '</dd></dl>' );
							} );
							commentL.append( '<dl><dd><span class="load_more">加载更多评论</span></dd></dl>' );
							//当0条评论或者只有一页的时候，隐藏加载更多
							var page = 2;
							if( page > count ) {
								commentL.find( '.load_more' ).off( 'click' );
								commentL.find( '.load_more' ).hide();
							}
							//当总页码数大于1时，点击加载更多
							commentL.find( '.load_more' ).button().on( 'click',function() {
								//防止在加载时候快速连续点击导致重复事件发生
								commentL.find( '.load_more' ).button( 'disable' );
								waitB( showComment,page,commentL ).done( function( data ) {
									//加载的新内容
									$.each( data,function( key,value ) {
										commentL.find( '.comment_content' ).last().after( '<dl class="comment_content"><dt>' + value.user + '</dt><dd>' + value.comment + '</dd><dd class="date">' + value.date + '</dd></dl>' );
									} );
									commentL.find( '.load_more' ).button( 'enable' );
									commentL.find( '.load_more' ).html( '加载更多评论' );
									page++;
									if( page > count ) {
										commentL.find( '.load_more' ).off( 'click' );
										commentL.find( '.load_more' ).hide();
									}
								} );
							} );
							//服务器端评论加载好之后才加载评论功能
							commentL.append( '<form><dl class="comment_add"><dt><textarea name="comment"></textarea></dt><dd><input type="hidden" name="titleid" value="' + $( showComment ).attr( 'data-id' ) + '" /><input type="hidden" name="user" value="' + $.cookie( 'user' ) + '" /><input type="button" value="发表" /></dd></dl></form>' );
							//添加评论表单之后添加btn提交功能
							commentL.find( 'input[type=button]' ).button().click( function() {
								var _this = this;
								//alert(_this);//INPUT
								var param = commentL.find( 'form' ).serialize();
								console.log( param );
								waitC( _this,param ).done( function() {
									$( _this ).popover( {
										html      : true,
										content   : '评论提交成功&nbsp;<img src="img/success.gif"/>',
										placement : 'top',
										delay     : { "show" : 50,"hide" : 50 },
										trigger   : 'manual'
									} );
									setTimeout( function() {
										$( _this ).removeAttr( "disabled","" );
										var date = new Date();
										$( _this ).popover( 'hide' );
										commentL.prepend( '<dl class="comment_content"><dt>' + $.cookie( 'user' ) + '</dt><dd>' + commentL.find( 'textarea' ).val() + '</dd><dd>' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</dd></dl>' );
										commentL.find( 'form' ).resetForm();
									},1000 );
								} )
							} );
						} );
					}
				} else {
					$( '.showComment' ).eq( key ).popover( {
						html      : true,
						content   : '您还未登录！&nbsp;<img src="img/error.png"/>',
						placement : 'right',
						delay     : { "show" : 50,"hide" : 50 },
						trigger   : 'manual'
					} );
					$( '.showComment' ).eq( key ).popover( 'show' );
					setTimeout( function() {
						$( '.showComment' ).eq( key ).popover( 'hide' );
						$( '#logBox' ).modal( {
							show     : true,
							keyboard : true
						} );
					},1000 );
				}
			} )
		} )
	};
	jqXHR_content.done( contenting );
} )