---
title: 使用 robots 进行 SEO
date: 2020-11-08 14:05:04
category:
  - HTML
---

## robots 文件的作用

一般来说出于安全的考虑，在网站 SEO 优化时写入 robots.txt 文件，实际上就是告诉搜索引擎蜘蛛，网站上哪些内容允许抓取，哪些内容不允许抓取，这样做可以提高搜索引擎的抓取效率，增加搜索引擎对网站的友好度

## robots.txt 文件的规范写法

文件中的记录通过空行分开，以 CR、CR/NL、or NL 作为结束符。robots.txt 文件中的记录通常以一行或多行 User-agent 开始，后面加上若干 Disallow 和 Allow 行

- `User-agent`

  改字段用于描述搜索引擎蜘蛛的名字，在"Robots.txt"文件中，如果有多条 User-agent 记录说明有多个搜索引擎蜘蛛会受到该协议的限制，对该文件来说，至少要有一条 User-agent 记录。如果该项的值设为*，则该协议对任何搜索引擎蜘蛛均有效，在"Robots.txt"文件中，"User-agent:*"这样的记录只能有一条。

- `Disallow`

  该字段用于描述不希望被访问到的一个 `URL`，这个 `URL` 可以是一条完整的路径，也可以是部分的，任何以 `Disallow` 开头的 `URL` 均不会被 `Robot` 访问到。

  例如：[Disallow:/help]是指禁止搜索引擎蜘蛛抓取 `/help.html` 和 `/help/index.html`；而[Disallow:/help/] 则允许搜索引擎蜘蛛抓取 `/help.html`，不能抓取 `/help/index.html`

- `Allow`

  用于描述希望被访问的一组 `URL`，与 `Disallow` 项相似，这个值可以是一条完整的路径，也可以是路径的前缀，以 `Allow` 项的值开头的 `URL` 是允许 `robot` 访问的。

  例如：[Allow:/hibaidu] 允许搜索引擎蜘蛛抓取 `/hibaidu.htm` 和 `/hibaiducom.html` 和 `/hibaidu/com.html`。一个网站的所有 `URL` 默认是 `Allow` 的，所以 `Allow` 通常与 `Disallow` 搭配使用，实现允许访问一部分网页同时禁止访问其它所有 `URL` 的功能。

  > 注意：`Disallow` 与 `Allow` 行的顺序是有意义的，搜索引擎蜘蛛会根据第一个匹配成功的 `Allow` 或 `Disallow` 行确定是否访问某个 `URL`

- 使用 `*` 和`$`

  `Baiduspider` 支持使用通配符 `_` 和 `$` 来模糊匹配 `url`。`$` 匹配行结束符。`_` 匹配 `0` 或多个任意字符

## robots.txt 文件用法举例

1. 允许所有的 robot 访问

   ```text
    User-agent:*Allow:/或者User-agent:*Disallow:
   ```

2. 禁止所有搜索引擎访问网站的任何部分

   ```text
   User-agent:*
   Disallow:/
   ```

3. 仅禁止 `Baiduspider` 访问

   ```text
   User-agent:Baiduspider
   Disallow:/
   ```

4. 仅允许 `Baiduspider` 访问您的网站

   ```text
   User-agent:Baiduspider
   Disallow:
   ```

5. 禁止 `spider` 访问特定目录

   ```text
   User-agent:*
   Disallow:/cgi-bin/
   Disallow:/tmp/
   Disallow:/~joe/
   ```

6. 允许访问特定目录中的部分 `url`

   ```text
   User-agent:*
   Allow:/cgi-bin/see
   Allow:/tmp/hi
   Allow:/~joe/look
   Disallow:/cgi-bin/
   Disallow:/tmp/
   Disallow:/~joe/
   ```

7. 使用 `*` 限制访问 `url`，禁止访问 `/cgi-bin/` 目录下的所有以 `.htm` 为后缀的 `URL`(包含子目录)

   ```text
   User-agent:*
   Disallow:/cgi-bin/*.htm
   ```

8. 使用 `$` 限制访问 `url`，仅允许访问以 `.htm` 为后缀的 `URL`

   ```text
   User-agent:*
   Allow:.htm$
   Disallow:/
   ```

9. 禁止访问网站中所有的动态页面

   ```text
   User-agent:*
   Disallow:/*?*
   ```

10. 禁止 `Baiduspider` 抓取网站上所有图片，仅允许抓取网页，禁止抓取任何图片

    ```text
    User-agent:Baiduspider
    Disallow:.jpg$
    Disallow:.jpeg$
    Disallow:.gif$
    Disallow:.png$
    Disallow:.bmp$
    ```

11. 仅允许 `Baiduspider` 抓取网页和 `.gif` 格式图片，允许抓取网页和 `gif` 格式图片，不允许抓取其他格式图片

    ```text
    User-agent:Baiduspider
    Allow:.gif$
    Disallow:.jpg$
    Disallow:.jpeg$
    Disallow:.png$
    Disallow:.bmp$
    ```

12. 仅禁止 `Baiduspider` 抓取 `.jpg` 格式图片

    ```text
    User-agent:Baiduspider
    Disallow:.jpg$
    ```

    > 注意：`robots.txt` 是有分大小写的，默认文件名全小写，规则里面要注意区分大小写

13. 在 `robots.txt` 中声明你的 `sitemap` 文件

    在 `robots.txt` 加入如下的一行文字：

    Sitemap:`http://www.demo.com/sitemap.xml`
