--- 
layout: page
title : Note 
permalink: /note/
subtitle: "临时的笔记、记录的内容" 
#feature-img: "assets/img/pexels/computer.jpeg"
---

{% include note.html %}

---
#### 数据库备份
可以与linux定时任务相配合，做到每天自动定时备份，脚本可配置备份文件过期。脚本基于mysqldump命令进行备份。

附件:[备份脚本][1]

#### java项目部署脚本
代码本地push提交，在服务端执行脚本自动部署更新服务。
依赖：git:拉取仓库代码；maven:源码编译

附件:[部署脚本][2]

---

### 命令

[1]: /download/mysqlBackup.sh
[2]: /download/java.sh
