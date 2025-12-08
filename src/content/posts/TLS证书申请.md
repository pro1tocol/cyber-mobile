---
title: TLS证书申请
published: 2025-01-03
description: ""
tags: ["Linux", "操作"]
category: 记录
draft: false
---

## 本篇文章基于Github项目的ACME脚本

- 注意：我个人是不建议小白或新人使用脚本的，那会使你一直是小白

### 确实是流程过于繁琐

使用脚本的话才能实现三分钟搞定，建议不懂原理的童鞋，在搞定之后了解每步的详细操作流程
项目脚本源码可点击【 [github.com/acmesh-official/acme.sh](https://github.com/acmesh-official/acme.sh) 】 这条链接查看

### 脚本操作流程

安装部署

```bash
curl <https://get.acme.sh> | sh # 安装脚本
ln -s  /root/.acme.sh/acme.sh /usr/local/bin/acme.sh # 建立软连接以实现命令植入
```

### 根申请证书(需要提前做好域名解析到VPS地址，如何解析网上有许多教程)

### 自定义证书颁发机构，三选一

```bash
acme.sh --set-default-ca --server letsencrypt
acme.sh --set-default-ca --server buypass
acme.sh --set-default-ca --server zerossl

```

### 绑定你的邮箱

```bash
acme.sh --register-account -m your@Email.com # 替换你的邮箱
```

### 可以申请证书咯

```bash
acme.sh  --issue -d your-web.domain-name.com  --standalone -k ec-256 # 替换你的域名
```

### 导出你的证书

```bash
acme.sh --installcert -d your-web.domain-name.com --ecc --key-file /path/ca.key --fullchain-file /path/ca.crt # 替换你的域名，以及密钥和证书的路径与名称
# /path/ca.key是申请的网站密钥
# /path/ca.crt是申请的网站证书
```

### 好了，到此你的网站证书就申请完成，如何使用就不展开细说了

以上便是本篇文章的全部内容，感谢阅读