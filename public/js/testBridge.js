/**
 * Created by sinoon on 15/8/4.
 */


$(function () {
    var action = $.os.phone ? "tap" : $.os.tablet ? "tap" : "click";

    $("#setData").on(action, function () {
        Bridge.setData({
            a: "我是测试数据",
            b: "我是一段字符串化的json哦"
        })
    });

    $("#getData").on(action, function () {
        Bridge.getData();
    });

    $("#setAlert").on(action, function () {
        var now = parseInt(Date.now() / 1000);
        now += 5;
        Bridge.setAlert(Number(now),"测试信息")
    });

    $("#login").on(action, function () {
        Bridge.login("测试标题", "登录测试内容");
    });

    $("#bindMobile").on(action, function () {
        Bridge.bindMobile("测试标题", "绑定手机号测试内容")
    });

    Bridge.on("pushData", function (data) {
        alert("收到数据："+ data);
    });

    Bridge.on("connected", function () {
        alert("与客户端连接建立！");
    });

    $("#refresh").on(action, function () {
        Bridge.newPage("测试返回刷新页面","http://192.168.1.82:3000/test/testRefresh")
    });

    $("#testInput").on("focus", function () {
        setTimeout(function () {
            Bridge.closeKeyboard();
        },500)
    })
});
