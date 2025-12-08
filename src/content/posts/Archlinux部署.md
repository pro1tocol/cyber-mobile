---
title: Archlinux部署
published: 2023-04-06
description: ""
tags: ["Archlinux", "操作"]
category: 记录
draft: false
---

> 本文主要介绍Archlinux系统的安装和部署
> 

---

### 制作基础系统引导U盘

### `1`.闪存U盘 ( 不低于4G可用空间 )

### `2`.下载IOS系统镜像文件 ( [Download-Page](https://archlinux.org/download/) )

### `3`.将系统文件刷写入U盘 ( [balenaEtcher](https://www.balena.io/etcher/) )

### `4`.物理机U盘引导基础系统

---

## 物理机U盘启动

> 注意:
> 
- 开始前请检查磁盘上有足够的可用空间
- BIOS设置UEFI启动模式
- 启动烧录的驱动程序镜像，进入 `root`

变更镜像源地址

```bash
echo 'Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch' > /etc/pacman.d/mirrorlist
```

确认系统的UEFI引导环境

```bash
ls /sys/firmware/efi/efivars
# 检查反馈信息确认系统引导方式
```

检查已安装的网卡

```bash
lspci -k | grep Network
```

### 使用无线网卡连接网络

```bash
systemctl status iwd
systemctl start iwd

iwctl
device list
station wlan0 scan
station wlan0 get-networks
station wlan0 connect wifi-name
exit
```

设置时间

```bash
timedatectl set-ntp true
timedatectl status
# 或者使用date命令手动修改日期时间
date -s "YYYY-MM-DD HH:MM:SS"
# YYYY-MM-DD 年月日
# HH:MM:SS 时分秒
```

查看物理磁盘及运行内存状态

```bash
lsblk
fdisk -l
df -h
free -h
```

> 硬盘分区请在站内搜索相关文章：**Linux LVM分区挂载** 或者 **Linux物理分区挂载**
> 

### 安装及升级keyring

```bash
    pacman -S archlinux-keyring && sudo pacman -Syy
```

### 系统部署

```bash
# 默认安装zen内核，普通内核可以将linux-zen更换为linux
pacstrap /mnt base base-devel bash-completion linux-zen linux-zen-headers linux-firmware dhcpcd iwd vim nano sudo net-tools lvm2 grub efibootmgr curl wget git gzip unzip zip tar openssh neofetch iftop bashtop
# 根据CPU架构选择对应的微码安装
pacstrap /mnt intel-ucode/amd-ucode

```

将分区UUID写入配置

```bash
genfstab -U /mnt > /mnt/etc/fstab
cat /mnt/etc/fstab
```

---

## 进入系统进行配置

### 执行命令

```bash
arch-chroot /mnt
```

### 配置主机名及hosts值

```bash
vim /etc/hostname
vim /etc/hosts
127.0.0.1   localhost
::1         localhost
127.0.1.1   xxx.localdomain	xxx
```

### 将时区写入硬件

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
hwclock --systohc
```

### 配置语言

```bash
pacman -S locales # 如果工具不存在则进行安装
dpkg-reconfigure locales
# 激活中文
vim /etc/locale.gen
en_US.UTF-8 UTF-8
zh_CN.UTF-8 UTF-8
# 将默认语言写入配置
locale-gen
echo 'LANG=en_US.UTF-8'  > /etc/locale.conf
```

### 配置超级用户密码

```bash
passwd root
```

---

## UEFI引导部署

### 注意你的硬盘分区模式

如果是 `LVM` 分区模式需要激活相应的内核模组

```bash
lvm2 # 如果没有安装请手动安装
vim /etc/mkinitcpio.conf
HOOKS=(base **systemd** ... block **sd-lvm2** filesystems)
mkinitcpio -p linux

```

### 安装引导工具

```bash
pacman -S grub efibootmgr [os-prober]
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=ARCH
# 修改引导日志级别
vim /etc/default/grub
="loglevel=5 nowatchdog"
# 生成引导配置文件
grub-mkconfig -o /boot/grub/grub.cfg
```

安装完成后退出及物理机重启、拔掉引导U盘

```bash
exit
umount -R /mnt
reboot # 重启设备
```

---

## 构建桌面环境

检查网络状态，启用相关服务

```bash
systemctl enable --now dhcpcd
systemctl start iwd
```

如果是无线不记得了，可以看[这里](Archlinux%E9%83%A8%E7%BD%B2%2022db526f61fd80d08d12eb308e63bc35.md)

启用开放的 32 位支持库和 Archlinux 中文社区仓库

```bash
vim /etc/pacman.conf
[multilib]
Inclu...
[archlinuxcn]
Server = <https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch>
```

同步更新keyring

```bash
pacman-key --init
pacman-key --populate archlinux
pacman -Syy && pacman -Syu
pacman -S archlinux-keyring archlinuxcn-keyring
pacman -S yay
```

安装中文字体

```bash
pacman -S noto-fonts noto-fonts-cjk adobe-source-han-serif-cn-fonts wqy-zenhei noto-fonts-emoji noto-fonts-extra
```

配置默认编辑器

```bash
vim ~/.bash_profile
export EDITOR='vim'
```

普通用户及按需配置权限（桌面环境默认不支持root）

```bash
useradd -m -G wheel -s /bin/bash alarm
passwd alarm
# 修改权限
EDITOR=vim visudo
%wheel ALL=(ALL: ALL) ALL
```

### 桌面图形化解决方案

> 方案1 KDE Plasma 桌面环境部署
> 

```bash
pacman -S plasma-meta konsole dolphin yakuake
pacman -S qt5-virtualkeyboard onboard kded-rotation-git
systemctl enable sddm
systemctl start sddm
# 配置键盘
vim /etc/sddm.conf.d/virtualkbd.conf
[General]
InputMethod=qtvirtualkeyboard
# 重启系统生效
reboot
```

环境详细设置

```bash
sudo systemctl disable iwd
sudo systemctl stop iwd
sudo systemctl enable --now NetworkManager
# 安装字体
sudo pacman -S ntfs-3g
sudo pacman -S ark packagekit-qt5 packagekit appstream-qt appstream gwenview mpv
sudo pacman -S fcitx5-im fcitx5-chinese-addons
# 配置输入法
sudo vim /etc/environment
INPUT_METHOD=fcitx5
GTK_IM_MODULE=fcitx5
QT_IM_MODULE=fcitx5
XMODIFIERS=\\@im=fcitx5
SDL_IM_MODULE=fcitx
# 安装yay包管理工具
sudo pacman -S archlinuxcn-keyring
sudo pacman -S yay
# 为普通用户配置默认文本编辑器
sudo vim ~/.bashrc
export EDITOR='vim'
# 启用蓝牙设备
sudo systemctl enable --now bluetooth
```

> 方案2 Gnome桌面环境部署
> 

```bash
# 安装环境组件
pacman -S networkmanager modemmanager bluez bluez-utils pulseaudio-bluetooth
pacman -S git wget ntfs-3g usbutils
systemctl enable NetworkManager bluetooth
systemctl enable ModemManager
# 安装字体
pacman -S ibus ibus-pinyin mpv
echo 'LANG=zh_CN.UTF-8'  > /etc/locale.conf
# 安装桌面及登陆器
pacman -S gnome
systemctl enable gdm
# 重启系统生效
reboot
```