---
title: Docker代理配置
abbrlink: 63968
date: 2024-06-12 12:33:23
---
由于环境恶劣，在构建容器时会出现Pull失败
你需要代理，需要代理，需要代理

## 怎么做？

创建代理配置文件

``` bash
$ mkdir -p /etc/systemd/system/docker.service.d
$ nano /etc/systemd/system/docker.service.d/proxy.conf
$ # 加入以下内容
$ [Service]
$ Environment="HTTP_PROXY=http://<your_proxy_address>:7890/"
$ Environment="HTTPS_PROXY=http://<your_proxy_address>:7890/"
$ Environment="NO_PROXY=localhost,127.0.0.1,.example.com"
```

重启docker服务，配置生效

```bash
$ systemctl daemon-reload
$ systemctl restart docker.service
```

感谢阅读