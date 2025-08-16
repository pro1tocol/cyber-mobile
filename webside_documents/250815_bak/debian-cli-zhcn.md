---
title: Debian/Ubuntu系统Cli环境汉化
abbrlink: 9818
date: 2024-06-16 21:08:23
---
## 这篇文章主要针对的是远程连接(ssh/telnet)状态下的汉化
### 不是你直连显示器，或者在本地(noVNC)看到的样子，不要弄混了不然会乱码

另外在你用于建立连接的图形化终端首先得保证具备了utf-8编码的中文
当然，如果你是用XShell或者Finalshell这类的第三方工具，那可以不用看了

#### 部署中文字体

``` bash
$ sudo apt install vim xfonts-intl-chinese xfonts-wqy fonts-noto-cjk
$ # 修改&增加系统字体
$ sudo vim /etc/locale.gen
$ # 取消掉`#`的注释，确保以下字体被选中
$ en_US.UTF-8 UTF-8
$ zh_CN GB2312
$ zh_CN.GBK GBK
$ zh_CN.UTF-8 UTF-8
$ # 执行命令生效
$ sudo locale-gen
```
#### 配置系统默认的语言，这里注意必须是管态才能写入

``` bash
$ echo 'LANG=zh_CN.UTF-8'  > /etc/locale.conf
$ echo 'LANG=zh_CN.UTF-8'  > /etc/default/locale
```

#### 配置系统环境默认语言，这里同样是管态才能写入

``` bash
$ sudo vim /etc/environment
$ # 增加以下内容
$ LANG="zh_CN.GB2312" LC_ALL="zh_CN.GBK"
$ # 最后重启系统就可以生效了
$ reboot
```

### 这样汉化并不是全局汉化，只是SHELL部分优先中文显示，但也相对省事
也有些人会说并不用安装字体，也能生效
但如果后续要部署gnome或者KDE等这类图形化界面，安装字体会让你更舒服