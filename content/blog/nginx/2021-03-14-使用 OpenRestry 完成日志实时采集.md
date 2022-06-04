---
title: 使用 OpenResty 完成日志实时采集
date: 2021-03-14 21:29:40
category:
  - OpenResty
  - Nginx
  - Lua
---

## 简介

OpenResty 是由 Nginx 核心加很多第三方模块组成，默认集成了 Lua 开发环境，使得 Nginx 可以作为一个 Web Server 使用。借助于 Nginx 的事件驱动模型和非阻塞 IO，可以实现高性能的 Web 应用程序。而且 OpenResty 提供了大量组件如 Mysql、Redis、Memcached 等等，使在 Nginx 上开发 Web 应用更方便更简单。可以理解成 openresty 是 Nginx 的超级加强版。

对于线上大流量服务或者需要上报日志的 Nginx 服务，每天会产生大量的日志，这些日志非常有价值。可用于计数上报、用户行为分析、接口质量、性能监控等需求。但传统 Nginx 记录日志的方式数据会散落在各自 Nginx 上，而且大流量日志本身对磁盘也是一种冲击。我们需要把这部分 Nginx 日志统一收集汇总起来，收集过程和结果需要满足如下需求，支持不同业务获取数据，如监控业务，数据分析统计业务，推荐业务等。甚至前端埋码收集的数据可以用 Nginx 处理后推送到下游服务。

> [官方文档](https://openresty.org/cn/installation.html)

## 安装

安装直接参考官网即可，这里只做简单总结

- MAC

  mac 推荐使用 homebrew

  ```bash
  brew update
  brew install pcre openssl
  brew install openresty/brew/openresty
  ```

- Centos

  - 包管理安装

    [官方文档](https://openresty.org/cn/linux-packages.html#centos)

    ```bash
    sudo yum-config-manager --add-repo https://openresty.org/yum/cn/centos/OpenResty.repo
    sudo yum install openresty
    ```

  - 源码安装

    1. 下载依赖包

       ```bash
       yum install -y perl pcre-devel openssl openssl-devel gcc curl
       ```

    2. 下载解压源码包

       ```bash
       wget https://openresty.org/download/openresty-1.19.3.1.tar.gz
       tar -xzvf openresty-1.19.3.1.tar.gz # 解压
       cd openresty-1.19.3.1.tar.gz/ # 切换到目录
       ```

    3. 配置激活的组件

       ```bash
        ./configure --help # 查看更多的选项
        --prefix=[install_path] # 指定安装目录（默认为/usr/local/openresty）
        --with-[Components name] # 激活组件
        --without-[Components name] # 则是禁止组件。
       ```

       如下命令

       ```bash
       # OpenResty 将配置安装在 /opt/openresty 目录下（注意使用 root 用户）,并激活luajit、http_iconv_module 并禁止 http_redis2_module 组件
       ./configure --prefix=/opt/openresty\
          --with-luajit\
          --without-http_redis2_module \
          --with-http_iconv_module
       ```

    4. 编译安装

       在上一步中，最后没有什么 error 的提示就是最好的。若有错误，最后会显示 具体原因可以看源码包目录下的 build/nginx-VERSION/objs/autoconf.err 文件查看。

       ```bash
         gmake # 编译
         gmake install # 安装
       ```

    5. 设置环境变量

       ```bash
        # 这里注意安装目录
        echo 'export PATH="$PATH:/opt/openresty/nginx/sbin"' >> /etc/profile

        # 重载环境变量
        source /etc/profile
       ```

- Docker

  [Docker 安装与配置 OpenRestry](/blog/docker-open-resty-installation-and-configuration)

## 搭配 Kafka

安装 lua-resty-kafka，因为我们需要将数据通过 nginx+lua 脚本转发到 Kafka 中，编写 Lua 脚本时需要用到 Lua 模块中的一些关于 Kafka 的依赖。

```bash
# 下载 lua-resty-kafka
cd /opt/openresty/
mkdir module
wget https://github.com/doujiang24/lua-resty-kafka/archive/master.zip
unzip master.zip -d /opt/openresty/module  # 解压到 /opt/openresty/module


# 拷贝 kafka 相关依赖脚本到 openresty
cp -rf /opt/module/lua-resty-kafka-master/lib/resty/kafka/ /opt/openresty/lualib/resty/
```

- 配置

  ```conf
  # 在默认配置文件中
  include /www/conf/*.conf;
  ```

  我的配置文件

  ```conf:title=/www/conf/kafka.conf
    # 插件地址
    lua_package_path "/opt/openresty/lualib/resty/kafka/?.lua;;";
    lua_package_cpath "/opt/openresty/lualib/?.so;;";

    lua_shared_dict ngx_cache 128m;  # cache
    lua_shared_dict cache_lock 100k; # lock for cache

    server {
        listen       8887; #监听端口
        server_name  192.168.3.215;
        # root指令用于指定虚拟主机的网页根目录，这个目录可以是相对路径，也可以是绝对路径。
        root         html;
        lua_need_request_body on; # 打开获取消息体的开关，以便能获取到消息体

        access_log /var/log/nginx/message.access.log  main;
        error_log  /var/log/nginx/message.error.log  notice;

        location = /api/message {
            lua_code_cache on;
            charset utf-8;
            default_type 'application/json';
            content_by_lua_file "/www/lua/msg.lua"; # 引用的lua脚本
        }
    }
  ```

  ```lua:title=/www/lua/msg.lua
    -- require 需要 resty.kafka.producer 的 lua 脚本，没有会报错
    local producer = require("resty.kafka.producer")

    -- kafka 的集群信息，单机也是可以的
    local broker_list = {
        {host = "192.168.3.215", port = 9092},
    }

    -- 定义最终 kafka 接受到的数据是怎样的 json格式
    local log_json = {}
    --增加 read_body 之后即可获取到消息体，默认情况下可能会是nil
    log_json["body"] = ngx.req.read_body()
    log_json["body_data"] = ngx.req.get_body_data()

    -- 定义kafka同步生产者，也可设置为异步 async
    -- -- 注意！！！当设置为异步时，在测试环境需要修改batch_num,默认是200条，若大不到200条kafka端接受不到消息
    -- -- encode()将log_json日志转换为字符串
    -- -- 发送日志消息,send配套之第一个参数topic:
    -- -- 发送日志消息,send配套之第二个参数key,用于kafka路由控制:
    -- -- key为nill(空)时，一段时间向同一partition写入数据
    -- -- 指定key，按照key的hash写入到对应的partition

    -- -- batch_num修改为1方便测试
    local bp = producer:new(broker_list, { producer_type = "async",batch_num = 1 })
    -- local bp = producer:new(broker_list)

    local cjson = require("cjson.safe")
    local sendMsg = cjson.encode(log_json)
    local ok, err = bp:send("testMessage",nil, sendMsg)
    if not ok then
      ngx.log(ngx.ERR, 'kafka send err:', err)
    elseif ok then
      ngx.say("the message send successful")
    else
      ngx.say("未知错误")
    end
  ```

  之后重启 Nginx，就不过多赘述了

## 总结

使用 Openresty + Lua + Kafka 就可以将用户的埋点数据实时采集到 kafka 集群中，并且 OpenResty 是基于 Nginx 的，而 Nginx 能处理上万的并发量，所以即使用户的数据在短时间内激增，这套架构也能轻松的应对，不会导致集群崩溃。另一方面，若数据过多导致集群的超负荷，我们也可以随时加多一台机器，非常方便。

## 参考地址

参考如下文章，在服务器上完成服务搭建

[OpenResty(Nginx+Lua)高并发最佳实践](https://blog.csdn.net/lupengfei1009/article/details/86062644)

[Openresty+Lua+Kafka 实现日志实时采集](https://www.cnblogs.com/linzepeng/p/12643158.html)
