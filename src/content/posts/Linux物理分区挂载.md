---
title: Linux物理分区挂载
published: 2024-06-18
description: ""
tags: ["Linux", "操作"]
category: 记录
draft: false
---

## 在开始前首先需要注意三个关键要素

- 足够的物理存储空间
- 引导启动支持EFI模式
- 物理驱动器支持以 `root`权限开展作业

### 首先进入U盘引导启动live系统

```bash
# 可以使用这条命令检查是否支持EFI模式
ls /sys/firmware/efi/efivars # 出现内容则支持，反之无内容
```

### 在进行逻辑分区的过程中

```bash
# 可以用以下命令检查相关存储的工作状态
lsblk # 用于显示系统上所有已挂载的块设备的信息
fdisk -l # 查看系统上所有已挂载的磁盘分区的详细信息
df -h # 用于显示文件系统的磁盘空间使用情况
free -h # 用于显示系统内存的使用情况
```

### 接下来我们可以用 `cfdisk`进行分区操作

`cfdisk`拟图形化的分区方式对小白比较友好

### 分区过程中我们需要保证：

创建一个EFI分区，具体大小根据计划的启动项而定，至少不少于600MB

创建一个SWAP交换分区，大小是物理内存的0.5倍

创建一个系统分区，可选择将 `/root`目录与用户组的 `/home`目录进行卷组分割

### 保存分区配置可以选择write写入后quit退出完成操作

```bash
# 此时我们使用
fdisk -l # 查看分区信息
# 假设可以看到
/dev/sda
  /dev/sda1 # EFI 引导分区
  /dev/sda2 # SWAP 交换分区
  /dev/sda3 # SYSTEM 系统分区
```

### 接下来将进行分区格式化操作

```bash
mkfs.fat -F32 /dev/sda1 # 以FAT32格式格式化引导分区
mkswap /dev/sda2 # 格式化交换分区
mkfs.ext4 /dev/sda3 # 格式化系统分区
```

### 完成格式化后可分别对分区进行挂载

- 注：LIVE系统环境挂在逻辑分区
Linux环境下的`/mnt`目录可用于挂载，这里我们使用`mount`命令

```bash
mount /dev/sda3 /mnt # 挂载系统分区
mkdir -p /mnt/boot/efi # 创建efi引导启动目录
mount /dev/sda1 /mnt/boot/efi # 将efi引导分区挂载启动目录
swapon /dev/sda2 # 全局挂载交换分区
```

### 到这一步，我们已经可以对物理存储进行操作

以上为本篇文章的全部内容，感谢阅读