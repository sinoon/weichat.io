# 千里之行始于足下
## 需求

* 潜在用户可以通过扫描二维码等方式，关注微信服务号。
* 在关注微信号的第一时间，用户会收到一个推送，描述公司产品等信息。
    * 或者，在这之后，会给用户发送一个链接用于用户绑定会员号。
* 在关注微信服务号之后，用户可以通过菜单或者发送“菜单”方式，活取以下内容：
    1. 公司的产品（或者叫套餐）
    2. 公司介绍。
    3. 会员个人信息。
* 查看公司产品之后，用户可以进行下单操作。
* 进入下单页面，用户填写各项信息，之后，用户会被引导至微信支付页面。
* 在微信支付页面，页面下单完成，用户将会被引导至下单成功的页面，这个页面是属于用户信息页面中的子页面。
* 公司后台页面
    * 登录
    * 查看订单信息
    * 修改订单状态，在修改订单状态的时候，同时会向用户发送推送。

## 需求产生的页面

0. 推送的信息页面，该页面将会呈现“关于公司”的一些信息。
1. 公司产品信息页面。
2. 绑定会员号页面。
3. 用户下单页面。
4 用户个人信息页面。
    * 个人信息。
        * 送货地址
        * 积分
        * 联系方式
        * 待补充
    * 订单信息
        * 完成的订单
        * 未完成的订单
5. 后台管理页面
    * 登录页面
    * 查看、修改订单页面
    * 查看用户信息页面
        * 用户各项状态
        * 与订单的关联
    * 修改或者增加商品、套餐的页面

以上，暂时只想到这些。

看到请补充。

---
## 尚需要讨论

* 服务范围
* 由需求产生的实际行为：
    * 微信服务号注册
    * 租用阿里云服务器
    * 部署运行环境