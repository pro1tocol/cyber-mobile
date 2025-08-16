---
title: Systemd-boot引导
abbrlink: 16139
date: 2025-03-27 09:56:00
---

### 本文参考自UP主[unixchad](https://www.bilibili.com/video/BV1kdLqzeEBA/?spm_id_from=333.337.search-card.all.click)的教程及[Arch Wiki](https://wiki.archlinuxcn.org/wiki/Systemd-boot)相关文章

### 流程分解

步骤

---

[查询引导状态](Systemd-boot%E5%BC%95%E5%AF%BC%2022db526f61fd80ee980bf52689b4a722.md)

---

[安装引导工具](Systemd-boot%E5%BC%95%E5%AF%BC%2022db526f61fd80ee980bf52689b4a722.md)

---

[卸载旧引导](Systemd-boot%E5%BC%95%E5%AF%BC%2022db526f61fd80ee980bf52689b4a722.md)

---

> 查询状态
> 

```bash
bootctl status # 查看当前使用的引导工具
ls -l /boot # 查看Linux内核文件
ls -l /boot/efi # 查看引导文件
cat /etc/fstab # 查看分区(记录UUID)
```

> 安装systemd-boot引导
> 

```bash
sudo bootctl install
cd /boot/efi
```

### 编辑loader.conf文件

```bash
sudo vim loader/loader.conf
    default arch.conf
    timeout 3
    console-mode auto
    editor no
```

### 编辑arch.conf文件及arch-fallback.conf文件

```bash
# 将之前记录的UUID填入引导配置文件
sudo vim loader/entries/arch.conf
    title   Archlinux
    linux   /vmlinux-linux-zen
    initrd  /initramfs-linux-zen.img
    options root=UUID=xxx rw
sudo vim loader/entries/arch-fallback.conf
    title   Archlinux(fallback)
    linux   /vmlinux-linux-zen
    initrd  /initramfs-linux-zen-fallback.img
    options root=UUID=xxx rw
```

### 复制内核文件至引导路径

```bash
sudo cp /boot/initramfs-linux-zen* /boot/efi
sudo cp /boot/vmlinux-linux-zen /boot/efi
```

### 查看引导配置

```bash
bootctl list # 注意所有路径是否有效
```

> 重启成功后卸载GRUB引导
> 

```bash
sudo pacman -Rns grub
sudo rm -rI /boot/grub
sudo rm -rI /boot/efi/EFI/ARCH
```

### 删除efibootmgr引导记录

```bash
efibootmgr
# 确定grub分区编号
sudo efibootmgr -b 0 -B
```

### 以上便是本篇文章全部内容

### 感谢阅读