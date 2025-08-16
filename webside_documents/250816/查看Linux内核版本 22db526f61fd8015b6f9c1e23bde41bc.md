---
title: 查看Linux内核版本
abbrlink: 16137
date: 2025-03-10 17:23:23
---

> 本文主要针对如何查看系统内核及版本
> 

### 需要进行的相关操作 `命令` 进行系统梳理

### 以下是命令概述某些功能有重复请忽略

- uname 命令

```bash
uname -srm # 查看系统内核版本
uname -a # 查看系统内核所有信息
```

- 查看proc内核关键信息

```bash
cat /proc/version # 查看发行版本
cat /proc/sys/kernel/osrelease # 查看系统内核版本
```

- 查看release信息

```bash
cat /etc/*-release # 查看系统信息
```

- 查看hostnamectl输出信息

```bash
hostnamectl # 查看主机基本信息
```

### 以上是本章节全部内容

### 感谢阅读