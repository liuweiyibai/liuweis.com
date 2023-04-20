---
title: Linux 安装 Nginx
date: 2017-01-05 12:00:00
category:
  - Linux
  - Nginx
---

Nginx 是一款轻量级的网页服务器、反向代理服务器。相较于 `Apache` 、 `lighttpd` 具有占有内存少，稳定性高等优势。它最常的用途是提供反向代理服务

## 使用 yum 安装

当使用以下命令安装 Nginx 时，发现无法安装成功，需要做一点处理

```bash
yum install -y nginx
```

1. 添加 Nginx 镜像地址到 `yum` 源

   ```bash
   sudo rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
   ```

2. 安装 Nginx

   ```bash
   sudo yum install -y nginx
   ```

3. 启动 Nginx

   ```bash
   sudo systemctl start nginx.service
   ```

   > 如果一些顺利的话，通过 `ip` 即可访问默认页面
   > 如果访问不到，服务停止：可能需要打开 `80` 端口，`阿里云主机`可以通过`安全组策略`默认配置`入站规则`

4. 开放 `80` 端口

   ```bash
   ##Add
   firewall-cmd --permanent --zone=public --add-port=80/tcp
   ##Reload
   firewall-cmd --reload
   ```

5. 添加开机启动

   ```bash
   sudo systemctl enable nginx.service
   ```

## 查看默认安装目录

输入命令：

```bash
whereis nginx
# nginx: /usr/sbin/nginx /usr/lib64/nginx /etc/nginx /usr/share/nginx
```

## 编译安装

> 安装需知：首先安装必要的库（ Nginx 中 `gzip` 模块需要 `zlib` 库， `rewrite` 模块需要 `pcre` `库，ssl` 功能需要 `openssl` 库）。选定`/usr/local`为安装目录

- 安装环境

  非必须操作，如果是新装机系统需要重新安装环境

  ```bash
  yum install -y gcc gcc-c++
  ```

- 安装 `PCRE` 库

  ```bash
  # path
  cd /usr/local/

  # 下载
  wget http://jaist.dl.sourceforge.net/project/pcre/pcre/8.33/pcre-8.33.tar.gz

  # 解压
  tar -zxvf pcre-8.33.tar.gz

  # 切换到解压目录
  cd pcre-8.33

  # 执行安装
  ./configure

  # 编译 & 安装
  make && make install
  ```

- 安装 `ssl` 库

  ```bash
  cd /usr/local/
  wget http://www.openssl.org/source/openssl-1.0.1j.tar.gz
  tar -zxvf openssl-1.0.1j.tar.gz
  cd openssl-1.0.1j
  ./config
  make && make install
  ```

- 安装 `zlib`

  ```bash
  cd /usr/local/
  wget http://zlib.net/zlib-1.2.11.tar.gz
  tar -zxvf zlib-1.2.11.tar.gz
  cd ./zlib-1.2.11
  ./configure
  make && make install
  ```

- 安装 Nginx

  ```bash
  cd /usr/local/
  wget http://nginx.org/download/nginx-1.8.0.tar.gz
  tar -zxvf nginx-1.8.0.tar.gz
  cd nginx-1.8.0
  ./configure --prefix=/usr/local/nginx --with-pcre=/usr/local/src/pcre-8.33 --with-zlib=/usr/local/src/zlib-1.2.11 --with-openssl=/usr/local/src/openssl-1.0.1j
  $ make && make install
  ```

- 启动 Nginx

  ```bash
  # 启动
  /usr/local/nginx/sbin/nginx

  # 重启
  /usr/local/nginx/sbin/nginx –s reload

  # 测试配置文件是否正常
  /usr/local/nginx/sbin/nginx –t

  # 强制关闭
  pkill nginx
  ```

- 添加到环境变量

  ```bash
  export NGINX_HOME=/usr/local/nginx
  export PATH=$PATH:$NGINX_HOME/sbin
  ```

### nginx 编译后新增模块

- 停止 Nginx

  ```bash
  # 查询nginx主进程号
  ps -ef | grep nginx

  # 从容停止Nginx：
  kill -QUIT 主进程号

  # 快速停止Nginx：
  kill -TERM 主进程号

  # 强制停止Nginx：
  pkill -9 nginx
  ```

- 查看 Nginx 原有模块

  ```bash
  nginx -V
  # configure arguments: --prefix=/usr/local/nginx --with-http_stub_status_module
  ```

- 重新配置 `ssl` 模块

  ```bash
  # 找到源码包
  ./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
  # 然后执行
  make
  # 切记不要make install ，make install 是覆盖安装
  ```

- 替换已经安装好的 Nginx 包

  ```bash
  # 先备份
  cp /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx.bak
  # 将编译好的 nginx 复制到前面的安装目录
  cp ./objs/nginx /usr/local/nginx/sbin/

  # 查看 nginx 模块
  configure arguments: --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
  # 启动
  ```

### 安装完成

- 启动
- 修改配置文件
- 测试配置文件是否正常
- 重启等

## 常用命令

```bash
# 启动 nginxs
# 启动 nginx 后后面的命令才可以生效
nginx
nginx -s reopen  # 重新打开日志文件
nginx -t -c /path/to/nginx.conf # 测试nginx配置文件是否正确 -c 指定文件

# 关闭nginx
nginx -s stop # 快速停止nginx
nginx -s quit # 完整有序的停止nginx

# 一些查看操作

nginx -v # 查看版本
nginx -V # 信息比小v要全，会展示安装路径以及一些类库的配置信息
nginx -t # 查询获取nginx的当前正在使用的配置文件的路径
nginx -c # 运行nginx -c是指定nginx配置文件目录 不加默认是nginx安装目录的配置文件

nginx -t # 查看 Nginx 配置文件地址，测试所有配置文件
ps -ef | grep nginx # nginx 安装目录
nginx -c # 运行nginx -c是指定nginx配置文件目录 不加默认是nginx安装目录的配置文件
nginx -s start # 启动
nginx -s reload # 修改配置文件之后重启
```

## 参考文档

[参考地址 1](http://www.nginx.cn/instal)

[参考地址 2](https://www.cnblogs.com/kaid/p/7640723.html)

[参考地址 3](https://www.cnblogs.com/gscq073240/articles/6773000.html)
