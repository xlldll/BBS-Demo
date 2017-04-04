# BBS论坛Demo
- Create Update Retrieve Delete
- CURD数据读取主页演示

## 2015-10-ISSUES:
1. gruntfile.js 命名错误问题
2. scss与sass的区别
3. login.php 故意改错$query，前端仍然登陆成功，后端却显示SQL 错误！
4. 退出之后，用户bnbbs的提问并没有清空！
5. 发表问题之后，页面并无加载新发布问题。
6. 登陆时，用户名的大小写cookie以及验证通过问题。
7. 解决html <base url="..."> 标签不起作用的问题。[http://blog.163.com/lgh_2002/blog/static/4401752620138551327449/]
解决方案说明：
1. base标签的href属性指明了资源的相对路径地址， 末尾一定要带斜杠
2. 在采用了base标签后，以加载CSS为例，其地址前面是坚决不能带斜杠的，因为这里的斜杠是永远相对于域名这个相对路径，而不是base指定的地址。