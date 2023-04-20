---
title: Docker 安装与配置 OpenResty
date: 2021-03-10 13:54:47
category:
  - Docker
  - OpenResty
  - Lua
  - Nginx
---

## 安装

```bash
docker run -d --name openresty -p 80:80 -v /root/docker/openresty/conf.d:/etc/nginx/conf.d:Z -v /root/docker/openresty/data:/data openresty/openresty

# 解析上述参数：
# -d 后台运行
# -p 80:80 映射 docker 容器与宿主机端口
# -v /root/docker/openresty/conf.d:/etc/nginx/conf.d:Z 映射宿主机目录 /root/docker/openresty/conf.d 到 docker 容器的目录 /etc/nginx/conf.d

# -v /root/docker/openresty/data:/data 映射宿主机目录 /root/docker/openresty/data 到容器目录 /data

# 可以添加 z 或 Z 选项来修改挂载到容器中的主机文件或目录的 selinux label：
## - z 选项指明 bind mount 的内容在多个容器间是共享的
## - Z 选项指明 bind mount 的内容是私有不共享的
```

上面命令中，OpenResty 容器内的 OpenResty 软件安装在 /usr/local/openresty 目录下，如果想要安装其他的插件，比如 Http 插件可以下载插件放到 /usr/local/openresty/lualib/resty 目录中。

比如要安装 Http 模块：

```bash
# 进入 openresty 容器进入
docker exec -it openresty bash

# 安装 wget 软件
apt update
apt install -y wget

# 进入 /usr/local/openresty/lualib/resty 目录
cd /usr/local/openresty/lualib/resty
# 下载 http 的 lua 包
wget https://raw.githubusercontent.com/pintsized/lua-resty-http/master/lib/resty/http_headers.lua
wget https://raw.githubusercontent.com/pintsized/lua-resty-http/master/lib/resty/http.lua
wget https://raw.githubusercontent.com/pintsized/lua-resty-http/master/lib/resty/http_connect.lua
# 退出容器
exit
```

## Nginx 配置文件

在 `/root/docker/openresty/conf.d` (宿主机目录) 目录下创建 `nginx.conf` 文件，并写入如下内容：

```conf
lua_package_path "/usr/local/openresty/lualib/?.lua;;";
lua_package_cpath "/usr/local/openresty/lualib/?.so;;";

server {
  listen       80;
  server_name  _;

  location /lua {
    default_type 'text/html';
    content_by_lua_file /etc/nginx/conf.d/lua/test.lua;
  }

  location = /api {
    default_type 'text/html';
    content_by_lua_block {
      ngx.say("hhhhhh")
    }
  }
}
```

在 `/root/docker/openresty/conf.d/lua` 目录下创建 `test.lua`

```lua
ngx.say("hello world");
```

## 重启容器

```bash
# 重启 docker
docker restart openresty
# 查看 日志
docker logs -f openresty
```

## 测试

```bash
# 访问映射 url
curl 127.0.0.1:80/lua
# 返回
hello world
```
