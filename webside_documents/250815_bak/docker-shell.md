---
title: Docker容器内部shell操作
abbrlink: 8318
date: 2024-06-08 10:23:23
---

## docker容器一般常用的两种运行方式
- docker run...
- docker-compose

### 其实处于运行态时其本质都是一样的
打个比方，假如有个docker-compose.yml文件内容如下

``` bash
$ version: "3"
$  services:
$    nginx:
$      image: nginx
$      ...
$    php:
$      build: php
$      restart: always
$      ...
$    mysql:
$      image: mysql:5.7
$      restart: always
$      ...
```

那么我们可以将其理解为docker容器中开启了三个小容器，分别是
- nginx
- php
- mysql

这么一来就更便于理解了，如需要分别进入各自容器内操作

``` bash
$ # 需要与docker-compose.yml同目录下，并且docker容器处于运行态，执行命令
$ docker exec -it nginx bash # 以bash shell环境进入nginx容器
$ docker exec -it php bash # 以bash shell环境进入php容器
$ docker exec -it mysql bash # 以bash shell环境进入mysql容器
```

更多细节延展操作需要具备扎实的功底，以上便是本章节全部内容，感谢阅读