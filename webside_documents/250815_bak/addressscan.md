---
title: 主机地址与归属地查询
abbrlink: 55496
date: 2024-06-14 06:48:23
---
公网IP是唯一的，由于目前的IPv4网络环境的急剧恶化
基于动态地址的套娃现象层出不穷

## 如何确认你当前的IP地址？

输入以下命令即可查询本地公网IP绝对地址

``` bash
$ curl -L myip.ipip.net
```

但如果你的设备挂了代理或者其他工具，则需要以下命令

```bash
$ curl ipinfo.io/ip
```

当然如果你只需要查询局域网中由DHCP服务器分配的内网地址，只需要以下命令

```bash
$ ipconfig       # Windows环境下简单查询内网地址
$ ipconfig /all  # Windows环境下详细查询内网地址
$ ip addr        # Linux/Mac环境下查询网卡获取的当前内网地址
```