---
title: 云原生部署redis服务
abbrlink: 16142
date: 2025-04-20 19:23:00
---

## 本文主要讲解云原生部署redis中间件的详细步骤

### 部署环境

| 类型 | 操作系统 | 内核版本 |
| --- | --- | --- |
| 云原生 | Redhat7.9 | Linux-3.10.0 |

### 源码编译部署

### 下载redis版本5.0.14

```bash
wget http://download.redis.io/releases/redis-5.0.14.tar.gz
# 验证目录下redis-5.0.14.tar.gz文件
tar -xzvf redis-5.0.14.tar.gz # 文件解压缩
ls redis-5.0.14/ # 验证工程目录
```

### 验证gcc/g++/tcl编译环境

```bash
gcc -v # 至少为4.8.5版本
g++ -v # 至少为4.8.5版本
tclsh # 进入tcl环境
    info patchlevel # 至少为8.5.13版本
```

### 进入工程目录编译安装

```bash
cd redis-5.0.14/ && pwd # 打印内容处于工程目录中
make test # 进行测试编译
make install # 如无报错则进行安装并配置环境变量
ls /usr/local/bin/redis* # 验证工具
# ls /usr/local/bin/redis*
# /usr/local/bin/redis-benchmark  /usr/local/bin/redis-check-rdb  /usr/local/bin/redis-sentinel
# /usr/local/bin/redis-check-aof  /usr/local/bin/redis-cli        /usr/local/bin/redis-server
# 此时已完成安装，建议增加服务软连接
ln -sf /usr/local/bin/redis-server /usr/bin/redis
redis -v # 验证安装
```

### 以上为本篇文章的全部内容

### 感谢阅读