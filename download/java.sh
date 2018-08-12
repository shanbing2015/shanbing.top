#!/bin/bash

service=comment-service	#git项目名
#branch=master		#分支名
branch=dev
active=pro		#springBoot 启动环境
	
dataPath=/home/data	
deployPath=/home/deploy
logPath=/home/log
set -e

rm -fr $dataPath/$service
mkdir -p  $dataPath/$service
rm -rf $deployPath/$service
mkdir -p $deployPath/$service
rm -rf $logPath/$service
mkdir -p $logPath/$service
echo "[1] mkdir completed"
cd $dataPath/$service

git clone https://github.com/shanbing2015/$service.git --progress -b $branch ./
echo "[2] git clone completed"
mvn clean package -DskipTests=true -P test -U
echo "[3] mvn completed"
cd $deployPath/$service/
#echo $PWD
cp $dataPath/$service/target/*.jar .
ps aux | grep java |grep "$service/" | grep -v grep | awk '{print $2}' | xargs -i kill -9 {}
echo "[4] kill completed"

#JAVA_OPTS=" -Xdebug -Xrunjdwp:transport=dt_socket,address=8787,server=y,suspend=n"
JAVA_OPTS="-Xms128m -Xmx256m -XX:NewSize=128m -XX:MaxNewSize=128m -XX:MaxTenuringThreshold=10 -XX:NewRatio=2 "
nohup java -jar $JAVA_OPTS  $deployPath/$service/*.jar  --spring.profiles.active=$active > $logPath/$service/console.log 2>&1 &
echo "[5] deploy completed"

echo "[6] begin tail log........"
sleep 3
cd $logPath/$service
echo 'logPath:'$PWD
tail -f $logPath/$service/console.log

