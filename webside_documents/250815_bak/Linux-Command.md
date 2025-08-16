---
title: Linux系统常用命令
abbrlink: 16200
date: 2023-04-14 22:05:23
---

# 本文主要介绍linux系统的日常操作命令

| 类型 | 细化方向 |
| :------: | :------: |
| 基础命令 | [文件及指令操作](#文件及指令操作) |
| 系统运维 | [用户及系统操作](#用户及系统操作) |
| 驱动管理 | [组建及模块操作](#组建及模块操作) |
| 输入输出 | [输入法接口操作](#输入法接口操作) |
| 工具管理 | [工具应用及操作](#工具应用及操作) |
| 显示设置 | [显示器接口操作](#显示器接口操作) |
| 登录环境 | [图形化访问操作](#图形化访问操作) |

---

## 基础命令
### 文件及指令操作

#### 目录操作

``` bash
    ls -l       # 打印文件详细信息
    ls -a       # 打印所有文件包括隐藏文件
    ls -lh      # 以人类语言展示文件详细信息
    —sort=size  # 展示文件大小
    —sort=time  # 展示文件创建或修改时间
    pwd         # 展示当前路径
```

#### `cd` 操作

``` bash
    cd /path    # 进入目录
    cd .        # 进入当前目录
    cd ..       # 进入上一层目录
```

#### `阅读` 操作

``` bash
    cat /etc/resolv.conf                 # 展示文件详细内容
    more /etc/resolv.conf                # 分段展示文件内容
    less /etc/resolv.conf                # 可控状态展示文件内容
    tail -20 /etc/resolv.conf            # 展示文件最后20行
    watch -n 2 tail -20 /etc/resolv.conf # 每2秒展示文件最后20行有没有更新
```

#### `删除` 操作

``` bash
    rm -r /path/         # 删除文件夹
    rm /etc/resolv.conf  # 删除文件
```

#### `复制及拷贝` 操作

``` bash
    cp -r /path/ /etc/path/                    # 复制文件夹
    cp /etc/resolv.conf /etc/path/resolv.conf  # 复制文件
```

#### `筛选` 操作

``` bash
    ls | grep bash       # 筛选出文件名含bash的文件
    lspci | grep nvidia  # 筛选出PCI设备中含nvidia字样的设备
```

#### `重命名` 操作

``` bash
    mv ./nano.md ./vim.md       # 将当前目录下名为nano的文件重命名为vim文件
```

#### `挂载` 操作

``` bash
    mount /path/ /mnt/path/     # 挂载目录至/mnt下
    umount /mnt                 # 取消目录/mnt下的挂载
```

#### `查找` 操作

``` bash
    find resolv.conf             # 由当前目录开始依次查找
    whereis resolv               # 全局查找文件名路径
    which resolv                 # 全局查找应用路径
```
#### `变量植入` 操作

``` bash
    echo "text"                 # 打印双引号中的文本信息
    echo "text" > resolv.conf   # 将双引号内的文本信息加入到本地目录下的resolv.conf文件中覆盖其他内容
    echo "text" >> resolv.conf  # 将双引号内的文本信息加入到本地目录下的resolv.conf文件中但不覆盖其他内容
    echo $SHELL                 # 打印变量SHELL的环境
    echo $HOME                  # 打印变量HOME的环境
```

---

## 系统运维
### 用户及系统操作

#### `与或非` 管道符

``` bash
    command | command    # 将左边的命令执行结果作为右边命令的输入，然后执行右边的命令
    command || command   # 左边的命令执行为0，则执行右边的命令
    command && command   # 左边的命令执行为1，再执行右边的命令
```

#### ` 时区 ` 设置

``` bash
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime  # 切换时区至上海
```

#### 用户操作

``` bash
    useradd -m username      # 创建用户
    userdel -r username      # 删除用户
    passwd username          # 修改用户密码
    su username              # 切换用户
    sudo su                  # 进入超级用户
    sudo -i                  # 选择设备本身
```
#### `用户对文件的权限` 操作

``` bash
    chmod +x ./file         # 赋予文件所有角色最高权限
    chmod -x ./file         # 移除文件所有角色最高权限
    chown user:user ./file  # 修改文件所有权为指定角色
```

#### `top` 进程操作

``` bash
    top
      k:  number            # 斩杀指定PID的进程
      kill  number          # 斩杀指定PID的进程
      ps -ef                # 显示进程详情
      ps aux                # 显示进程用量及其他信息
```

#### `网络设备` 操作

``` bash
    ifconfig                      # 显示物理网卡信息
    ifconfig NIC down             # 停止指定物理网卡工作
    ifconfig NIC up               # 使指定物理网卡开始工作
    macchanger -m MAC_address NIC # 在 NIC 关闭时暂时修改 NIC 地址
    iwconfig                      # 显示无线网卡信息
    ping 223.5.5.5                # 帧听通信
    traceroute 223.5.5.5          # 路由追踪
    netstat -ano                  # 查看系统所有开放端口
    netstat -nltp                 # 查看系统所有开放TCP端口
    netstat -nlutp                # 查看系统所有开放TCP及UDP端口
```

#### 使用 `pacman` 作为包管理器

``` bash
    pacman -Syy                 # 升级镜像源清单
    pacman -Syu                 # 升级镜像源包
    pacman -Ss                  # 从镜像源中搜索工具
    pacman -S                   # 从镜像源中安装工具
    pacman -R                   # 卸载工具
    pacman -Rs                  # 卸载工具及依赖
    pacman -Rs $(pacman -Qdtq)  # 执行自动清理
    pacman -Scc                 # 清楚镜像源缓存
```

#### 使用 `yay` 作为包管理器

``` bash
    yay -Syy              # 升级镜像源清单
    yay -Syu              # 升级镜像源包
    yay -Ss               # 从镜像源中搜索工具
    yay -S                # 从镜像源中安装工具
    yay -R                # 卸载工具
    yay -Rs               # 卸载工具及依赖
```

#### 使用 `yum` 作为包管理器

``` bash
    yum search              # 从镜像源中搜索工具
    yum update              # 升级镜像源清单及工具
    yum upgrade             # 升级镜像源及系统
    yum install             # 从镜像源中安装工具
    yum remove              # 卸载工具
    yum autoremove          # 自动清理
    yum check-update        # 确认升级包
```

#### 使用 `apt` 作为包管理器

``` bash
    apt search              # 从镜像源中搜索工具
    apt update              # 升级镜像源清单
    apt upgrade             # 升级镜像源包
    apt install             # 从镜像源中安装工具
    apt remove              # 卸载工具
    apt autoremove          # 自动清理
    apt purge --remove      # 卸载工具及依赖
    apt list --upgradable   # 升级工具清单
```

#### 使用 `dpkg` 作为工具管理

``` bash
    dpkg -i ./install.deb           # 安装工具
    dpkg -r ./install.deb           # 卸载工具
    dpkg --print-architecture       # 打印当前工具环境
    dpkg --add-architecture amd64   # 环境切换为amd64
    dpkg --add-architecture i386    # 环境切换为i386
    dpkg --add-architecture arm64   # 环境切换为arm64
    dpkg --remove-architecture i915 # 删除i915环境
```

#### 使用 `snap` 作为工具管理

``` bash
    snap serch              # 搜索工具
    snap install            # 安装工具
    snap remove             # 卸载工具
    snap <program>          # 执行工具
```

## 驱动管理
### 组建及模块操作

#### 查看 `物理设备` 操作

``` bash
    lspci ｜ grep Audio/VGA/3D
    # Audio = 声卡
    # VGA = 核心显卡
    # 3D = 独立显卡
    lspci -knn # 查看所有正在使用的驱动
```

#### 常用驱动安装列表

``` bash
    linux-headers-$(uname -r)       # 内核头文件安装
    linux-source                    # 编译必备组建
    build-essential                 # 编译必备组建
    make                            # 编译工具
    nvidia-kernel-dkms              # 英伟达开源驱动DKMS
    pulseaudio                      # 声卡开源驱动
    bluetooth                       # 蓝牙开源驱动
    bluez                           # 蓝牙开源驱动进程
    mesa-utils                      # 编译必备组建
    mesa                            # 编译必备组建
    lib32-mesa                      # 编译必备组建(32位)
    vulkan-intel                    # 英特尔核显驱动
    lib32-vulkan-intel              # 英特尔核显驱动(32位)
```

#### ` BASH ` 环境强制中文

``` bash
    vim ~/.bashrc
    export LANGUAGE="zh_CN:UTF-8"
    reboot
```

#### ` 网络 ` 基础配置

``` bash
    ip addr                     # 查看网卡名称
    ifconfig wlan0 up/down      # 启用无线网卡
    # 连接指定无线网络
    wpa_supplicant -B -i wlan0 -c <(wpa_passphrase wifi-ssid wifi-password)
    # 或者
    ifconfig enp7s0 up/down     # 启用有线网卡
    dhcpcd                      # 开启dhcp接收模式
    # 查看连接状态
    iw dev wlan0/enp7s0 link
```

---

## 输入输出
### 输入法接口操作

#### `Fcitx` 输入法操作

安装清单

``` bash
    fcitx               # 输入法主程序
    fcitx-googlepinyin  # 谷歌拼音
    fcitx-configtool    # 配置界面
```

基础环境添加输入法

``` bash
    vim /etc/environment
    GTK_IM_MODULE=fcitx
    QT_IM_MODULE=fcitx
    XMODIFIERS=@im=fcitx
    SDL_IM_MODULE=fcitx
    # 自动运行只在KDE/Gnome/Xfce/LXDE环境下生效
    fcitx-autostart &> /dev/null
```

输入法主题设置

``` bash
    ls -l /usr/share/fcitx/skin
    # 查看目录下的主题，并编辑配置文件
    vim /home/user/.config/fcitx/conf/fcitx-classic-ui.config
    # 查找以下内容并调整实际主题切换
    SkinType=dark
```

#### `Fcitx 5` 输入法操作

安装清单

``` bash
    fcitx5-im               # 输入法主程序
    fcitx5-chinese-addons   # 拼音字典
    fcitx5-rime             # 配置界面
```

基础环境添加输入法

``` bash
    vim /etc/environment
    GTK_IM_MODULE=fcitx
    QT_IM_MODULE=fcitx
    XMODIFIERS=@im=fcitx
    SDL_IM_MODULE=fcitx
    # 自动运行只在KDE/Gnome/Xfce/LXDE环境下生效
    cp /usr/share/applications/fcitx5.desktop ~/.config/autostart/ 
```

输入法主题设置

``` bash
    fcitx5-material-color                       # 安装主题
    ls ~/.local/share/fcitx5/themes             # 查看主题
    vim ~/.config/fcitx5/conf/classicui.conf    # 修改主题配置文件
    # 查找以下内容并调整实际主题切换
    Theme=Material-Color-Pink
```

#### `ibus` 输入法操作

安装清单

``` bash
    ibus          # 输入法主程序
    ibus-pinyin   # 拼音字典
```
ibus在gnome环境下安装好即可使用

#### `CentOS` 汉化

``` bash
    local -a                    # 列出语言清单
    local-gen zh_CN.UTF-8       # 加入中文
    # 将中文设为默认
    vim /etc/profile
    export LANG='zh_CN.UTF-8'
    # 中文cli环境
    zhcon
    zhcon --utf8
```

---

## 工具管理
### 工具应用及操作

#### 安装清单

| 工具类型 | 工具名称 | 组件名称 |
| :------: | :------: | :------ |
| 版本工具 | screenfetch | 主程序 |
| 版本工具 | neofetch | 主程序 |
| 文件工具 | thunar | 主程序 |
| 文件工具 | ranger | 主程序 |
| 下载工具 | qbittorrent | 主程序 |
| 下载工具 | pyIDM | 主程序 |
| 绘图工具 | gimp | 主程序 |
| 绘图工具 | gimp | gimp-help-en |
| 绘图工具 | scrot | 主程序 |
| 浏览器工具 | firefox | 主程序 |
| 浏览器工具 | firefox | firefox-l10n-zh-cn |
| 浏览器工具 | chromium | 主程序 |
| 浏览器工具 | chromium | chromium-l10n |
| 浏览器工具 | lynx | 主程序 |
| 办公工具 | wps-office | 主程序 |
| 办公工具 | wps-office | wps-office-mui-zh-cn |
| 音乐工具 | netease-cloud-music | 主程序 |
| 音乐工具 | mpd | 主程序 |
| 音乐工具 | ncmpcpp | 主程序 |
| 社交工具 | discord | 主程序 |
| 社交工具 | telegram-desktop | 主程序 |
| 虚拟化工具 | virtualbox | 主程序 |
| 虚拟化工具 | virtualbox | virtualbox-ext-oracle |
| 编译工具 | visual-stdio-code-bin | 主程序 |
| 安卓工具 | android-tools | 主程序 |
| 时间工具 | ntp | 主程序 |
| 韵味工具 | mtr | 主程序 |
| 网络工具 | whois | 主程序 |
| 编译工具 | gcc | 主程序 |
| 仓库工具 | git | 主程序 |
| 下载工具 | curl | 主程序 |
| 下载工具 | wget | 主程序 |
| 词典工具 | scrcpy | 主程序 |
| 编译组件 | libcaca | 主程序 |
| 编译组件 | highlight | 主程序 |
| 编译组件 | atool | 主程序 |
| 编译组件 | w3m | 主程序 |
| 编译组件 | elinks | 主程序 |
| 编译组件 | mediainfo | 主程序 |


#### 关键操作

scrot

``` bash
    scrot -s /mnt/machine/%wx%h.png  # 保存到制定目录
```

chromium

``` bash
    chromium --no-sandbox # 超级用户身份运行
```

discord

``` bash
    vim /opt/discord/discord.desktop
    Exec = /usr/bin/discord --proxy-server="socks://127.0.0.1:8080" # 配置代理运行
```

telegram-desktop

``` bash
    https://t.me/setlanguage/classic-zh-cn # 中文语言包地址
```

scrcpy

``` bash
    scrcpy -V                            # 查看工具版本
    adb tcpip 2188                       # 打开tcp端口为2188
    adb connect 192.168.1.2:2188         # 链接设备端口
    scrcpy                               # 启用远程
    adb disconnect 192.168.1.2:2188      # 断开设备远程
```

ranger初始配置

``` bash
    ranger —copy-config=all           # 生成默认配置
    # 修改默认配置
    vim ~/.config/ranger/rc.conf
    set preview_images true
    set draw_borders true
    set collapse_preview false
    set preview_max_size 2048000
    set one_indexed true
    # 解禁root使用
    ranger > gR > /core/main.py > :/username > root_disable
    # ranger日常指令
    yy = copy
    dd = cut
    pp = paste
    po = Overlay
    dD = delete
    dU = folder size
    cw = rename
    space bar = tag file
    delete bar = show hidden files
```

centos安装neofetch版本工具

``` bash
    yum install epel-release # 安装工具源
    curl -o /etc/yum.repos.d/konimex-neofetch-epel-7.repo https://copr.fedorainfracloud.org/coprs/konimex/neofetch/repo/epel-7/konimex-neofetch-epel-7.repo
```

manjaro安装yakuake

``` bash
    yay install yakuake # 安装工具源
    # 启用开机自启动
    cp /usr/share/applications/org.kde.yakuake.desktop ~/.config/autostart/
```

---

## 显示设置
### 显示器接口操作

#### 检查显示器接口状态

``` bash
    xrandr  # 打印当前接入的物理显示器
```

#### 关于扩展屏幕配置

``` bash
    xrandr --output eDP1 --auto --primary   # 设置主屏幕
    xrandr --output DP1 --auto              # 设置主副屏同步
    xrandr --output DP1 --left-of eDP1      # DP1在eDP1左边
    xrandr --output DP1 --right-of eDP1     # DP1在eDP1右边
    xrandr --output DP1 --up-of eDP1        # DP1在eDP1上边
    xrandr --output DP1 --down-of eDP1      # DP1在eDP1下边
```

#### 关于旋转屏幕配置

触摸屏驱动清单

``` bash
    xf86-input-evdev
    xf86-input-libinput
    xf86-input-elographics
```

` 方案1 ` 梳理配置文件

``` bash
    vim /etc/X11/xorg.conf
    Section "Monitor"
       Identifier          "eDP1"
       Option              "Rotate" "normal"  # 选择 normal/right/left
    EndSection

    Section "Screen"
       Identifier          "Screen0"
       Monitor             "eDP1"
       Option              "RandRRotation"
    EndSection

    Section "ServerLayout"
       Identifier          "DefaultLayout"
       Screen              "Screen0"
    EndSection

    Section "InputClass"                      # 触摸屏设置
       Identifier          "touchscreen"
       MatchIsTouchscreen  "on"
       MatchDevicePath     "/dev/input/event*"
       Driver              "evdev"
       Option              "SwapAxes" "true"
       Option              "InvertX" "false"
       Option              "InvertY" "true"
    EndSection
```

` 方案2 ` 命令操作旋转

``` bash
    vim /usr/share/sddm/scripts/Xsetup        # 适用于sddm登录环境
    xrandr --output screen --rotate left
    xrandr --output screen --rotate right
    xrandr --output screen --rotate inverted
    xrandr --output screen --rotate normal
```

---

## 登录环境
### 图形化访问操作

#### sddm允许超级用户访问图形化

``` bash
    vim /etc/pam.d/sddm
    # auth    required   pam_succeed_if.so user != root nopasswdlogin
    auth    sufficient   pam_succeed_if.so user ingroup nopasswdlogin
```

#### sddm主题设置

``` bash
    ls -la /usr/share/sddm/themes # 查看主题目录
    # 编辑配置文件
    vim /etc/sddm.conf
    Current=themename
```

#### Fluxbox桌面环境

创建命令接口

``` bash
    [exec](terminals){urxvt -bg black -fg pink/red/green/white -geometry 80x60}
    [exec](menu-address)
```

命令工作窗口

``` bash
    [submenu](box)
        [exec](tool){urxvt -geometry 80x60 -e tool}
    [end]
```

程序菜单

``` bash
    [submenu](box)
        [exec](program){program-address}
        [exec](program(rename\)){program-address}
    [end]
```

壁纸切换

``` bash
    [submenu] (Backgrounds)
        [wallpapers] (~/.fluxbox/backgrounds) {feh --bg-scale}
        [wallpapers] (/usr/share/fluxbox/backgrounds) {feh --bg-scale}
    [end]
```