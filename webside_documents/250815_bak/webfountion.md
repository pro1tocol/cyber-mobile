---
title: Docker部署typecho框架
abbrlink: 41080
date: 2024-06-19 08:13:02
---

本次搭建使用的Web服务器为nginx，喜欢用apache的童鞋可以自行修改相关文件结构

## 正式搭建环节

### 先梳理文件数据结构(工作目录)

| 容器目录 | 一级目录 | 二级目录 |
| :------: | :------: | :------: |
| / | web.key | - |
| / | web.crt | - |
| / | docker-compose.yml | - |
| / | php/   | Dockerfile |
| / | nginx/ | nginx.conf |
| / | mysql/ | - |
| / | web/  | # typecho框架 |
| / | mysql.env | - |


## 搭建执行工作的逻辑文件目录

### 可以点击本章这篇文章 [机构认证【域名+VPS证书】三分钟搞定](https://web.workspace.net/s/3a-cert.html#) &nbsp; 完成操作后，需要1套域名及证书，复制到工作目录下，分别是网站的web.key和web.crt文件

### 建立docker-compose.yml文件(使用docker run同理)，如下内容

``` bash
$    version: "3"
$    
$    services:
$      nginx:
$        image: nginx
$        restart: always
$        container_name: nginx
$        environment:
$          - TZ=Asia/Shanghai
$        ports:
$          - "80:80"
$        volumes:
$          - /root/docker-web/:/opt/
$          - ./web:/var/www/html
$          - ./nginx/nginx.conf:/etc/nginx/nginx.conf
$          - ./nginx/logs/:/etc/nginx/logs/
$        depends_on:
$          - php
$        networks:
$          - web
$    
$      php:
$        build: php
$        restart: always
$        container_name: php
$        expose:
$          - "9000"
$        volumes:
$          - ./web:/var/www/html
$        environment:
$          - TZ=Asia/Shanghai
$        depends_on:
$          - mysql
$        networks:
$          - web
$    
$      mysql:
$        image: mysql:5.7
$        restart: always
$        container_name: mysql
$        environment:
$          - TZ=Asia/Shanghai
$        expose:
$          - "3306"
$        env_file:
$          - mysql.env
$        volumes:
$          - ./mysql/data:/var/lib/mysql
$          - ./mysql/logs:/var/log/mysql
$          - ./mysql/conf:/etc/mysql/conf.d
$        networks:
$          - web
$    
$    networks:
$      web:
```

意思是容器内部会生成一个名为web的局域网络，用于链接整合数据库、php、nginx各子容器，同时网络端口会接入宿主机端口实现转发

### 建立php/Dockerfile文件，加入如下内容

``` bash
$ FROM php:7.3.29-fpm
    
$   RUN apt-get update && apt-get install -y libmysqli-dev && docker-php-ext-install pdo_mysql mysqli
    
$   RUN echo "output_buffering = 4096" > /usr/local/etc/php/conf.d/php.ini && echo "date.timezone = PRC" >> /usr/local/etc/php/conf.d/php.ini
```

使用该版本的php相对稳定

下载typecho框架并部署

``` bash
    cd web/
    wget https://github.com/typecho/typecho/releases/download/v1.2.1/typecho.zip && unzip typecho.zip
    cd ..
```

### 建立nginx/nginx.conf文件，加入如下内容

``` bash
$    #user  nobody;
$    worker_processes  1;
$    
$    error_log  logs/error.log;
$    error_log  logs/error.log  notice;
$    error_log  logs/error.log  info;
$    
$    pid        logs/nginx.pid;
$    
$    
$    events {
$        worker_connections  1024;
$    }
$    
$    http {
$        include       mime.types;
$        default_type  application/octet-stream;
$    
$        sendfile    on;
$    
$        keepalive_timeout   65;
$    
$        server {
$          listen 80;
$          server_name web.net; # 修改为你的网站域名
$          root /var/www/html;
$          index index.html;
$    
$          location / {
$            try_files $uri $uri/ /index.php?$args;
$          }
$    
$          location ~ .*\.php(\/.*)*$ {
$            proxy_set_header HOST $host;
$            proxy_set_header X-Real-IP $remote_addr;
$            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
$            proxy_set_header X-Forwarded-Proto "http";
$            proxy_set_header X-NginX-Proxy true;
$            fastcgi_pass   php:9000;
$            if (!-e $request_filename){
$              rewrite ^(.*)$ /index.php?q=$1 last;
$              break;
$            }
$            fastcgi_index  index.php;
$            fastcgi_param  PATH_INFO $fastcgi_path_info;
$            fastcgi_param  PATH_TRANSLATED $document_root$fastcgi_path_info;
$            fastcgi_param  SCRIPT_NAME $fastcgi_script_name;
$            fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
$            include        fastcgi_params;
$          }
$    
$        }
$    
$   }
```

该配置文件仅包含了http协议的访问端口，如需要https加密通信的可修改配置文件信息
### 完成以上四个步骤所需的内容基本就搞定了

#### 接下来就是部署容器，启用服务端

```bash
$ docker-compose up -d # 运行容器
$ docker-compose logs # 检查容器运行情况
```

#### 没有报错的话，并使用net-tools工具查看相关已开放端口，使用 http://web.net(你的域名) 
能够正常访问空白页面则成功了，接下来你需要根据自己网站的需求在web工作目录下安装自定义框架，便可进行下一步搭建操作

以上便是本篇文章的全部内容，感谢阅读