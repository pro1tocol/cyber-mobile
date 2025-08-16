---
title: PVE容器LXC多层嵌套
abbrlink: 50636
date: 2024-06-14 19:08:23
---
从功耗比上看，lxc容器与PVE环境更匹配

## 2步开启宿主机多层嵌套

- 首先在CT模板关闭状态下，不要勾选 `无特权容器` 并且在 `选项`  → 功能勾选 `嵌套`
- 进入宿主机tty命令行模式

``` bash
$ cd /etc/pve/lxc # 进入目录
$ nano xxx.conf   # 针对需要嵌套的容器配置文件进行修改
$ # 对容器的配置文件增加以下内容
$ lxc.apparmor.profile: unconfined
$ lxc.cgroup.devices.allow: a
$ lxc.cap.drop:
```

保存退出后，前端或后端启动相应的容器
确认容器是否已启用嵌套虚拟化，需要进入容器命令行界面

``` bash
grep -cw vmx /proc/cpuinfo
# 如果输出为 0，则表示虚拟化支持未启用
# 如果输出为大于 0 的数字，则表示虚拟化支持已启用
``` 

----------
以上便是本章节全部内容