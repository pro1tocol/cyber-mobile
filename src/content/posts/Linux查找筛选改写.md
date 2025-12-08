---
title: Linux查找筛选改写
published: 2024-03-09
description: ""
tags: ["Linux", "操作"]
category: 记录
draft: false
---

> 本期文章主要针对Linux环境下常用的运维技巧进行梳理
> 

### 内容来源于网络，本文仅作整理，作用与否请自行测试

### 废话少说，实操部分

- find快速查找文件

```bash
find /usr/bin -name "cat" # 快速查找/usr/bin目录下是否存在cat文件
find /usr/bin -name "ca*" # 快速查找/usr/bin目录下是否包含ca字符的文件
find /etc -name "bash.bashrc" | xargs -i cat {} # 快速查找/etc目录下的bash.bashrc文件并根据查询结果打印文件内容
# 花括号占位符前可跟其他命令进行替换
```

- grep快速查看文件中的关键配置

```bash
grep Port /etc/ssh/sshd_config # 快速查看OpenSSH工具所使用的端口
```

- sed免交互快速修改配置

```bash
sed 's/Port 22/Port 25/' /etc/ssh/sshd_config # 临时修改远程工具OpenSSH的端口为25
sed -i 's/Port 22/Port 25/' /etc/ssh/sshd_config # 将远程工具OpenSSH的默认端口修改为25并执行写入
```

- sort对数据类文本进行排序

```bash
sort -n 123.txt # 对文本内的数字进行正向排序并打印
sort -n -r 123.txt # 对文本内的数字进行逆向排序并打印
```

- EOF免交互创建/增加文件内容

### 以上便是本章节全部内容

### 感谢阅读