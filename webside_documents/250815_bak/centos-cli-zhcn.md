---
title: Centos8系统Cli环境汉化
abbrlink: 39446
date: 2024-06-17 17:48:23
---
## 在Centos8环境下做汉化
### 这系统的渊源我就不过多赘述了

一般没有特殊要求也不常用，其他版本能否匹配请自行测试哈

话说8以下的版本没有 `dnf` 命令

#### 话不多说，喵的来搞一下
先换个源，直接换国内清华源(这一步可选)

``` bash
$    sudo sed -e 's|^mirrorlist=|#mirrorlist=|g' \
$        -e 's|^#baseurl=http://mirror.centos.org/$contentdir|baseurl=https://mirrors.ustc.edu.cn/centos|g' \
$        -i.bak \
$        /etc/yum.repos.d/CentOS-Stream-AppStream.repo \
$        /etc/yum.repos.d/CentOS-Stream-BaseOS.repo \
$        /etc/yum.repos.d/CentOS-Stream-Extras.repo \
$        /etc/yum.repos.d/CentOS-Stream-PowerTools.repo
```

#### 清除缓存源记录

``` bash
$ sudo dnf clean all
$ # 改用"毒奶粉"命令更新源记录
$ sudo dnf makecache
$ # 例行公事安装语言包
$ sudo dnf install glibc-langpack-zh.x86_64
$ sudo yum -y install langpacks-zh_CN
```

#### 然后你需要查看本地语言包里有没有中文字样 `zh_CN`

``` bash
$ locale -a
$ # 编辑系统默认的语言
$ sudo vim /etc/locale.conf
$ LANG=zh_CN.utf8
$ # 执行以下命令，使配置生效，一般到这一步已经可以显示中文了
$ . /etc/locale.conf
$ # 确认系统默认语言变更，可以用下面的命令
$ locale
$ # 打印出来如果是你刚刚设置好的，基本搞定了
```

### 以上便是本篇全部内容
感谢阅读