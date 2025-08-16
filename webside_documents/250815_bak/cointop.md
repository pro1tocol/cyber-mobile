---
title: docker部署Cointop
abbrlink: 30913
date: 2024-06-12 12:33:23
---
首先 Cointop 是一个查看虚拟货币行情命令行工具
架设到Web前端是存在一定风险的，建议搭建在垃圾云服或者内网环境下
本章节主要介绍如何假设在云服务器上，内网虚拟机大同小异自行调整

## 上数据结构

| 容器目录 | 一级目录 | 二级目录 |
| :------: | :------: | :------: |
| / | cointop.key | - |
| / | cointop.crt | - |
| / | docker-compose.yml | - |
| / | cointop/  | - |
| / | npm/ | docker-compose.yml |
| / | npm/ | data/ |
| / | npm/ | letsencrypt/ |

## 开始搭建 (跳过证书环节)

### 建立容器文件并运行

``` bash
$ mkdir cointop/ && mkdir npm/
```
创建一个名为 docker-compose.yml 的新文件

```bash
$ # 将以下内容复制到该文件中
$ version: '3'

$ services:
$  cointop-web:
$    image: acaranta/cointop-web
$    ports:
$      - "7681:7681"
$    volumes:
$      - /etc/localtime:/etc/localtime:ro
$      - ./cointop:/root/.config/cointop
$    stdin_open: true
$    tty: true
```

然后运行以下命令启动Cointop Web

```bash
$ docker-compose up -d
```

此时如果没有报错，可以在Web浏览器中访问，只需在地址栏中输入 http://your-web.domain-name.com:7681
即可访问前端

### 搭建 NginxProxyManager 反向代理工具
进入npm容器目录

```bash
$ pwd # 确认当前处于 ~/docker_cointop 目录中
$ cd npm
```

创建一个名为 docker-compose.yml 的新文件

```bash
$ # 将以下内容复制到该文件中
$ version: '3'
$ services:
$  app:
$    image: 'jc21/nginx-proxy-manager:latest'
$    restart: unless-stopped
$    ports:
$      - '80:80' # Public HTTP Port
$      - '443:443' # Public HTTPS Port
$      - '81:81' # Admin Web Port
$    volumes:
$      - ./data:/data
$      - ./letsencrypt:/etc/letsencrypt
$ # 运行以下命令启动 NginxProxyManager
$ docker-compose up -d
```

此时可以在Web浏览器中访问 http://your-web.domain-name.com:81 
即可进入npm管理后台

#### 登录初始账号为: **admin@example.com**
#### 初始登录密码为: **changeme**
图形化的页面很方便进行操作
标准http协议只需要将 Cointop 的 7681 端口映射到本地 80 端口即可
加密https协议需要将之前申请好的证书文件上传至Web服务器并映射到本地 443 端口

### 有时候重启服务器后页面会出现404的情况，那是因为我们的工具在命令行中处于退出状态
我们只需要调用以下命令即可恢复

```bash
$ cd ~/docker_cointop && docker-compose up -d
```

以上便是本篇全部内容，感谢阅读