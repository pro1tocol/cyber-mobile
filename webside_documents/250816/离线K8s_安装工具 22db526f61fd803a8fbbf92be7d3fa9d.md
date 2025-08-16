---
title: 离线K8s_安装工具
abbrlink: 16222
date: 2023-04-04 13:11:45
---

### 本文主要针对离线部署的相关工具进行构建汇总安装

---

### 建议开始前先准备一台能够链接互联网的系统作为测试环境

### `测试环境` 对工具进行下载、构建

### 更新阿里云镜像源并安装kubeadm、kubelet、docker

```bash
# kubeadm、kubelet版本我们选择1.28版本，docker版本选择24.0.0版本
yum makecache && yum install -y kubeadm-1.28.0 kubelet-1.28.0 && yum install -y docker-ce-24.0.0
# 查找工具
yum list installed | grep docker        # 查找docker组件
yum list installed | grep kubernetes    # 查找k8s组件
# 查找对应依赖
yum deplist xxx                                         # 提前记录依赖包名
yum install yum-plugin-downloadonly                     # 安装构建rpm包工具
yum reinstall --downloadonly --downloaddir=/root xxx    # 将相关工具及依赖包下载至/root目录下
# 下载cri-dockerd作为工具间配合协作
cd /root && wget <https://github.com/Mirantis/cri-dockerd/releases/download/v0.3.2/cri-dockerd-0.3.2-3.el7.x86_64.rpm>
yum localinstall -y ./cri-dockerd-0.3.2-3.el7.x86_64.rpm  # 安装cri-dockerd工具
# 编辑cri-dockerd服务配置
vim /usr/lib/systemd/system/cri-docker.service
ExecStart=/usr/bin/cri-dockerd --container-runtime-endpoint fd:// # 修改这段内容
ExecStart=/usr/bin/cri-dockerd --container-runtime-endpoint fd:// --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.9 # 修改为这样

```

### 检查工具的rpm包及依赖已经下载完成后，测试环境启动K8s与docker、cri-dockerd服务

```bash
systemctl enable docker && systemctl enable cri-docker && systemctl enable kubelet.service
# 重启操作系统
reboot
# 重启后检查docker及cri-dockerd服务运行状态
systemctl status docker     # 验证存活
systemctl status cri-docker # 验证存活
# kubelet服务目前暂未初始化，服务应该是处于down的状态，不需要检查

```

---

### 接下来，我们需要在测试环境初始化K8s所需的镜像

```bash
# 镜像初始化
kubeadm config images pull --image-repository=registry.aliyuncs.com/google_containers --cri-socket
# 初始化完成不会有反馈，需要以下命令检查初始化情况
docker images
# 创建镜像保存目录
mkdir /root/kubernetes
# 将下载的容器镜像保存到目录中，注意记录[IMAGE ID]编号，非常有用
docker save [IMAGE ID] > /root/kubernetes/kube-apiserver.tar
docker save [IMAGE ID] > /root/kubernetes/kube-scheduler.tar
docker save [IMAGE ID] > /root/kubernetes/kube-controller-manager.tar
docker save [IMAGE ID] > /root/kubernetes/kube-proxy.tar
docker save [IMAGE ID] > /root/kubernetes/etcd.tar
docker save [IMAGE ID] > /root/kubernetes/coredns.tar
docker save [IMAGE ID] > /root/kubernetes/pause.tar
# 之后可以在测试环境尝试搭建master节点，以部署flannel、calico网络插件容器、dashboard容器等
# 用同样的方式导出容器镜像，在生产环境离线部署时会用到

```

---

### `生产环境` 离线部署Kubernetes

### 注意：离线部署也需要将基础环境进行调优

### 调优动作完成后，我们需要将测试环境下载在/root目录下的所有rpm包、下载在/root/kubernetes所有tar包上传至服务器进行本地化安装

```bash
# 假设上传位置与测试环境相同
cd /root
yum localinstall -y ./*         # 本地化安装kubeadm、kubelet、docker、cri-dockerd
rpm -Uvh *.rpm --nodeps --force # 不考虑依赖的可以尝试这条命令安装
# 同步修改cri-dockerd服务配置
vim /usr/lib/systemd/system/cri-docker.service
ExecStart=/usr/bin/cri-dockerd --container-runtime-endpoint fd:// # 将这段内容
ExecStart=/usr/bin/cri-dockerd --container-runtime-endpoint fd:// --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.9 # 修改为这样
# 启用服务
systemctl enable docker && systemctl enable cri-docker && systemctl enable kubelet.service

```

### 工具安装完成后我们需要离线导入容器镜像

```bash
cd /root/kubernetes
docker load < ./kubernetes/kube-apiserver.tar
docker load < ./kubernetes/kube-scheduler.tar
docker load < ./kubernetes/kube-controller-manager.tar
docker load < ./kubernetes/kube-proxy.tar
docker load < ./kubernetes/etcd.tar
docker load < ./kubernetes/coredns.tar
docker load < ./kubernetes/pause.tar
# 容器镜像导入完成后，docker是不清楚容器信息的，所以我们得重新编写tag
docker tag [IMAGE ID] registry.aliyuncs.com/google_containers/kube-apiserver:v1.28.14
docker tag [IMAGE ID] registry.aliyuncs.com/google_containers/kube-scheduler:v1.28.14
docker tag [IMAGE ID] registry.aliyuncs.com/google_containers/kube-controller-manager:v1.28.14
docker tag [IMAGE ID] registry.aliyuncs.com/google_containers/kube-proxy:v1.28.14
docker tag [IMAGE ID] registry.aliyuncs.com/google_containers/etcd:3.5.9-0
docker tag [IMAGE ID] registry.aliyuncs.com/google_containers/coredns:v1.10.1
docker tag [IMAGE ID] registry.aliyuncs.com/google_containers/pause:3.9

```

---

### 进行到此没有出现报错，工具的安装与控制平面镜像的部署算是完成了

### 接下来，我们需要对集群的部署进行操作