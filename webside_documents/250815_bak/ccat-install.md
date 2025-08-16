---
title: ccat组件源码部署
abbrlink: 16108
date: 2023-12-30 06:48:23
---
## 简单介绍：

### ccat是一个功能强大的文本分类和聚类分析工具包，支持JavaScript、Java、Ruby、Python、Go、C、JSON、Shell等相关语言，在命令行界面使用，简单直接明了使用带语法高亮，可以替换自带的cat工具

## 三分钟快速安装

该工具适合amd64的linux架构，暂不支持arm/arm64/32位等架构的linux环境，但archlinux arm环境下使用yay可以拉取安装aur包，亲测可用，其他环境不能使用yay的确是没办法

- 部署流程
项目地址：[github.com/owenthereal/ccat](https://github.com/owenthereal/ccat)
很好的项目可惜不更新了
### 下载最终版源码并解压

``` bash
$ wget https://github.com/jingweno/ccat/releases/download/v1.1.0/linux-amd64-1.1.0.tar.gz # 下载
$ sudo apt install tar -y && tar xfz linux-amd64-1.1.0.tar.gz # 安装解压工具并解压releases
```


### 安装工具并加权

``` bash
$ sudo cp linux-amd64-1.1.0/ccat /usr/local/bin/ # 安装工具
$ sudo chmod +x /usr/local/bin/ccat # 赋予可执行权限
```


### 替代cat工具

``` bash
$ sudo nano ~/.bashrc # 编辑解释器文件
$ # 加入以下内容
$ alias cat='ccat' # 替换命令
```

此时安装已完成，重新载入命令行界面即可使用cat命令调用工具

- 以上便是本章节全部内容
