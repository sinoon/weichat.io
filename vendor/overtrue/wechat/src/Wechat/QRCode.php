<?php

namespace Overtrue\Wechat;

use Overtrue\Wechat\Utils\Bag;

/**
 * 二维码
 */
class QRCode
{
    /**
     * 应用ID
     *
     * @var string
     */
    protected $appId;

    /**
     * 应用secret
     *
     * @var string
     */
    protected $appSecret;

    const DAY = 86400;
    const SCENE_QE_CARD        = 'QR_CARD';             // 卡券
    const SCENE_QR_TEMPORARY   = 'QR_SCENE';            // 临时
    const SCENE_QR_FOREVER     = 'QR_LIMIT_SCENE';      // 永久
    const SCENE_QR_FOREVER_STR = 'QR_LIMIT_STR_SCENE';  // 永久的字符串参数值

    const API_CREATE = 'https://api.weixin.qq.com/cgi-bin/qrcode/create';
    const API_SHOW   = 'https://mp.weixin.qq.com/cgi-bin/showqrcode';

    /**
     * constructor
     *
     * @param string $appId
     * @param string $appSecret
     */
    public function __construct($appId, $appSecret)
    {
        $this->appId     = $appId;
        $this->appSecret = $appSecret;
    }

    /**
     * 永久二维码
     *
     * @param int    $sceneValue
     * @param string $type
     *
     * @return Bag
     */
    public function forever($sceneValue, $type = self::SCENE_QR_FOREVER)
    {
        $sceneKey = $type === self::SCENE_QR_FOREVER ? 'scene_id' : 'scene_str';
        $scene = array($sceneKey => $sceneValue);

        return $this->create($type, $scene, false);
    }

    /**
     * 临时二维码
     *
     * @param int $sceneId
     * @param int $expireSeconds
     *
     * @return Bag
     */
    public function temporary($sceneId, $expireSeconds = null)
    {
        $scene = array('scene_id' => $sceneId);

        return $this->create(self::SCENE_QR_TEMPORARY, $scene, true, $expireSeconds);
    }

    /**
     * 创建卡券二维码
     *
     * @param array $card
     *
     * {
     *    "card_id": "pFS7Fjg8kV1IdDz01r4SQwMkuCKc",
     *    "code": "198374613512",
     *    "openid": "oFS7Fjl0WsZ9AMZqrI80nbIq8xrA",
     *    "expire_seconds": "1800"，
     *    "is_unique_code": false , "outer_id" : 1
     *  }
     *
     * @return Bag
     */
    public function card($card)
    {
        return $this->create(self::SCENE_QE_CARD, array('card' => $card));
    }

    /**
     * 获取二维码
     *
     * @param string $ticket
     *
     * @return
     */
    public function show($ticket)
    {
        return self::API_SHOW."?ticket={$ticket}";
    }

    /**
     * 保存二维码
     *
     * @param string $ticket
     * @param string $filename
     *
     * @return int
     */
    public function download($ticket, $filename)
    {
        return file_put_contents($filename, file_get_contents($this->show($ticket)));
    }

    /**
     * 创建二维码
     *
     * @param string $actionName
     * @param array  $actionInfo
     * @param bool   $temporary
     * @param int    $expireSeconds
     *
     * @return Bag
     */
    protected function create($actionName, $actionInfo, $temporary = true, $expireSeconds = null)
    {
        $expireSeconds !== null || $expireSeconds = 7 * self::DAY;

        $http = new Http(new AccessToken($this->appId, $this->appSecret));

        $params = array(
                   'action_name'    => $actionName,
                   'action_info'    => $actionInfo,
                  );

        if ($temporary) {
            $params['expire_seconds'] = min($expireSeconds, 7 * self::DAY);
        }

        return new Bag($http->jsonPost(self::API_CREATE, $params));
    }
}
