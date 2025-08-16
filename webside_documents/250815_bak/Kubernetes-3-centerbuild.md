---
title: CentOS7离线部署K8s_集群部署
abbrlink: 16223
date: 2023-04-04 13:11:45
---

### 本文主要针对集群部署进行解析

#### 阶段目录

| 工具名 | 作用 |
| :------: | :------: |
| 第一部分 | [环境调优](https://cyber-mobile.net/s/Kubernetes-1-infrastructure.html#) |
| 第二部分 | [安装工具](https://cyber-mobile.net/s/Kubernetes-2-installtools.html#) |
| 第三部分 | [`集群部署`](https://cyber-mobile.net/s/Kubernetes-3-centerbuild.html#) |
| 第四部分 | [插件管理](https://cyber-mobile.net/s/Kubernetes-4-plugin.html#) |

---

### 集群的部署大致来看分为两种：
#### ①单Master核心节点+多Workers工作节点
#### ②多MasterHA核心节点+多Workers工作节点
##### 如果仅仅普通业务，用①方案就可以了，但如果是比较复杂的业务需要复杂节点体系则需要②方案
##### 根据您的业务体量进行选择，本章节偏向与以②方案进行讲解，有人能让您理解得更加全面，假设节点情况如下：

| Master节点 | 10.0.0.4 | 虚拟IP |
| :------: | :------: | :------: |
| Master1 | 10.0.0.1 | 物理IP |
| Master2 | 10.0.0.2 | 物理IP |
| Master3 | 10.0.0.3 | 物理IP |
| Worker1 | 10.0.0.5 | 物理IP |
| Worker2 | 10.0.0.6 | 物理IP |
| Worker3 | 10.0.0.7 | 物理IP |

### 多MasterHA核心节点+多Workers工作节点方案需要在部署前起HA高可用，此时不管Master1/2/3哪一台或二台设备出现宕机，kubectl依旧能保持正常工作，如果三台设备同时宕机，相应的Master节点才会完全下线

---

#### 高可用的部署同样也是有几种方案，比如：KubeHA、HAProxy+Keepalived等
##### 这部分主要以HAProxy+Keepalived这种比较传统的方式进行讲解

``` bash
# 首先，请在测试环境构建这几个工具的rpm包
yum reinstall --downloadonly --downloaddir=/root keepalived haproxy psmisc ipset ipvsadm
# 其次，将构建的rpm包上传至服务器进行本地化部署
rpm -ivh ./*.rpm
```

##### 修改haproxy.cfg配置文件

``` bash
# 配置文件每个Master节点主机都必须一致
cat > /etc/haproxy/haproxy.cfg << EOF
global

    log         127.0.0.1 local2

    chroot      /var/lib/haproxy
    pidfile     /var/run/haproxy.pid
    maxconn     4000
    user        haproxy
    group       haproxy
    daemon

    stats socket /var/lib/haproxy/stats

defaults
  log global
  option  httplog
  option  dontlognull
        timeout connect 5000
        timeout client 50000
        timeout server 50000

frontend kube-apiserver
    bind *:6445
    mode tcp
    option tcplog
    default_backend kube-apiserver

backend kube-apiserver
    mode tcp
    option tcplog
    option tcp-check
    balance roundrobin
    default-server inter 10s downinter 5s rise 2 fall 2 slowstart 60s maxconn 250 maxqueue 256 weight 100
    server master1 10.0.0.1:6443 check                 # 修改为Master节点1的主机名及IP地址
    server master2 10.0.0.2:6443 check                 # 修改为Master节点2的主机名及IP地址
    server master3 10.0.0.3:6443 check                 # 修改为Master节点2的主机名及IP地址
EOF
```

##### 修改keepalived.conf配置文件并授权生效

``` bash
# 配置文件每个Master节点根据自身实际情况对注释部分进行调整修改
cat > /etc/keepalived/keepalived.conf << EOF
global_defs {
  notification_email {
  }
  router_id LVS_DEVEL
  vrrp_skip_check_adv_addr
  vrrp_garp_interval 0
  vrrp_gna_interval 0
}

vrrp_script chk_haproxy {
  script "killall -0 haproxy"
  interval 2
  weight 2
}

vrrp_instance haproxy-vip {
  state MASTER              # 此处Master节点1使用，Master节点2/3使用BACKUP
  priority 100              # 此处Master节点1使用，Master节点2/3使用99/98
  interface ens192          # 网卡修改为节点实际的网卡
  virtual_router_id 60
  advert_int 1
  authentication {
    auth_type PASS
    auth_pass 1111
  }
  unicast_src_ip 10.0.0.1   # 此处Master节点1使用的物理地址
  unicast_peer {
    10.0.0.2                # 此处为同级节点Master节点2的物理地址
    10.0.0.3                # 此处为同级节点Master节点3的物理地址
  }

  virtual_ipaddress {
    10.0.0.4/24             # 设置虚拟IP地址
  }

  track_script {
    chk_haproxy
  }
}
EOF
# 授权每个Master节点服务开机自启动
systemctl restart haproxy && systemctl enable haproxy
systemctl restart keepalived && systemctl enable keepalived
reboot
# 每个Master节点重启后可以进行保活测试，虚拟IP出现漂移则配置生效
systemctl stop haproxy
```

---

#### 高可用已经启用后部署Master主节点（如果是单Master环境的可以跳过上面那步）
``` bash
# 进入 Master1 节点，并通过
ip addr # 确认当前虚拟IP为当前节点上
# 主节点部署
kubeadm init \
    --apiserver-advertise-address=10.0.0.4 \
    --image-repository=registry.aliyuncs.com/google_containers \
    --kubernetes-version=v1.28.14 \
    --pod-network-cidr=192.168.0.0/24 \
    --service-cidr=172.31.0.0/24 \
    --cri-socket unix:///var/run/cri-dockerd.sock \
    --ignore-preflight-errors=all \
    --v=5

# 如果部署过程报错，请检查/etc/hosts文件是否进行正确解析
# 部署完成需要在节点上正确调用配置信息才能使用kubectl进行查看，请依次执行：
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
cp /etc/kubernetes/admin.conf ~/.kube/config # 核心节点
# 查看集群环境是否已指定Vip
kubectl -n kube-system get cm kubeadm-config -o yaml | grep -C 3 controlPlaneEndpoint
# 无打印反馈信息则需要追加部署虚拟IP
kubectl -n kube-system edit cm kubeadm-config
    apiVersion: kubeadm.k8s.io/v1beta3
    certificatesDir: /etc/kubernetes/pki
    clusterName: kubernetes
    controlPlaneEndpoint: 10.0.0.4:6443 # 设置为高可用的虚拟IP
    controllerManager: {}
    dns: {}
    etcd:
# 追加配置完成后建议优先部署flannel或者calico网络插件，本章节不涉及网络插件部署
# 配置etcd集群
nano /etc/kubernetes/manifests/etcd.yaml
- --initial-cluster=master1=https://10.0.0.1:2380,master2=https://10.0.0.2:2380,master3=https://10.0.0.3:2380,master=https://10.0.0.4:2380
cat /etc/kubernetes/manifests/etcd.yaml | grep initial-cluster # 验证修改
# 部署etcdctl工具检查etcd集群状态
cd root
# 工具下载可以在测试环境进行，下载好了再上传至服务器
wget https://github.com/etcd-io/etcd/releases/download/v3.5.16/etcd-v3.5.16-linux-amd64.tar.gz
tar –xvf etcd-v3.5.16-linux-amd64.tar.gz
cp etcd-v3.5.16-linux-amd64/etcd* /usr/local/bin
# 查看集群配置
etcdctl --cert /etc/kubernetes/pki/etcd/peer.crt \
    --key /etc/kubernetes/pki/etcd/peer.key \
    --cacert /etc/kubernetes/pki/etcd/ca.crt member list
# 验证集群配置
etcdctl -w table --cert /etc/kubernetes/pki/etcd/peer.crt --key /etc/kubernetes/pki/etcd/peer.key --cacert /etc/kubernetes/pki/etcd/ca.crt \
    --endpoints=https://10.0.0.4:2379,https://10.0.0.2:2379,https://10.0.0.3:2379 endpoint status --cluster

# 重新生成集群token
kubeadm token create --print-join-command
# 生成控制平台key
kubeadm init phase upload-certs --upload-certs
```

#### 节点Master2和Master3同步加入集群
``` bash
# 加入集群
kubeadm join 10.0.0.1:6443 --token 7dlwe3.xxx \
        --discovery-token-ca-cert-hash sha256:xxx \
        --control-plane --certificate-key xxx \
        --cri-socket unix:///var/run/cri-dockerd.sock \
        --ignore-preflight-errors=all \
        --v=5

# 加入完成还需依次执行：
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
cp /etc/kubernetes/admin.conf ~/.kube/config
# 修改etcd配置
nano /etc/kubernetes/manifests/etcd.yaml
- --initial-cluster=master1=https://10.0.0.1:2380,master2=https://10.0.0.2:2380,master3=https://10.0.0.3:2380,master=https://10.0.0.4:2380
```

---

#### 工作节点加入集群
``` bash
# 加入集群
kubeadm join 10.0.0.1:6443 --token 7dlwe3.xxx \
        --discovery-token-ca-cert-hash sha256:xxx \
        --cri-socket unix:///var/run/cri-dockerd.sock \
        --ignore-preflight-errors=all \
        --v=5

# 加入完成还需依次执行：
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/kubelet.conf  $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
cp /etc/kubernetes/kubelet.conf ~/.kube/config
```

---

#### 以上便是本章节全部内容
##### [下一章-第四部分-插件管理](https://cyber-mobile.net/s/Kubernetes-4-plugin.html#)