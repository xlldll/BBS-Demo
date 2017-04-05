/**
 * Created by LinChuQiang.
 */
$( function() {
	var jqXHR_content = $.ajax( {
		url      : 'http://bbs-demo:8080/src/ajax/content.json',
		type     : 'GET',
		dataType : 'json'
	} );
	var contenting = function( data ) {
		var str = '';
		$.each( data,function( key,value ) {
			str += '<h4><strong>' + value.user + '</strong> 发表于 <strong>' + value.date + '</strong></h4><h3>' + value.title + '</h3><div class="quesContent">' + omitContent( value.content ) + '</div><div class="quesFooter"><span class="showComment" data-id="' + value.id + '">' + value.count + '条评论</span><span class="hideContent"><strong>收起内容</strong></span></div><hr noshade="noshade" size="3"><div class="commentList"></div>';
		} );
		var $myContent = $( ".myQues" ).detach();
		$myContent.html( str );
		$( '.container' ).append( $myContent );
		//隐藏收起内容
		$( '.hideContent' ).hide();
		commentListEvent();
	};
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
		return data;
	}
	var hideContentEvent = function( data ) {
		$.each( $( '.quesFooter' ),function( key,value ) {
			var quesFooter = $( this );
			quesFooter.on( 'click','.hideContent',function() {
				var contentBox = $( '.quesContent' ).eq( key ).detach();
				//console.log(data);
				var str = omitContent( data[ key ].content );
				contentBox.html( str );
				quesFooter.before( contentBox );
				//显示收起内容
				$( '.hideContent' ).eq( key ).hide();
			} )
		} );
		return data;
	}
	var commentListEvent = function() {
		$.each( $( '.quesFooter' ),function( key,value ) {
			var quesFooter = $( this );
			quesFooter.on( 'click','.showComment',function() {
				var showComment = this;
				var commentL = $( '.commentList' ).eq( key );
				//console.log(showComment);
				//console.log(commentL);
				//如果不存在表单的话,才新增评论表单带加载评论功能
				if( !commentL.has( 'form' ).length ) {
					var jqXHR_comment = $.ajax( {
						url        : 'http://bbs-demo:8080/src/ajax/comment.json',
						type       : 'GET',
						dataType   : 'json',
						beforeSend : function( jqXHR,settings ) {
								commentL.append( '<dl class="comment_load"><dd>正在加载评论</dd></dl>' );
						}
					} );
					jqXHR_comment.done( function( data ) {
						//隐藏正在加载评论
						commentL.find( '.comment_load' ).hide();
						var count = 0;
						$.each( data,function( key,value ) {
							//show_comment.php中得到总页码数
							count = value.count;
							commentL.append( '<dl class="comment_content"><dt>' + value.user + '</dt><dd>' + value.comment + '</dd><dd class="date">' + value.date + '</dd></dl>' );
						} );
						commentL.append( '<dl><dd><span class="load_more">加载更多评论</span></dd></dl>' );
						var page=2;
						if(page>count){
							commentL.find('.load_more').off('click');
							commentL.find('.load_more').hide();
						}
						//服务器端评论加载好之后才加载评论功能
						commentL.append('<form><dl class="comment_add"><dt><textarea name="comment"></textarea></dt><dd><input type="hidden" name="titleid" value="'+$(showComment).attr('data-id')+'" /><input type="hidden" name="user" value="'+$.cookie('user')+'" /><input type="button" value="发表" /></dd></dl></form>');
					} )
				}
				//点击评论列表时
				if(commentL.is(':hidden')){
					commentL.show();
				}else{
					commentL.hide();
				}
			} )
		} )
	}
	var addComment = function( data,showComment,commentL ) {
		console.log( data );
		console.log( showComment );
		console.log( commentL );
	};
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
	
	jqXHR_content.done( contenting ).then( showContentEvent ).then( hideContentEvent );
} )