## 实现步骤
1. 抓取网站数据 标签 文章 标签和文章的关系
2.把抓下来的数据保存到数据库（mysql）
3. 开发一个网站展示这些数据
4.让用户可以登陆，可以选择自己喜欢的标签
5.如果有新的文章抓取下来了，需要把这个文章通过邮件推送给喜欢的人
6.还有一个全文本检索的功能，保存文章的时候也会向elastic存一份，方便以后检索。
7.如何把这个爬虫项目部署到阿里云上，如何访问?

## 抓取数据
- 所有的标签  https://juejin.im/subscribe/all  保存到标签仓库
- 抓取标签下面的文章 `https://juejin.im/tag/%E5%89%8D%E7%AB%AF`  https://juejin.im/tag/%E5%89%8D%E7%AB%AF 把文章列表保存到数据库中，并且和标签进行关联
- 抓取文章的正文 `https://mp.weixin.qq.com/s/9cjLV99jKIDNyzFl0LszzA`



1.安装java  https://www.oracle.com/technetwork/java/javase/archive-139210.html
2.jdk配置环境变量  http://www.runoob.com/java/java-environment-setup.html
3. 下载elasticsearch  https://www.elastic.co/cn/downloads/elasticsearch
4.进入es目录，进入bin目录，执行 .\elasticsearch.bat
5.安装mysql  下载地址：https://dev.mysql.com/downloads/file/?id=484920，安装文档：https://www.jianshu.com/p/1aba608b21c5

免安装版文档：https://blog.csdn.net/qq_32314965/article/details/85694024


新增my.ini文件
添加mysql环境变量

 bin目录下执行  .\mysqld --initialize --user=mysql --console

密码 50tqQ4kitt(r

D:\mysql-5.7.21-winx64\bin> 
 bin目录下执行 .\mysqld install MySQL --defaults-file="E:\Program Files\mysql-8.0.15-winx64\my.ini"

 bin目录下执行，启动mysql   net start mysql

 mysql -u root -p
 
bin目录下，启动mysql   net start mysql 后执行命令
// 修改密码
ALTER USER 'root'@localhost IDENTIFIED WITH mysql_native_password BY '123456';

FLUSH PRIVILEGES;

 navicate for mysql 安装，
 下载https://www.navicat.com.cn/download/direct-download?product=navicat_mysql_cs_x64.exe&location=1
 激活https://www.jianshu.com/p/42a33b0dda9c



// mysql 
// bluebird 将mysql转化成promise


cmd命令框
SET DEBUG=juejin:*
node main.js



