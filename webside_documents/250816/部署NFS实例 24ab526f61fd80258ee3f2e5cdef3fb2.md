---
title: 部署NFS实例
abbrlink: 12133
date: 2025-08-01 21:22:00
---

- 注意：NFS 服务严格依赖 RPC 服务

如对RPC服务及端口不信任的，可以终止搭建了

### 本次搭建使用docker-compose项目的方式

以`服务端` 与 `客户端`的方式进行部署

---

## 服务端部署

在开始前请规划好物理存储规划，假如负责nfs存储的为/dev/sda2，建立开机自启挂载

```bash
vim /etc/fstab
UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx /mnt/nfs               ext4    defaults        0 0
```

下载nfs服务端容器镜像

```bash
sudo docker pull itsthenetwork/nfs-server-alpine
sudo docker images | grep nfs # 下载完成查看容器镜像
```

配置文件

```yaml
services:
    nfs:
        image: itsthenetwork/nfs-server-alpine
        container_name: nfs-server
        ports:
          - "2049:2049"
          - "111:111"
          - "20048:20048"
        environment:
          - SHARED_DIRECTORY=/mnt/data
          - EXPORTS_EXPRESSION=/mnt/data *(rw,sync,no_subtree_check)
          - PERMITTED="192.168.0.*"
        volumes:
          - /mnt/nfs:/mnt/data
        restart: always
        privileged: true
```

服务启动后允许192.168.0.0/24网段的设备访问，服务占用宿主机的2049、111、20048端口，使用：

```bash
sudo docker compose up -d # 启动服务
sudo netstat -nltp # 查看服务端口是否启动
```

## 客户端配置

客户端需要安装 **nfs-utils** 组件以完成接入服务，请根据自身linux系统情况进行安装

客户端的rpc服务不是必须的，可以使用：

```bash
sudo systemctl disable --stop rpcbind.socket
sudo systemctl disable --stop rpcbind.service
# 禁用客户端rpc服务
```

接入服务端nfs服务

```bash
sudo mount -v -o vers=4,loud 192.168.0.2:/ /mnt
# 将192.168.0.2服务器nfs存储挂载到本地的/mnt路径下
# 没有报错则成功，如报错请检查配置信息
```

设计开机自启nfs存储，将信息添加至 **/etc/fstab** 文件

```bash
192.168.0.2:/             /mnt               nfs     defaults,timeo=900,retrans=5,_netdev    0 0
```

### 以上便是本章节全部内容

### 感谢阅读