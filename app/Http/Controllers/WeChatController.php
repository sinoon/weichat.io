<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Overtrue\Wechat\Server;
use Log;

class WeChatController extends Controller {

    /**
     * 处理微信的请求消息
     *
     * @param Overtrue\Wechat\Server $server
     *
     * @return string
     */
    public function test()
    {
        $appId = '***';
        $appSecret = '***';
        $token = '***';
        $encodingAESKey = '***';

        $server = new Server($appId, $token, $encodingAESKey);

        // 监听所有类型
        $server->on('message', function ($message) {
            Log::error($message);
            return Message::make('text')->content('您好！');
        });

        // 监听指定类型
        $server->on('message', 'image', function ($message) {
            return Message::make('text')->content('我们已经收到您发送的图片！');
        });

        // 监听所有事件
        $server->on('event', function ($event) {
            Log::error('收到取消关注事件，取消关注者openid: ' . $event['FromUserName']);
        });

        // 只监听指定类型事件
        $server->on('event', 'subscribe', function ($event) {

            Log::error('收到关注事件，关注者openid: ' . $event['FromUserName']);

            return Message::make('text')->content('感谢您关注');
        });

        $result = $server->serve();

        echo $result;
    }

}
