---
title: Python2编译pyrit
published: 2024-06-24
description: ""
tags: ["Debian", "操作"]
category: 记录
draft: false
---

简单介绍：Pyrit 是一个用于无线网络渗透测试的开源工具，主要用于破解WPA/WPA2-PSK加密的Wi-Fi密码

- 注意：未经授权的使用 Pyrit 或进行未经授权的密码破解是违法行为

## 该项目方已经许久未更新，暂不支持python3所以部署需要本地使用python2根据自身系统环境进行编译

原项目地址: [github.com/JPaulMora/Pyrit](https://github.com/JPaulMora/Pyrit) 建议了解清楚后再食用

### 本次编译环境依旧是debian系环境

首先我们需要安装依赖，从官方镜像源进行拉取

```bash
sudo apt install pip libpcap-dev python2-dev libffi-dev libssl-dev libxml2-dev libxslt1-dev zlib1g-dev -y
# 如果遇到没有的镜像包请检查镜像源是否齐全
```

### 可选：安装同类型网络监听工具

```bash
sudo apt install wireshark-cli tshark reaver bully cowpatty macchanger hashcat hcxdumptool hcxtools hcxpcaptool -y
# 这些工具在pyrit使用过程中可以优化，就不详细展开说明了
```

## 编译过程

### 拉取官方源码

```bash
sudo apt install curl git wget -y # 安装必备工具
git clone <https://github.com/JPaulMora/Pyrit.git> # 克隆源码
```

### 以流式文本编辑器替换相关文件

```bash
cd pyrit/ # 进入源码目录
sed -i "s/COMPILE_AESNI/COMPILE_AESNIX/" ./cpyrit/_cpyrit_cpu.c # 替换相关文件增加稳定性
```

### 编译与安装

```bash
python2 setup.py clean # 清除现有可执行文件
python2 setup.py build # 当前环境编译工具，需要一些时间
python2 setup.py install # 安装
```

### 测试工具

```bash
pyrit list_cores # 测试工具，如打印的内容与你的cpu核心数相同并且无其他报错，说明安装成功
reboot # 重启系统环境
```

### 以上便是编译安装的全部过程

---

### 另外附加 `镜像源` 安装流程

修改镜像源并搜索工具

```bash
  vim /etc/apt/sources.list
  deb-src <http://mirrors.ustc.edu.cn/debian/> buster main
  # 保存退出执行命令
  sudo apt update && sudo apt search pyrit
  # 如果搜索到指定的包安装即可
  sudo apt -y install pyrit
```

感谢阅读