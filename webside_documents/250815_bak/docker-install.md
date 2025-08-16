---
title: Docker安装
abbrlink: 31282
date: 2024-06-11 23:33:23
---
环境恶劣啊，安装docker都要写文档了..
## 太难受


借鉴 @user-libkpumrvm6 的临时方案，方案出处： [点击](https://bbs.fit2cloud.com/t/topic/5891/2)

## 开始部署

### 构建依赖

``` bash
$ sudo apt update && sudo apt install ca-certificates curl gnupg lsb-release -y
```

### 脚本安装

```bash
$ curl https://install.1panel.live/docker-install -o docker-install && sudo bash ./docker-install && rm -f ./docker-install
```

然后静静等待，未来再说
以上便是本篇全部内容，感谢阅读