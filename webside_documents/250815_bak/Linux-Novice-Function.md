---
title: Linux-新手-基建
abbrlink: 16198
date: 2023-05-12 14:33:23
---

# Linux-Novice-Function-1.3.5

此文章包含 Linux 中常用的国内镜像源
为初学者降低学习成本

| 系统 | 目录 | 架构 | 链接 |
| :------: | :------: | :------: | :------: |
| Archcraft | [Page](#Archcraft) | Archlinux | [Go](https://cyber-mobile.net/s/Linux-Command.html#) |
| Manjaro | [Page](#Manjaro) | Archlinux | [Go](https://cyber-mobile.net/s/Linux-Command.html#) |
| Blackarch | [Page](#Blackarch) | Archlinux | [Go](https://cyber-mobile.net/s/Linux-Command.html#) |
| Ubuntu22.04 | [Page](#Ubuntu22-04) | Debian | [Go](https://cyber-mobile.net/s/Linux-Command.html#) |
| Ubuntu24.04 | [Page](#Ubuntu24-04) | Debian | [Go](https://cyber-mobile.net/s/Linux-Command.html#) |
| Kali-linux | [Page](#Kali-Linux) | Debian | [Go](https://cyber-mobile.net/s/Linux-Command.html#) |
| Debian11 | [Page](#Debian11) | Linux | [Go](https://cyber-mobile.net/s/Linux-Command.html#) |
| Debian12 | [Page](#Debian12) | Linux | [Go](https://cyber-mobile.net/s/Linux-Command.html#) |
| CentOS7 | [Page](#CentOS7) | RHEL | [Go](https://cyber-mobile.net/s/Linux-Command.html#) |
| Archlinux | [Page](#Archlinux) | Archlinux | [Go](https://cyber-mobile.net/s/Archlinux-Detail.html#) |
| Armbian | [Page](#Armbian) | Ubuntu | [Go](https://cyber-mobile.net/s/Armbian-Detail.html#) |

## 基础文本工具
更改源镜像可使用 vi/vim 工具

``` bash
    vim [file name] = open a file
     i  = edit file
    Esc = toggle
    :q! = force quit, the file will be lost if not saved
    :w! = force save
    :wq = save and exit
    :q  = exit
```

## 为各系统升级镜像源
---

> ### Archcraft

[Archcraft-细节文章](https://cyber-mobile.net/s/Linux-Command.html#)

#### 一键切换国内源命令

``` bash
    reflector --verbose -c China --latest 12 --sort rate --threads 100 --save /etc/pacman.d/mirrorlist
```

#### 安装中文字体

``` bash
    pacman -S adobe-source-han-sans-cn-fonts
```

#### 调整镜像源为中科大源

``` bash
    /etc/pacman.conf
    [archlinux]
    Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
    
    # [chaotic-aur]
    # Include = /etc/pacman.d/chaotic-mirrorlist
```

备注: “chaotic-aur”源存在速度和版权问题，建议取消

---


> ### Manjaro

[Manjaro-细节文章](https://cyber-mobile.net/s/Linux-Command.html#)

一键切换国内源命令

``` bash
    pacman-mirrors -i -c China -m rank
```

#### 调整镜像源为中科大源

``` bash
    /etc/pacman.conf
    [archlinux]
    Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
```

---

> ### Blackarch

[Blackarch-细节文章](https://cyber-mobile.net/s/Linux-Command.html#)

#### 调整镜像源为中科大源

``` bash
    /etc/pacman.conf
    SigLevel = Never
    [archlinux]
    Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
```

更改中国大陆更新源也需要更改这两个部分:

``` bash
    /etc/pacman.d/mirrorlist
    /etc/pacman.d/blackarch-mirrorlist
```

---

> ### Ubuntu22.04

[Ubuntu22.04-细节文章](https://cyber-mobile.net/s/Linux-Command.html#)

#### 镜像源文件目录

``` bash
    /etc/apt/sources.list
```

#### 调整镜像源为中科大源

``` bash
    deb https://mirrors.ustc.edu.cn/ubuntu/ jammy main restricted universe multiverse
    # deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy main restricted universe multiverse
    deb https://mirrors.ustc.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
    # deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
    deb https://mirrors.ustc.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
    # deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
    deb https://mirrors.ustc.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
    # deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
```

---


> ### Ubuntu24.04

[Ubuntu24.04-细节文章](https://cyber-mobile.net/s/Linux-Command.html#)

#### 镜像源文件目录

``` bash
    /etc/apt/sources.list
```

#### 调整镜像源为中科大源

``` bash
    deb https://mirrors.ustc.edu.cn/ubuntu/ noble main restricted universe multiverse
    # deb-src https://mirrors.ustc.edu.cn/ubuntu/ noble main restricted universe multiverse
    deb https://mirrors.ustc.edu.cn/ubuntu/ noble-security main restricted universe multiverse
    # deb-src https://mirrors.ustc.edu.cn/ubuntu/ noble-security main restricted universe multiverse
    deb https://mirrors.ustc.edu.cn/ubuntu/ noble-updates main restricted universe multiverse
    # deb-src https://mirrors.ustc.edu.cn/ubuntu/ noble-updates main restricted universe multiverse
    deb https://mirrors.ustc.edu.cn/ubuntu/ noble-backports main restricted universe multiverse
    # deb-src https://mirrors.ustc.edu.cn/ubuntu/ noble-backports main restricted universe multiverse
```

---


> ### Kali-Linux

[Kali-细节文章](https://cyber-mobile.net/s/Linux-Command.html#)

#### 镜像源文件目录

``` bash
    /etc/apt/sources.list
```

#### 调整镜像源为中科大源

``` bash
    deb https://mirrors.ustc.edu.cn/kali kali-rolling main non-free non-free-firmware contrib
    deb-src https://mirrors.ustc.edu.cn/kali kali-rolling main non-free non-free-firmware contrib
```

Debian内核部分也进行同步调整

``` bash
    deb http://mirrors.ustc.edu.cn/debian/ buster main contrib non-free
    deb http://mirrors.ustc.edu.cn/debian/ buster-updates main contrib non-free
    deb http://mirrors.ustc.edu.cn/debian/ buster-backports main contrib non-free
    deb http://mirrors.ustc.edu.cn/debian-security buster/updates main contrib non-free
```

---

> ### Debian11

[Debian 11-细节文章](https://cyber-mobile.net/s/Linux-Command.html#)

#### 镜像源文件目录

``` bash
    /etc/apt/sources.list
```

#### 调整镜像源为中科大源

``` bash
    deb http://mirrors.ustc.edu.cn/debian bullseye main contrib non-free
    # deb-src http://mirrors.ustc.edu.cn/debian bullseye main contrib non-free
    deb http://mirrors.ustc.edu.cn/debian bullseye-updates main contrib non-free
    # deb-src http://mirrors.ustc.edu.cn/debian bullseye-updates main contrib non-free
    deb http://mirrors.ustc.edu.cn/debian bullseye-backports main contrib non-free
    # deb-src http://mirrors.ustc.edu.cn/debian bullseye-backports main contrib non-free
    deb http://mirrors.ustc.edu.cn/debian-security/ bullseye-security main contrib non-free
    # deb-src http://mirrors.ustc.edu.cn/debian-security/ bullseye-security main contrib non-free
```

---

> ### Debian12

[Debian 12-细节文章](https://cyber-mobile.net/s/Linux-Command.html#)

#### 镜像源文件目录

``` bash
    /etc/apt/sources.list
```

#### 调整镜像源为中科大源

``` bash
    deb http://mirrors.ustc.edu.cn/debian bookworm main contrib non-free non-free-firmware
    # deb-src http://mirrors.ustc.edu.cn/debian bookworm main contrib non-free non-free-firmware
    deb http://mirrors.ustc.edu.cn/debian bookworm-updates main contrib non-free non-free-firmware
    # deb-src http://mirrors.ustc.edu.cn/debian bookworm-updates main contrib non-free non-free-firmware
    deb http://mirrors.ustc.edu.cn/debian bookworm-backports main contrib non-free non-free-firmware
    # deb-src http://mirrors.ustc.edu.cn/debian bookworm-backports main contrib non-free non-free-firmware
    deb http://mirrors.ustc.edu.cn/debian-security/ bookworm-security main contrib non-free non-free-firmware
    # deb-src http://mirrors.ustc.edu.cn/debian-security/ bookworm-security main contrib non-free non-free-firmware
```

---

> ### CentOS7

[CentOS 7-细节文章](https://cyber-mobile.net/s/Linux-Command.html#)

#### 调整镜像源为中科大源（注意：CentOS 7 已于 2024 年 6 月 30 日结束维护，目前使用的是CentOS Vault 镜像）

``` bash
    sudo sed -i.bak \
      -e 's|^mirrorlist=|#mirrorlist=|g' \
      -e 's|^#baseurl=http://mirror.centos.org/centos|baseurl=https://mirrors.ustc.edu.cn/centos-vault/centos|g' \
      /etc/yum.repos.d/CentOS-Base.repo
```

更新库

``` bash
    yum makecache
```

---

> ### Archlinux

[Archlinux-细节文章](https://cyber-mobile.net/s/Archlinux-Detail.html#)

#### 调整镜像源为中科大源

镜像源目录

``` bash
    /etc/pacman.d/mirrorlist
```

如果是x86_64架构，调整：

``` bash
    Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
```

如果是arm64架构，调整：

``` bash
    Server = https://mirrors.ustc.edu.cn/archlinuxarm/$arch/$repo
```

#### 调整archlinuxcn第三方镜像源：

``` bash
    /etc/pacman.conf
    [archlinuxcn]
    Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
```

更新库

``` bash
    pacman -Syyu
```

---

> ### Armbian

[Armbian-细节文章](https://cyber-mobile.net/s/Armbian-Detail.html#)

#### 镜像源文件目录

``` bash
    /etc/apt/sources.list
```

#### 调整镜像源为清华源

``` bash
    deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy main restricted universe multiverse
    # deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy main restricted universe multiverse
    deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-updates main restricted universe multiverse
    # deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-updates main restricted universe multiverse
    deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-backports main restricted universe multiverse
    # deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-backports main restricted universe multiverse
    deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-security main restricted universe multiverse
    # deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-security main restricted universe multiverse
```

增加WIFI卡驱动镜像源

``` bash
    deb http://httpredir.debian.org/debian/ buster main contrib non-free
```

---
