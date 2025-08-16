---
title: PVE开启硬件直通
abbrlink: 34585
date: 2024-06-16 19:08:23
---
- 注意: 该方案仅作用于虚拟机，对LXC容器无效
硬件直通是老生常谈的事情，你在开始前要先搞明白自己的主板芯片组是怎么分布的，以及南桥与北桥的情况；如果你的需求仅仅是直通网卡、声卡、硬盘等PCI-e设备，要求没那么高，那成功率还是很高的；如果你的需求是直通核显、独显，那么你需要更多的去参考同类型的主板，找同类型的方案，成功率才会有所提高
## 讲个显卡直通的题外话

不要听信网上有些神棍所谓的定制bios能一键核显/独显直通，其原理就是用ovmf模式套你主板的bios参数再换个引导界面皮，然后编程器编个二进制bios文件就给你用了，所有设置参数整合进grub文件里在宿主机启动时启动，说白了就是你理解透硬件直通的原理逻辑后，能实现的功能用神棍的方案也能实现，你实现不了的所谓的bios方案也搞不定，明白吧

### 现在开始
#### 设置grub启动引导

``` bash
$ nano /etc/default/grub #编辑文件
$ # 查找到 GRUB_CMDLINE_LINUX_DEFAULT 的部分，调整为以下内容
$ GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt video=efifb:off"
$ # 完成后记得更新下引导文件
$ update-grub || update-grub2
```

#### 开启直通模组

``` bash
$ nano /etc/modules # 加入以下内容
$ # 开启vfio模组驱动程序
$ vfio
$ vfio_iommu_typel
$ vfio_pci
$ vfio_virqfd
```

#### 完成后，重启宿主机，基本上到这一步网卡、声卡、硬盘等PCI-e设备已经是可以直通了

``` bash
$ lspci -nnk # 查看硬件当前驱动
$ # 如果你需要直通的设备 Kernel driver in use: 后无内容，说明可以了
$ # 在前端仪表台加入PCI-e设备即可
```

#### 进阶设置，刚刚说到内核驱动无内容，如果有内容怎么办？我们将其加入黑名单

``` bash
$ nano /etc/modprobe.d/pve-blacklist.conf
$ # 加入以下内容
$ # 将不需要的内核驱动加入黑名单
$ blacklist nvidiafb
$ blacklist snd_hda_intel
$ blacklist snd_hda_codec_hdmi
$ blacklist i915
```
##### 如果是直通显卡的，还需要将显卡的编号加入vfio模组
感谢阅读