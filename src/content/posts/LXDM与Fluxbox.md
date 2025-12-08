---
title: LXDM与Fluxbox
published: 2024-01-13
description: ""
tags: ["Archlinux", "操作"]
category: 工具
draft: false
---

### 由于网络上这类的资料文档比较少，本篇文章仅做汇总

## 为什么使用这类冷门图形环境？

### 为了应用性能最大化

---

### LXDM登陆器作为用户访问控制，Fluxbox负责窗口桌面环境，这两个轻量级工具均是基于X11桌面环境，相较于Wayland没那么新，但稳定姓更好

### 工作目录汇总

### LXDM登陆器

```bash
ls /usr/bin/lxdm # 工具路径
ls /usr/lib/lxdm # 组件及环境变量路径
cat /etc/lxdm/lxdm.conf # 登陆器配置文件路径
ls /usr/share/lxdm/themes/ # 工具主题路径
```

### Fluxbox窗口桌面

```bash
ls /usr/bin/fluxbox # 工具路径
ls /usr/share/fluxbox # 菜单及配置信息路径
ls /usr/share/fluxbox/styles/ # 工具对应系统主题路径
ls /home/$USER/.fluxbox/ # 工具对应用户配置信息路径
```

### LXDM登陆器自定义配置

### 编辑配置文件

```bash
vim /etc/lxdm/lxdm.conf
[display]
gtk_theme=Adwaita # 选择gtk主题
bottom_pane=1 # 是否显示桌面环境选择按钮
lang=0 # 是否显示语言选择按钮
keyboard=0 # 是否显示键盘方案选择按钮
theme=BlackArch # 选择工具主题，壁纸已在主题中进行配置
[input]
[userlist]
disable=1 # 是否关闭用户选择列表(建议关闭)
white= # 用户白名单
black= # 用户黑名单
```

### 关于登陆器用户的访问控制权限设定

```bash
vim /etc/pam.d/lxdm # 编辑登陆用户的相关权限
#%PAM-1.0
#auth        include     system-login   允许所有用户通过lxdm登陆桌面环境
auth        required    pam_succeed_if.so user != root quiet # 不允许超级用户通过lxdm登陆桌面环境
# 禁用特定用户访问也使用相同方法，配置时注意互斥关系
```

### Fluxbox窗口桌面配置壁纸

### 配置壁纸使用fbsetbg工具，该工具需要feh或者其他依赖工具才会生效

```bash
fbsetbg /home/$USER/.fluxbox/backgrounds/wallpaper.jpg
# 该命令会将路径下的wallpaper.jpg平铺作为当前壁纸
cat /home/$USER/.fluxbox/lastwallpaper
# $full $full|/home/$USER/.fluxbox/backgrounds/wallpaper.jpg||:0
# 如果反馈的信息如此，则配置生肖，当然也可以手动写入刷新桌面也生效
```

### Fluxbox应用菜单自定义配置

```bash
[begin] (菜单起始)
[exec] (终端) {xterm}
[submenu] (文件夹)
      [exec] (应用) {} # {}为应用路径或启动命令
[end] # 文件夹结束
[endencoding] # 分割线
[exit] (注销)
[end] # 菜单结束
```

### Fluxbox调用终端界面执行状态

```bash
[exec] (执行结束保留终端窗口) {xterm -e sh -c 'uname -a ; bash'}
[exec] (执行结束关闭终端窗口) {xterm -e sh -c 'uname -a'}
[exec] (系统调用终端执行) {xterm -e sudo sh -c 'uname -a'}
[exec] (远程工具调用) {putty}
# 以上是部分应用的启动及相关调用方法逻辑
```

### Xterm工具窗口大小的配置

```bash
vim /home/$USER/.Xresources
# 编辑配置文件信息，可调整中文字体、英文字体、字体大小、窗口大小等信息
XTerm*faceNameDoublesize: Microsoft YaHei UI
XTerm*faceName: DejaVu Sans Mono
xterm*faceSize: 14
xterm*vt100*geometry: 115x32
xterm*saveLines: 16384
xterm*termName: xterm-color
xterm*eightBitInput: false
xterm*background: black
xterm*foreground: #EAEAEF
# 保存退出后，执行以下命令生效：
xrdb -merge .Xresources
```

### Linux环境下手动部署字体

```bash
ls -l /usr/share/fonts # 该目录下已包含系统所有字体
fc-list # 查看系统已加载的所有字体
```

### 其他配置

### 有些笔记本电脑对Fluxbox桌面环境下休眠的适配不好，盒盖或休眠状态无法唤醒的

### 可以尝试将休眠和熄屏禁用

```bash
# 配置休眠禁用
vim /etc/systemd/logind.conf
[Login]
HandleLidSwitch=lock # 锁定休眠功能
# 配置熄屏禁用
vim /usr/share/X11/xorg.conf.d/10-monitor.conf # 没有该文件进行创建
Section "ServerLayout"
    Identifier "ServerLayout0"
    Option "BlankTime" "0"
    Option "StandbyTime" "0"
    Option "SuspendTime" "0"
    Option "OffTime" "0"
EndSection
# 重启后生效
reboot
```

---

### 其实还有关于屏幕旋转、触摸等等相关配置

### 屏幕旋转建议使用plasma-open-settings的kscreen组件进行配置

### 如果使用完全修改配置文件的形式修改屏幕旋转会比较麻烦，同样是修改xorg.conf.d文件里的配置信息

### 方法请自行研究，就不再过多赘述

以上为本章节全部内容，感谢阅读