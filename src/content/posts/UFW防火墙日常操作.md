---
title: UFW防火墙日常操作
published: 2024-06-02
description: ""
tags: ["Debian", "操作"]
category: 工具
draft: false
---

## UFW是一款简单易用的防火墙工具，基于iptables

安装方面就不细说了，可以根据你的系统拉取不同的镜像源安装，我们从启动开始

```bash
sudo ufw enable # 启动防火墙
systemctl status ufw # 使用该工具的可查看后台运行情况
```

### 初始定义默认规则

默认规则将确定未明确指定的流量如何处理

```bash
sudo ufw default deny incoming # 拒绝所有其他传入流量不包括SSH连接
sudo ufw default allow outgoing # 允许所有传出流量
```

### 添加自定义规则

允许特定端口的传入连接

```bash
sudo ufw allow <port_number> # 端口可以替换为任意
# 允许特定IP地址的传入连接
sudo ufw allow from <IP_address> # 地址为外部地址
# 允许特定协议的传入连接
sudo ufw allow <protocol> # 例如HTTP/S、ftp协议等等
```

### 当前防火墙状态

查看当前的状态，允许或拒绝哪些规则

```bash
sudo ufw status # 查看规则描述
sudo ufw status numbered # 查看规则编号
# 删除某个特定规则可在已知规则编号的前提下进行
sudo ufw delete <rule>
```

通过使用UFW命令设置出入流量规则，你可以更好地控制系统和服务器上的网络流量。合理配置防火墙规则可以有效地保护系统免受潜在的威胁和攻击。记住，确保定期审查和更新规则以适应你的安全需求。以上便是本章节全部内容，希望能帮助你学会使用UFW防火墙的日常命令设置出入流量规则，提高系统的安全性