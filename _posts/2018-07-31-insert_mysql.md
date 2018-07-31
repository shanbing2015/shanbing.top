---
layout: post
title: centos7安装mysql8.0和相关优化以及版本区别
tags: [mysql]
hide: true
---
为了把测试和生产库分开，隔离内外网和其它安全问题，刚刚在centos7上搭建一次mysql8.0版本的mysql服务器。

之前的测试库是之前用docker部署的msyql5.x的一个服务，用docker化是为了方便容器镜像，因为也经常改动参数避免破坏系统环境。

为什么要使用mysql8.0而不是5.x的呢，我看了官方新版本介绍和其它博客说明比较，我这里也列出一个比较不同的特性吧。
#### mysql5.x 和mysql8.0 区别
...

获取有人有这样的疑问，测试库和生产库版本不同，会不会出现线上bug。这个我只能暂时回答还没遇到，等遇到了到时候也会描述出来什么问题已经怎么解决的方案。
接下来我们看下安装教程吧。
---
### 安装mysql
#### 下载MySQL8.0 社区版
搭建最基础server需下载四个rpm文件(依赖顺序排列)
我这里也直接列出下载地址了。通过wget或者上传到centos上进行安装

[mysql-community-common][1]

[mysql-community-libs][2]:依赖common

[mysql-community-client][3]:依赖libs

[mysql-community-server][4]:依赖client

#### 依次安装
	rpm -ivh mysql-community-*.rpm
        
##### 检查是否安装成功
	rpm -qa | grep mysql

---
### 启动mysql
#### 结构
	数据库目录:/var/lib/mysql/
	日志目录:/var/log/
	配置文件:/etc/my.conf

#### 启动mysql
	systemctl start mysqld

#### 查看状态
	systemctl status mysqld

#### 登陆MySQL
	登陆失败，mysql8默认是有密码的

#### 获取密码
	mysql启动后默认生成一个随机密码：cat /var/log/mysqld.log | grep password

#### 更改密码
	alter user USER() IDENTIFIED BY ‘*****’;

#### 创建数据库
	CREATE DATABASE comment;

---
### 优化mysql
#### 更改密码加密方式
因现版本默认是caching_sha2_password，很多客户端不支持。
	
	default_authentication_plugin=mysql_native_password

#### 更改端口号 
        port=20180
        show global variables like 'port';

#### 设置字符集
	mysql8.0默认为urfmb4,无需设置字符集
	show variables like 'character%';
重启mysql

#### 创建用户并设置权限
	CREATE USER 'comment'@'localhost' IDENTIFIED BY 'Comment@shanbing.top';
	grant select,insert,update on comment.* to 'comment'@'localhost';
	FLUSH PRIVILEGES;	#刷新权限

本地登陆测试ok

### 备份mysql
#### 定时脚本备份sql
未完待续

  [1]: https://cdn.mysql.com//Downloads/MySQL-8.0/mysql-community-common-8.0.12-1.el7.x86_64.rpm
  [2]: https://cdn.mysql.com//Downloads/MySQL-8.0/mysql-community-libs-8.0.12-1.el7.x86_64.rpm
  [3]: https://cdn.mysql.com//Downloads/MySQL-8.0/mysql-community-client-8.0.12-1.el7.x86_64.rpm
  [4]: https://cdn.mysql.com//Downloads/MySQL-8.0/mysql-community-server-8.0.12-1.el7.x86_64.rpm

