---
title: 使用git管理仓库
abbrlink: 16144
date: 2025-05-02 23:41:00
---

## 本文主要介绍如何使用git命令管理仓库

### 配置访问用户
#### 本文仅使用用户级(非全局配置)
``` bash
git config user.name "name" # 配置用户名
git config user.email "email@qq.com" # 配置邮箱
gh auth login # 通过web授权的方式对仓库进行权限验证
cat ~/.gitconfig 可以查看配置的用户信息
```

### 日常仓库操作
``` bash
git clone https://github.com/something/something.git # 克隆远端仓库到本地
```
- #### 本地仓库修改内容后
``` bash
git status # 查看本地与远端仓库状态
git add path/files # 更新文件
git rm path/files # 删除文件
git commit -m "Update" # 为本次调整打上标签
git push origin main # 将本地调整的内容上传至远端仓库
```
- #### 远端仓库修改内容后
``` bash
git remote show origin # 查看远端分支信息
git branch -avv # 查看远端分支的状态
git fetch origin main # 同步远端仓库记录至本地，不修改内容
git log origin/main # 查看远端分支仓库日志
git pull origin main # 以远端分支仓库为标准将内容修改至本地仓库
```

- #### 切换本地仓库对应的远端仓库分支状态
``` bash
git checkout -b main2 # 切换本地仓库至main2分支
git status # 查看本地仓库分支是否已经同步切换
git add . # 将本地仓库进行更新
git commit -m "Upload" # 为本次调整打上标签
git push origin main2 # 将本地仓库分支上传至远端仓库
```

### 获取远端分支仓库
``` bash
git clone -b main2 https://github.com/something/something.git # 获取分支仓库，但仍会跟踪其他分支
git clone -b main2 --single-branch https://github.com/something/something.git # 获取分支仓库，不再跟踪其他分支
```

### 以上便是本篇文章的全部内容
#### 感谢阅读
