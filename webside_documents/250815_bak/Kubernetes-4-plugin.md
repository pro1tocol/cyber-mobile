---
title: CentOS7离线部署K8s_插件管理
abbrlink: 16224
date: 2023-04-04 13:11:45
---

### 本文主要针对控制平台各项必备插件进行部署管理

#### 阶段目录

| 工具名 | 作用 |
| :------: | :------: |
| 第一部分 | [环境调优](https://cyber-mobile.net/s/Kubernetes-1-infrastructure.html#) |
| 第二部分 | [安装工具](https://cyber-mobile.net/s/Kubernetes-2-installtools.html#) |
| 第三部分 | [集群部署](https://cyber-mobile.net/s/Kubernetes-3-centerbuild.html#) |
| 第四部分 | [`插件管理`](https://cyber-mobile.net/s/Kubernetes-4-plugin.html#) |

---

### 如果之前部署操作存在错误，可以清空集群配置重新部署

``` bash
# 在每个节点上清空所有配置
kubeadm reset --cri-socket unix:///var/run/cri-dockerd.sock
reboot # 重启节点
```

---

### 如果之前的配置无误，那么咱们继续进行插件部署
#### 首先需要去除Master节点的污点，以保证网络插件的部署

``` bash
kubectl get no -o yaml | grep taint -A 5 # 查看污点信息，注意返回的key值如下：
key: node.kubernetes.io/not-ready

kubectl taint nodes --all  node.kubernetes.io/not-ready- # 注意-字符，去除后键入检查
```

---

### 部署网络插件flannel
#### 测试环境下载配置文件

``` bash
wget https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
vim ./kube-flannel.yml
# 修改配置信息
  net-conf.json: |
    {
      "Network": "192.168.0.0/24",
      "EnableNFTables": false,
      "Backend": {
        "Type": "vxlan"
      }
# 将修改后的配置文件上传至服务器
# 因为网络插件主要是给Pod使用，因此需要修改为pod-network-cidr相应的网段
kubectl apply -f ./kube-flannel.yml # 应用配置，docker将会调用相应的镜像并创建容器生成Pod
kubectl get pods -A -n kube-flannel # 可以查看生成的Pod运行情况，出现1/1 runing则代表成功
# 启用ipvs，注意第一部分需要内核已成功开启ipvs
kubectl -n kube-system edit cm kube-proxy # 进入编辑模式，加入ipvs
    metricsBindAddress: ""
    mode: "ipvs"
    nodePortAddresses: null
# 重启pod生效
kubectl delete pods -l k8s-app=kube-proxy -n kube-system
```

### 部署网络插件calico
#### 因为是容器部署，所以使用tigera/operator 1.30.4版本以及calico 3.26.1版本进行部署，同步测试环境下载配置文件

``` bash
wget https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/tigera-operator.yaml
wget https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/custom-resources.yaml
mv tigera-operator.yaml kube-calico-tigera-operator.yaml && mv custom-resources.yaml kube-calico-custom-resources.yaml
vim ./kube-calico-custom-resources.yaml
  calicoNetwork:
    # Note: The ipPools section cannot be modified post-install.
    ipPools:
    - blockSize: 26
      cidr: 192.168.0.0/24
      encapsulation: VXLANCrossSubnet
      natOutgoing: Enabled
      nodeSelector: all()
# 将没修改的文件与修改后的配置文件上传至服务器
# 修改逻辑同样是pod-network-cidr相应的网段
kubectl apply -f ./kube-calico-tigera-operator.yaml     # 生成模板Pod
kubectl apply -f ./kube-calico-custom-resources.yaml    # 生成插件Pod
kubectl get pods -A -n kube-flannel # 可以查看生成的Pod运行情况，出现1/1 runing则代表成功
```

### 部署前端管理插件kubernetes-dashboard
#### 测试环境下载配置文件

``` bash
wget https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
# 修改部署节点
kind: Deployment
...
    spec:
      nodeName: master1                                 # 指定运行的node,必须为master任意节点
      securityContext:
        seccompProfile:
          type: RuntimeDefault
# 修改内容可以考虑为nodeSelector方法，为节点预先打好标签就行，更推荐这种方式
# 将修改后的配置文件上传至服务器
kubectl apply -f ./recommended.yaml                     # 生成插件Pod
kubectl get pods -A -n kube-flannel # 可以查看生成的Pod运行情况，出现1/1 runing则代表成功
watch -n 1 -c "kubectl get all -n kubernetes-dashboard && kubectl get node -o wide && kubectl get pods -A -o wide" # 查看部署情况
```

##### 浏览器输入 https://[master1_ip]:[port] 即可访问前端管理页面
##### 至此，必备插件搭建完毕，如后期还有组件如crictl、helm等工具再另写文章
### 以上便是本章节全部内容，感谢阅读