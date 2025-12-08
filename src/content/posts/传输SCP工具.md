---
title: 传输SCP工具
published: 2024-06-19
description: ""
tags: ["Windows", "操作"]
category: 工具
draft: false
---

Telnet和SSH都是用于远程连接的工具，但它们之间存在很大的差别
国内的大多数基础教材还在教授使用telnet工具
但telnet工具的传输过程是明文的，存在一定的安全性问题

## 因此SSH工具更加安全、功能更强大、速度更快，更加适合在安全性要求较高的环境中使用

- 远程主机服务端相关配置

```bash
#安装`openssh-server`工具包
sudo apt-get update && sudo apt-get install openssh-server # Ubuntu/Debian
sudo yum update && sudo yum install openssh-server # CentOS/RHEL
sudo dnf update && sudo dnf install openssh-server # Cenos8/Fedora
# 服务端启动相关服务并设置开机自启动
sudo systemctl start --enable sshd # Ubuntu/Debian/CentOS/RHEL/Cenos8/Fedora
```

一般到这一步已经可以进行连接了，个人习惯开启`root`用户登录模式(可选)

```bash
# 需要修改服务端配置文件
nano /etc/ssh/sshd_config
# 将以下内容取消注释或修改内容
Port 22    # 默认连接端口为22，可以修改为自定义未占用端口
ListenAddress 0.0.0.0 # 访问地址为任意地址
ListenAddress ::
PermitRootLogin yes # 允许root登录
PubkeyAuthentication yes
PasswordAuthentication yes
# 完成后需要重启服务才会生效
```

- 本地主机客户端相关运用
在服务端安装完成部署后，就可以使用ssh命令进行连接了，注意服务端一定要开放指定端口的防火墙规则

```bash
ssh username@remote_host        # username为访问用户名，remote_host为远程主机IP地址
ssh -p 55 username@remote_host  # "-p 55"为访问指定55端口的sshd远程服务端
# 远程连接就完成了，就是这么简单，别忘了输入密码，密码的输入是不会提示内容的，习惯就好
```

- 文件传输SCP工具相关运用
该工具的使用是建立在SSH工具的基础之上的，所以在使用之前需要明确服务端已正常开启服务并且通信无阻(防火墙啊)

```bash
scp 'C:\\Users\\fukputin\\Downloads\\156.zip' username@remote_host:/usr/bin
# 意思是将本地文件名为156.zip的文件(绝对地址)发送到远程主机/usr/bin的目录下
scp username@remote_host:/usr/bin/156.zip C:\\Users\\fukputin\\Downloads\\
# 意思是将远程主机名为156.zip的文件取回到本地下载文件夹，可以以实际情况进行修改
```

那么如果是指定端口通信加上传输文件夹呢？其实很简单加上 `-p` 和 `-r` 即可

```bash
scp -p 55 -r 'C:\\Users\\fukputin\\Downloads\\' username@remote_host:/usr/bin
# 意思是将整个本地下载文件夹发送到远程主机/usr/bin的目录下
scp -p 55 -r username@remote_host:/usr/bin/fukputin 'C:\\Users\\fukputin\\Downloads'
# 意思是将远程主机整个fukputin文件夹取回到本地下载的目录下
```

以上就是本章节的所有内容