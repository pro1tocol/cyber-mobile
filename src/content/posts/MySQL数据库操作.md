---
title: MySQL数据库操作
published: 2024-05-28
description: ""
tags: ["MySQL", "操作"]
category: 工具
draft: false
---

MySQL是一种广泛使用的关系型数据库管理系统，为了有效地管理和操作数据库，我们可以使用命令行界面来执行各种任务。本文将详细介绍如何使用命令行界面进行MySQL数据库的日常操作，包括手动检查数据流程、手动创建数据表、手动导入数据库、手动删除数据库和手动删除数据表

## 首先，确认权限

### 一般的mysql数据库相关账户信息可以在.env文件里界定

### 手动检查数据流程

需要登陆数据库进行操作

```bash
mysql -u root -p # 输入命令以超级用户权限登录到数据库
# 进入到数据库后，前缀会发生改变
mysql> # 成功登录
mysql> USE abc; # 选择abc数据库
mysql> SHOW TABLES; # 检查表是否存在，存在则会产生表格
mysql> SELECT * FROM lottery; # 当表存在时，可用于检测当前数据结构
```

- 当表不存在时，手动创建数据表方法

```bash
# 需要登陆数据库进行操作，进入数据库后
mysql> USE abc; # 选择abc数据库
# 为abc数据库创建包含七列数据的数据表
mysql> CREATE TABLE abc (
 col1 INT,
 col2 INT,
 col3 INT,
 col4 INT,
 col5 INT,
 col6 INT,
 col7 INT
);
mysql> SHOW TABLES; # 检查表是否成功创建
```

- 手动导入数据到库中，安全导入方式
该操作不需要登陆数据库，可在外部导入后再登陆检查

```bash
mysql -u root -p -e "SHOW VARIABLES LIKE 'secure_file_priv';" # 检查可安全导入的目录
cd /var/lib/mysql-files/ # 进入安全目录
cp /home/admin/123.csv ./ # 将需要导入的数据表复制到安全目录
mysql -u root -p -e "USE abc; LOAD DATA INFILE '/var/lib/mysql-files/123.csv' INTO TABLE abc FIELDS TERMINATED BY ',' ENCLOSED BY '\\"' LINES TERMINATED BY '\\n' IGNORE 1 LINES;" # 手动导入数据表
# 登陆数据库查看导入情况
mysql> USE abc; # 选择abc数据库
mysql> SELECT * FROM lottery; # 检测当前数据结构
```

- 手动删库环节，删库不删表

```bash
# 登陆数据库进行操作
mysql> USE abc; # 选择abc数据库
mysql> DELETE FROM abc; # 开心删库
mysql> SELECT * FROM lottery; # 检查数据返回情况
```

- 手动删除数据表

```bash
# 登陆数据库进行操作
mysql> USE abc; # 选择abc数据库
mysql> DROP TABLE abc # 开心删表
mysql> SHOW TABLES; # 检查表是否成功删除
```

---

以上是本章节全部内容，通过手动检查数据流程，我们可以确认数据库、数据表和数据的存在和状态。手动创建数据表可以根据需求定义表结构。手动导入数据库允许我们将数据从外部文件导入数据库表中。手动删除数据库和数据表可以帮助我们清除数据或重新设计数据库结构。通过掌握这些命令，您可以更好地管理和操作MySQL数据库。