---
title: 压缩工具ZIP与RAR使用技巧
abbrlink: 16131
date: 2025-03-09 17:09:23
---

> ### 本文主要对压缩工具zip与rar的日常使用方法进行梳理
#### 内容来源于网络，本文仅作整合，实际情况请自行测试

- #### 关于zip工具的说明

| zip/unzip命令 | zip/unzip操作说明 |
| :------: | :------: |
| zip -r | 创建.zip压缩文件 | 
| zip -m | 对现有.zip压缩文件添加文件 |
| zip -d | 在现有.zip压缩文件中删除文件 |
| unzip -v | 查看现有.zip压缩文件中的内容 |
| unzip -d | 对现有的.zip压缩文件进行解压 |
| unzip -o | 在不提示的情况下覆盖原文件 |

- ##### 关于zip工具的操作指南
``` bash
zip -r attach.zip /attach/1.txt /attach/2.txt # 用于将attach文件夹内的2个文件打包至.zip压缩包
zip -r attach.zip /attach/* # 用于打包attach文件夹内所有文件至.zip压缩包
unzip -v attach.zip # 用于查看当前目录下.zip压缩包的内容
zip -m attach.zip /attach/1.txt # 为当前目录下的.zip压缩包内增加一个文件
zip -d attach.zip /attach/1.txt # 为当前目录下的.zip压缩包内删除一个文件
unzip -d ./ attach.zip # 解压.zip压缩包至当前目录，此时会释放attach/文件夹
unzip -o -d ./ attach.zip # 解压.zip压缩包至当前目录，此时会释放attach/文件夹并覆盖当前目录重名文件
```

---

- #### 关于rar工具的说明

| rar/unrar命令 | rar操作说明 |
| :------: | :------: |
| rar a | 创建.rar压缩文件 |
| rar a -r  | 创建.rar压缩文件(源文件夹内必须非空) |
| rar a -p | 创建.rar压缩文件(含密码创建) |
| rar l | 检查.rar压缩文件内容 |
| rar v | 检查.rar压缩文件完整性 |
| unrar x | 对现有.rar文件进行解压 |
| unrar x -p | 对现有.rar文件进行解压(含密码解压) |
| unrar x -d | 对现有.rar文件进行解压(解压到制定文件夹) |


- ##### 关于rar工具的操作指南
``` bash
rar a attach.rar /attach/1.txt /attach/2.txt # 用于将attach文件夹内的2个文件打包至.rar压缩包
rar a -r attach.rar /attach/ # 用于打包attach文件夹内所有文件至.rar压缩包
rar a -p 123456 attach.rar /attach/1.txt /attach/2.txt # 用于打包过程并附加密码123456
rar l attach.rar # 用于查看当前目录下.rar压缩包的内容
rar v attach.rar # 用于校验压缩包内容是否完整
unrar x attach.rar # 解压.rar压缩包至当前目录，此时会释放attach/文件夹
unrar x attach.rar -p 123456 # 解压包过程输入密码123456
unrar x attach.rar -d /attach # 解压包到指定路径
```

#### 以上便是本章节全部内容
##### 感谢阅读
