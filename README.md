# BBS论坛Demo
- Create Update Retrieve Delete
- CURD数据读取主页演示

# (BBS_Demo_Github)[https://xlldll.github.io/BBS-Demo/]

# ISSUES:

1. gruntfile.js 命名错误问题
2. scss与sass的区别
3. login.php 故意改错$query，前端仍然登陆成功，后端却显示SQL 错误！
4. 退出之后，用户bnbbs的提问并没有清空！
5. 发表问题之后，页面并无加载新发布问题。
6. 登陆时，用户名的大小写cookie以及验证通过问题。
7. 解决html <base url="..."> 标签不起作用的问题。[http://blog.163.com/lgh_2002/blog/static/4401752620138551327449/]
解决方案说明：
- base标签的href属性指明了资源的相对路径地址， 末尾一定要带斜杠
- 在采用了base标签后，以加载CSS为例，其地址前面是坚决不能带斜杠的，因为这里的斜杠是永远相对于域名这个相对路径，而不是base指定的地址。

8. 解决“HTTP/1.1 405 Method not allowed”问题，让静态文件响应POST请求。
- [http://blog.csdn.net/haitun312366/article/details/8241350]
- [http://stackoverflow.com/questions/37843338/error-405-method-not-allowed-when-sending-a-put-ajax-request-to-php-with-jquery]
- [http://blog.csdn.net/fdipzone/article/details/46390573/]
- 改变$.ajax的URL为完整地址 url :'http://bbs-demo/src/php/is_user.php' ；PHP config中设置 header("Access-Control-Allow-Origin: *");

9. 疑问：JQ.children()也是DHTML的方法？

10. window.location.href=window.location.href;
- [http://blog.csdn.net/whq19890827/article/details/48310965]
- "top.location.href"是最外层的页面跳转
- "window.location.href"、"location.href"是本页面跳转
- "parent.location.href"是上一层页面跳转

11. show_comment.php中的print_r($json);错误：Uncaught SyntaxError: Unexpected token , in JSON at position 1234
