---
title: 容器部署OwnCloud
published: 2024-06-22
description: ""
tags: ["Debian", "操作"]
category: 工具
draft: false
---

本站曾经搭建过共用云盘，奈何服务器的容量太小了，还每日每夜的被打

- 该云盘适合个人用，太多人存取比较考验服务器硬件性能，请量力而行

## 现在正式开始搭建

### 首先我们先梳理文件数据结构(工作目录)

| 容器目录 | 一级目录 | 二级目录 |
| --- | --- | --- |
| / | cloud.key | - |
| / | cloud.crt | - |
| / | docker-compose.yml | - |
| / | nginx/ | nginx.conf |
| / | mysql/ | - |
| / | OwnData/ | # 预留网盘数据目录 |
| / | mysql.env | - |

我习惯每次项目开始之前都梳理文件结构，方便在过程中修改及相关文件的查缺补漏，这是一个好习惯，可以在项目开始前进行文件的内容的汇总后再开始工作，运行过程中查看日志反馈情况即可

### 搭建执行工作的逻辑文件目录

### 域名的申请与解析到服务器，就不过多赘述了，可以查看这篇文章 [机构认证【域名+VPS证书】三分钟搞定](https://web.workspace.net/s/3a-cert.html#) 需要1套域名及证书，复制到工作目录下，分别是网站的cloud.key和cloud.crt文件

### 建立docker-compose.yml文件

```bash
# During initial ownCloud setup, select "Storage & database" --> "Configure the database" --> "MySQL/MariaDB"
# Database user: root
# Database password: 12345
# Database name: OwnCloud
# Database host: replace "localhost" with "mysql"
services:
  owncloud:
      image: owncloud
      restart: always
      volumes:
        - "./OwnData:/var/www/html"
      ports:
        - "80"
  mysql:
      image: mysql:5.7
      restart: always
      container_name: mysql
      environment:
        - TZ=Asia/Shanghai
      expose:
        - "3306"
      env_file:
        - mysql.env
      volumes:
        - ./mysql/data:/var/lib/mysql
        - ./mysql/logs:/var/log/mysql
        - ./mysql/conf:/etc/mysql/conf.d
  nginx:
      image: nginx
      restart: always
      container_name: nginx
      environment:
        - TZ=Asia/Shanghai
      ports:
        - "80:80"
        - "443:443"
      volumes:
        - ./:/opt/
        - ./OwnData:/var/www/html
        - ./nginx/nginx.conf:/etc/nginx/nginx.conf
        - ./nginx/logs/:/etc/nginx/logs/
      depends_on:
        - owncloud

```

注意配置文件注释部分的内容，接下来我们会在mysql.env文件中定义这些内容

### 建立mysql.env文件，加入如下内容

```bash
MYSQL_ROOT_PASSWORD=12345
MYSQL_DATABASE=OwnCloud
MYSQL_USER=user
MYSQL_PASSWORD=12345
```

在项目运行过程中会需要使用其中的参数，请根据自身情况进行修改

### 建立nginx/nginx.conf文件，加入如下内容

```bash
#user  nobody;
worker_processes  1;
error_log  logs/error.log;
error_log  logs/error.log  notice;
error_log  logs/error.log  info;
pid        logs/nginx.pid;
events {
      worker_connections  256;
}
http {
      include       mime.types;
      default_type  application/octet-stream;
      sendfile$ on;
      keepalive_timeout   65;
      server {
      listen 80;
      server_name cloud.net; # 修改为你解析好的域名
      return 301 https://$server_name$request_uri;
      }
      server {
      listen 443 ssl;
      server_name cloud.net; # 修改为你解析好的域名
      # SSL/TLS settings
      ssl_certificate /opt/cloud.crt;  # 修改为实际证书文件路径
      ssl_certificate_key /opt/cloud.key; # 修改为实际证书密钥路径
      ssl_session_timeout 5m;
      ssl_protocols TLSv1.2 TLSv1.3;
      ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
      ssl_prefer_server_ciphers on;
      ssl_session_cache shared:SSL:10m;
      # Security headers
      add_header X-Frame-Options "SAMEORIGIN" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header X-XSS-Protection "1; mode=block" always;
      # Proxy settings
      client_max_body_size 4g;
      location / {
		      proxy_pass <http://owncloud:80>;
		      proxy_set_header Host $host;
		      proxy_set_header X-Real-IP $remote_addr;
		      proxy_set_header X-Forwarded-For 127.0.0.1;
		      proxy_set_header X-Forwarded-Proto $scheme;
      }
     location = /favicon.ico {
          log_not_found off;
          access_log off;
          }
      }
}
```

### 到这里，基本上文件准备就已经完成了

```bash
docker-compose up -d # 运行项目
```

### 运行该项目，记住防火墙或者云服务器策略组打开80与443端口，该配置会将流量强制进行tls加密，对于个人云盘来说这是在数据存取得过程中很好的加密方式

以上便是本篇文章的全部内容，感谢阅读