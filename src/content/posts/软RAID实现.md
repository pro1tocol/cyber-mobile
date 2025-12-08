---
title: 软RAID实现
published: 2025-05-11
description: ""
tags: ["Archlinux", "操作"]
category: 工具
draft: false
---

### 本文主要介绍在Linux环境下使用systemd-boot结合mdadm实现软件层面的raid冗余

> 思维拓扑
> 

### 物理存储

```bash
# 假设主机设备存在两块物理存储
/dev/nvme0n1
/dev/nvme1n1
```

### 引导分区

```bash
# 该部分做主备配合BIOS进行UEFI引导
/dev/nvme0n1p1
/dev/nvme1n1p1
```

### 逻辑分区

```bash
# 逻辑分区使用lvm作为linux根文件系统
/dev/mapper/linux-root
```

- 整体结构

```bash
nvme0n1 # 物理存储
├─nvme0n1p1 # systemd-boot备引导
└─nvme0n1p2 # gpt格式
  └─md1 # raid1冗余
    └─linux-root # lvm逻辑分区
nvme1n1 # 物理存储
├─nvme1n1p1 # systemd-boot主引导
└─nvme1n1p2 # gpt格式
  └─md1 # raid1冗余
    └─linux-root # lvm逻辑分区
```

> 具体实现
> 

### 使用parted工具进行物理存储分区

```bash
# 操作nvme0n1物理分区
sudo parted /dev/nvme0n1
mklabel gpt # 配置为GPT（GUID 分区表）标签
# 对于M2存储，从扇区4096开始会比较好，具体原因请自查
mkpart ESP 4096s 512M # 创建一个名为 ESP 的分区，从扇区 4096 开始，大小为 512MB
mkpart primary 512M -1 # 创建一个主分区为 primary 的分区，从 512MB 处开始，直到磁盘的末尾用于存储操作系统和其他数据
set 1 boot on # 设置第一个分区（即 ESP 分区）为引导分区，以便系统可以从中引导
# 该步骤同步操作nvme1n1物理分区
```

### 使用mdadm工具建立md1阵列分区

```bash
# 将nvme0n1p2与nvme1n1p2创建级别为raid1的存储阵列
sudo mdadm --create /dev/md1 --level=1 --raid-devices=2 /dev/nvme0n1p2 /dev/nvme1n1p2
```

### 创建lvm逻辑分区

```bash
sudo pvcreate /dev/md1
sudo vgcreate linux /dev/md1
sudo lvcreate -l +100%FREE linux -n root
sudo mkfs.ext4 /dev/mapper/linux-root
# 创建完成可以使用lvs命令测试lvm逻辑分区状态
```

### 分区挂载及基础系统环境安装

```bash
sudo mount /dev/mapper/linux-root /mnt
sudo mkdir -p /mnt/boot
# 格式化引导主分区
mkfs.fat -F32 /dev/nvme1n1p1
# 格式化引导备分区
mkfs.fat -F32 /dev/nvme0n1p1
# 挂载主引导分区
sudo mount /dev/nvme1n1p1 /mnt/boot
# 成功创建后使用df工具可以查看分区挂载状态
df -h
```

### 接下来就可以使用命令行或者安装工具将Linux内核及对应发行版的操作系统安装到lvm分区里，安装完成后我们还需要一些关键操作才能使得引导自动加载

- 注意：确保lvm分区内的操作系统已经安装mdadm工具

```bash
# 在外部运行该命令查看当前的阵列状态
sudo mdadm --detail /dev/md1
# 在外部将存储UUID写入操作系统
genfstab -U /mnt > /mnt/etc/fstab
# 在外部将阵列表写入操作系统
sudo mkdir -p /mnt/etc/mdadm
sudo mdadm --detail --scan >> /mnt/etc/mdadm/mdadm.conf
sudo mdadm --detail --scan >> /mnt/etc/mdadm.conf
```

### 修改mkinitcpio.conf文件信息

```bash
sudo vim /mnt/etc/mkinitcpio.conf
    BINARIES=(mdmon)
# 在一个 FakeRAID 阵列上使用 mdadm_udev 钩子
    HOOKS=(base systemd ... block mdadm_udev lvm2 ...)
# systemd保证操作系统启动引导为systemd-boot
# mdadm_udev引导阶段读取默认mdadm.conf配置文件
# lvm2引导阶段正常读取lvm分区
chroot /mnt # 进入操作系统内部
mkinitcpio -p linux # 更新/mnt/boot内的内核引导文件
reboot # 以上步骤没有报错，则重启软raid生效
```

### 使用systemd-boot引导可以参考这篇[《替换systemd-boot启动引导》](https://cyber-mobile.net/s/systemd-boot.html#)

### 如果重启无报错，配置备引导分区

```bash
# 重启后将备分区挂载
sudo mount /dev/nvme0n1p1 /mnt
# 拷贝引导文件
sudo cp -rf /boot/* /mnt
# 退出挂载
sudo umount -R /mnt
# 重启进入BIOS尝试备分区是否能正常引导操作系统
# 如果能正常引导则操作完成
# 未来可使用自动化工具定期备份引导文件
# 未来如果有内核升级，必须全量备份引导文件
```

### 以上为本篇文章全部内容

### 感谢阅读