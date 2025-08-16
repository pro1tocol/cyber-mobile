---
title: 生成256P1加密自签证书
abbrlink: 16111
date: 2025-01-02 06:48:23
---
## 生成自签证书需要openssl工具支持
没有安装的可以自行安装

- 废话不多直接上命令

``` bash
$ openssl ecparam -genkey -name prime256v1 -out ca.key
$ # 在当前目录下生成一枚ca.key的密钥
```

### 根据密钥生成自签证书

``` bash
$ openssl req -new -x509 -days 36500 -key ca.key -out ca.crt -subj "/CN=xxx.net"
$ # 证书的颁布机构及使用者为xxx.net，有效期限为36500天，证书为当前目录的ca.crt文件
```

#### 可根据自身实际情况调整命令内容
以上为本章节全部内容，感谢阅读