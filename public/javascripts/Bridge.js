/**
 * Created by sinoon on 15/8/4.
 */

/**
 * 与客户端通信
 * @type {{init: Function, createConnect: Function, serVersion: Function, checkVersion: Function}}
 */
var Bridge = {

    _event:{},

    connected:false,
    /**
     * 初始化
     */
    init:function(){

        var self = this;

        if(window.qgzsAndroid){

            Bridge.send = function(content){
                window.qgzsAndroid.mesToApp(JSON.stringify(content));
            };
            self.platform = 'android';
            Bridge.checkVersion();
            Bridge.connected = true;
            Bridge.trigger("connected");

            try{
                document.body.scrollTop = 1;
                setTimeout(function () {
                    document.body.scrollTop = 0
                },100)
            } catch(e){

            }

        } else {
            this.createConnect(function (bridge) {

                Bridge.connected = true;
                Bridge.trigger("connected");
                self.platform = 'ios';
                bridge.init(function (message,callback) {
                    return callback("I got it!")
                });

                Bridge.send = bridge.send;
                Bridge.checkVersion();
            })
        }

    },

    /**
     * 建立与IOS的通信连接
     * @param callback
     */
    createConnect: function (callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                callback(WebViewJavascriptBridge)
            }, false)
        }
    },

    send: function (obj) {
        console.dir(obj)
    },

    /**
     * Android客户端调用此函数，设置当前版本号
     * @param version
     */
    setVersion: function (version) {
        this.version = version;
    },

    /**
     * 验证版本
     * 在IOS中，通过回调方式获取
     * 在Android中，客户端会调用Bridge.setVersion()把版本号传递进来
     */
    checkVersion: function () {
        var platform = this.platform;
        switch (platform){
            case "android":
                Bridge.send({
                    action:"checkVersion"
                });
                return;
            case "ios":
                Bridge.send({
                    action:"checkVersion"
                },function(version){
                    Bridge.version = version;
                    //dom.tipBtn.html("点击下载").on("tap",ui.saveQRCode);
                    console.log("Got version : " + version)
                });
                return;
            default :
                console.log("Error type of platform : " + platform)
        }
    },

    versionCompare: function (version) {

        var _version = this.version;

        if(!_version) return -1;

        version = version.split(".");

        _version = _version.split(".");

        version.forEach(function (val,index) {
            version[index] = Number(version[index]);
            _version[index] = Number(_version[index])
        });

        if(version[0] > _version[0] ){
            return 1
        } else if(version[0] < _version[0]){
            return -1
        }

        if(version[1] > _version[1] ){
            return 1
        } else if(version[1] < _version[1]){
            return -1
        }

        if(version[2] > _version[2] ){
            return 1
        } else if(version[2] < _version[2]){
            return -1
        } else {
            return 0
        }

    },

    /**
     * 复制
     * @param copy 复制内容
     */
    copy: function (copy) {
        Bridge.send({
            action:"copy",
            copy:copy
        })
    },

    /**
     * 复制并弹窗
     * @param copy
     * @param title
     * @param content
     * @param iconType
     */
    copyWithAlert: function (copy,title,content,iconType) {
        iconType = iconType || 0;
        Bridge.send({
            action:"copyWithAlert",
            copy:copy,
            title:title,
            content:content,
            iconType:iconType
        })
    },

    /**
     * 复制并弹窗提示是否去微信
     * @param copy 复制的内容
     * @param title 弹窗标题
     * @param content 弹窗内容
     * @param iconType 弹窗的icon样式
     * @param type 用户去微信时，发送请求的类型
     * @param url 用户去微信时，发送请求的url
     * @param data 用户去微信时，发送请求所携带的数据
     */
    copyToWeChat: function (copy,title,content,type,url,data,iconType) {
        iconType = iconType || 0;
        Bridge.send({
            action:"copyToWeChat",
            copy:copy,
            title:title,
            content:content,
            iconType:iconType,
            type:type,
            url:url,
            data:data
        })
    },

    /**
     * 复制并弹窗提示是否去QQ
     * @param copy 复制的内容
     * @param title 弹窗标题
     * @param content 弹窗内容
     * @param iconType 弹窗的icon样式
     * @param type 用户去QQ时，发送请求的类型
     * @param url 用户去QQ时，发送请求的url
     * @param data 用户去QQ时，发送请求所携带的数据
     */
    copyToQQ: function (copy,title,content,type,url,data,iconType) {
        iconType = iconType || 0;
        Bridge.send({
            action:"copyToQQ",
            copy:copy,
            title:title,
            content:content,
            iconType:iconType,
            type:type,
            url:url,
            data:data
        })
    },

    /**
     * 普通弹窗
     * @param title 弹窗的标题
     * @param content 弹窗的内容
     * @param iconType  弹窗的icon样式
     */
    alert: function (title,content,iconType) {
        iconType = iconType || 0;
        Bridge.send({
            action:"alert",
            title:title,
            content:content,
            iconType:iconType
        })
    },

    /**
     * 分享信息到微信朋友圈
     * @param timeLine 分享到朋友圈还是微信好友，true表示朋友圈，false表示微信好友
     * @param type 分享的内容是否为富文本信息，true表示富文本信息，false表示文字信息
     * @param title 分享内容的标题
     * @param content 分享的内容
     * @param imageUrl 分享的图片地址
     * @param targetUrl 用户点开目标链接
     * @param shortUrl 是否转换成短连接
     */
    shareToWeChat: function (timeLine,type,title,content,imageUrl,targetUrl,shortUrl) {
        Bridge.send({
            action:"shareToWeChat",
            timeLine:timeLine,
            type:type,
            title:title,
            content:content,
            imageUrl:imageUrl,
            targetUrl:targetUrl,
            shortUrl:shortUrl
        })
    },

    /**
     * 分享信息到 QQ
     * @param scope 分享的范围，friend:好友，qZone:QQ空间
     * @param title 分享内容的标题
     * @param content 分享的内容
     * @param imageUrl 分享的图片地址
     * @param targetUrl 用户点开目标链接
     * @param shortUrl 是否转换成短连接
     */
    shareToQQ: function (scope,title,content,imageUrl,targetUrl,shortUrl) {
        Bridge.send({
            action:"shareToQQ",
            scope:scope,
            title:title,
            content:content,
            imageUrl:imageUrl,
            targetUrl:targetUrl,
            shortUrl:shortUrl
        })
    },

    /**
     * 打开一个新页面
     * @param title
     * @param url
     */
    newPage: function (title,url) {
        Bridge.send({
            action:"newPage",
            title:title,
            url:url
        })
    },

    /**
     * 下载图片
     * @param url
     * @param imageName
     */
    saveImage:function(url,imageName){
        Bridge.send({
            action:"saveImage",
            url:url,
            imageName:imageName
        })
    },

    /**
     * 当用户点击“关注”按钮的时候触发，一旦触发，就会开始下载图片
     * @param url
     */
    preSaveImage: function (url) {
        Bridge.send({
            action:"preSaveImage",
            url:url
        })
    },

    /**
     * 预分享信息
     * @param title 分享的标题
     * @param content 分享的内容
     * @param imageUrl 分享的图片链接
     * @param targetUrl 分享的目标链接
     * @param shortUrl 是否转换成短连接
     */
    preShare: function (title,content,imageUrl,targetUrl,shortUrl) {
        Bridge.send({
            action:"shareInfo",
            title:title,
            content:content,
            imageUrl:imageUrl,
            targetUrl:targetUrl,
            shortUrl:shortUrl
        })
    },

    on: function (eventName,fn) {
        if(typeof eventName != "string") return;

        var self = this;

        eventName = eventName.split(" ");

        eventName.forEach(function (val) {
            self._event[val] = self._event[val] || [];

            if(typeof fn == "function"){
                self._event[val].push(fn)
            }
        })
    },

    trigger: function (eventName) {
        if(typeof eventName != "string") return;

        var args = Array.prototype.slice.call(arguments);
        args.shift();

        var eventList = this._event[eventName];
        if( eventList instanceof Array){
            eventList.forEach(function (val) {
                val.apply(null,args);
            })
        }
    },

    /**
     * 一键加群
     * @param qun
     * @param iosKey
     * @param androidKey
     */
    joinGroup: function (qun,iosKey,androidKey) {
        Bridge.send({
            action:"joinGroup",
            qun:qun,
            iosKey:iosKey,
            androidKey:androidKey
        })
    },

    /**
     * 设置客户端存储数据
     * @param data
     */
    setData: function (data) {
        Bridge.send({
            action:"setData",
            data:JSON.stringify(data)
        })
    },

    /**
     * 请求客户端将保存的数据交给页面
     */
    getData: function () {
        Bridge.send({
            action:"getData"
        })
    },

    /**
     * 客户端设置数据
     * @param data
     */
    pushData: function (data) {
        this.data = data;
        this.trigger("pushData", data)
    },

    /**
     * 设置提醒时间与提醒内容
     * @param time
     * @param content
     */
    setAlert: function (time,content) {
        this.send({
            action:"setAlert",
            time:time,
            content:content
        })
    },

    /**
     * 弹窗并让用户选择去登录
     * @param title
     * @param content
     */
    login: function (title,content) {
        this.send({
            action:"login",
            title:title,
            content:content
        })
    },

    /**
     * 弹窗让用户绑定手机号
     * @param title
     * @param content
     */
    bindMobile: function (title,content) {
        this.send({
            action:"bindMobile",
            title:title,
            content:content
        })
    },

    /**
     * 刷新之前的页面
     */
    refreshBeforePage: function () {
        this.send({
            action:"refreshBeforePage"
        })
    },

    /**
     * 关闭软键盘
     */
    closeKeyboard: function () {
        this.send({
            action:"closeKeyboard"
        })
    }
};

Bridge.init();