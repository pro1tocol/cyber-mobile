---
title: 文件管理器使用RANGER使用指导
abbrlink: 16127
date: 2025-03-07 14:51:23
---
### 本文主要对终端命令行下文件管理器ranger的使用方法进行梳理
> #### 如遇增补内容会实时更新

- ##### 安装配置方面
工具包含：` ranger `  ` w3m `

字体包括：` nerd-fonts-apple `

针对不同发行版的Linux系统请根据实际情况自行下载

工具初始化
``` bash
# 自动将配置文件复制至用户目录~/.config/ranger路径下
ranger --copy-config=all
# 启动图片预览功能
vim ~/home/$USER/.config/ranger/rc.conf
    set preview_images true # 修改为true启动状态
    # 启动查看隐藏文件功能
    set show_hidden true
    # 启用文件夹边框
    set draw_borders both
    # 重新进入ranger生效
```

启动文件图标，参考[这篇文档](https://command-z-z.github.io/2022/08/23/%E7%BB%88%E7%AB%AF%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7ranger/)需要git插件才能生效
``` bash
# 保证网络畅通将插件下载到本地
git clone https://github.com/alexanderjeurissen/ranger_devicons ~/.config/ranger/plugins/ranger_devicons
# 增项配置信息
echo "default_linemode devicons" >> $HOME/.config/ranger/rc.conf
# 修改Xterm字体配置(其他终端可根据实际情况自行修改)
# 仅修改英文字体的部分
vim ~/.Xresources
    XTerm*faceNameDoublesize: Microsoft YaHei UI
    XTerm*faceName: SFMono Nerd Font Mono
    #XTerm*faceName: DejaVu Sans Mono 替换掉这段
xrdb -merge ~/.Xresources # 使配置生效 
```

- ##### 工具使用方面

删除及选择操作
``` bash
dD  # 单个文件删除
# <space> 案件可以选择多个文件
# 结合命令可进行多个文件批量删除
cw  # 可取消<space>选择的多个文件
v   # 当前目录下全选
```

显示隐藏文件
``` bash
zh  # 显示目录下的隐藏文件
```

文件剪切与复制
``` bash
dd  # 文件剪切
yy  # 文件复制
pp  # 文件粘贴
```

文件重命名
``` bash
cw  # 文件重命名
```

文件查找
``` bash
/   # 输入关键字当前目录下查找
```

终端目录跳转
``` bash
S   # 跳转至当前目录的命令行状态
```

#### 以上便是本章节全部内容
##### 感谢阅读

