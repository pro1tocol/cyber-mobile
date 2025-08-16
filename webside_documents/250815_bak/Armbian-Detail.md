---
title: Armbian-细节文章
abbrlink: 16201
date: 2023-04-07 09:52:47
---

# 本文主要介绍Armian系统的安装和部署

---

#### 系统的安装没有图形化界面，安装过程高度定制化，可以根据您的喜好进行安排

系统详细信息[查看](https://github.com/ophub/amlogic-s9xxx-armbian)

---

### 将系统使用 Etcher 写入U盘启动后执行：

``` bash
    armbian-install     # 安装脚本
    304                 # 根据硬件选择适合自己的内核
    1                   # 确认安装
```

### 重启设备拔掉U盘进入系统

主机名及搜索域设置

``` bash
    # 设置主机名
    vim /etc/hostname
    # 设置搜索域
    vim /etc/hosts
    127.0.0.1   localhost
    127.0.1.1   xxx.localdomain	xxx
    ::1         localhost xxx ip6-localhost ip6-loopback
    fe00::0     ip6-localnet
    ff00::0     ip6-mcastprefix
    ff02::1     ip6-allnodes
    ff02::2     ip6-allrouters
```

静态地址设置

``` bash
    vim /etc/network/interfaces
    address 192.168.1.14
    netmask 255.255.255.0
    gateway 192.168.1.1
            hwaddress ether 8E:66:EB:AC:3D:EE
```

如果 ` sudo ` 出现报错

``` bash
    pkexec chown root:root /etc/sudo.conf -R
    mandb -csp
```