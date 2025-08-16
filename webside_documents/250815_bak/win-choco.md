---
title: Windows部署Chocolatey
abbrlink: 10670
date: 2024-06-20 21:33:02
---
## 即使WIN系统下也可以实现命令行安装工具
很多朋友可能还不熟悉这个工具，先简单介绍下Chocolatey是一个Windows平台上的包管理器，它允许用户通过命令行界面或图形用户界面轻松地安装、升级和卸载软件包。它的目标是简化Windows软件的安装和管理过程，类似于Linux上的包管理器（如apt、yum或dnf）

- 项目地址： [chocolatey.org](https://chocolatey.org/)

### 开始部署

#### 确认系统环境环境
根据官方指引在部署之前，你需要先确认系统环境及相关条件
- 客户机/服务器版的系统至少为Windows 7+ / Windows Server 2003+
- 管理员PowerShell命令行版本至少为v2+ (minimum is v3 for install from this website due to TLS 1.2 requirement)
- 系统需要安装.NET Framework 4+ 插件

#### 命令行界面部署
以管理员身份打开PowerShell，输入命令并按Enter执行

``` bash
$ Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH.Client*' | Add-WindowsCapability -Online
$ # 进度条读写完毕后，再次输入：
$ Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### 如无报错，此时Chocolatey应该已写入环境变量
打开CMD(普通用户身份即可)

``` bash
$ choco -v # 显示Chocolatey当前版本号
$ choco -h # 显示工具相关指令帮助
$ choco search <package> # 搜索安装包
$ choco install <package> # 安装工具
$ choco uninstall <package> # 卸载工具
$ choco upgrade <package> # 更新工具
$ # 示例
$ choco install winfetch
```

#### 以上便是本篇文章的全部内容
感谢阅读