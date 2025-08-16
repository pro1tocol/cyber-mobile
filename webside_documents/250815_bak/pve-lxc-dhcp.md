---
title: PVE部署网关/dhcp服务器
abbrlink: 16849
date: 2024-06-26 08:39:03
---
## 开始之前，需要声明
- 该方案使用dnsmasq工具部署，其原理通用于物理
- 部署过程仅含网关路由转发与实现dhcp功能，不含防火墙规则设置DMZ规则及出入站流量控制请自行配置
- 需要子网掩码及地址规划相关基础知识前置

## 现在回归正题

### 首先我们需要在宿主机建立一个内网环境，外网出口计划在LXC容器上
#### 你需要在 `节点` -> `系统` -> `网络` 中添加：

##### 建立OVS Bridge配置名称为eth1
##### 建立OVS IntPort配置地址为10.0.0.2/27，名称为device2，桥接eth1
##### 修改eth1配置桥接device2
此时该局域网eth1还没正式建立，宿主机的地址仅为逻辑地址，是无法作用于局域网的

### eth1网段规划(可根据需求情况调整)
#### 该局域网的网络地址为10.0.0.0，直接广播地址为10.0.0.31
#### 该局域网的子网掩码为255.255.255.224，可用地址数为30个(含网关地址)
#### 此时应该在宿主机上有个Linux Bridge的eth0是作为该局域网网关的WAN口，如果只做内网也可不用

### 容器服务部署
#### 你可以根据模板搭建LXC容器，debian10/11环境均可

##### 开启路由转发功能

``` bash
$ sudo apt install net-tools -y && netstat -nltp # 检查53端口是否被占用
$ # 如果被占用，你需要使用systemctl工具关闭占用端口的相应服务
$ sudo nano /etc/sysctl.conf # 编辑文件
```

##### 找到以下内容并取消注释

``` bash
$ net.ipv4.ip_forward=1
```

##### 保存后你需要更新服务以生效

``` bash
$ sudo sysctl -p
```

##### 安装dnsmasq工具并部署服务

``` bash
$ sudo apt install dnsmasq -y && sudo systemctl enable dnsmasq && sudo systemctl start dnsmasq
$ sudo nano /etc/dnsmasq.conf # 编辑dnsmasq配置文件
```

##### 根据网段规划加入以下内容

``` bash
$ interface=eth1
$ dhcp-range=10.0.0.2,10.0.0.30,255.255.255.224,24h
$ dhcp-option=3,10.0.0.1
$ dhcp-option=6,10.0.0.1
$
$ server=223.5.5.5
$ server=8.8.4.4
$ domain-needed
$ bogus-priv
$ expand-hosts
```

意思是LXC容器本地的地址为10.0.0.1，同时也是局域网的网关，分配的dhcp范围10.0.0.2~10.0.0.30

##### 完成配置后可以回到宿主机编辑LXC容器配置文件

``` bash
$ cd /etc/pve/lxc && nano 100.conf # 假设该编号存储容器的配置信息
```

##### 确保网络含以下内容

``` bash
$ n0: name=eth0,bridge=eth0,gw=192.168.1.1,hwaddr=F2:70:C8:8D:93:EF,ip=192.168.1.15/24,type=veth
$ n1: name=eth1,bridge=eth1,gw=192.168.1.15,hwaddr=56:DB:76:52:9F:56,ip=10.0.0.1/27,type=veth
```

你需要充分理解内容的含义，这部分就不解释了，完成后你需要重启LXC容器以应用配置

到这基本上已完成配置部署，此时容器为网关及dhcp服务器，宿主机及后面新建的所有容器虚拟机仅需以桥接模式使用eth1
网络设置会自动分配内网地址，外部出入口流量会全部由该容器处理，所以对容器的负载均衡需要提前考虑

感谢阅读