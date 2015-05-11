<?php

namespace Overtrue\Wechat;

use Overtrue\Wechat\Utils\Bag;

/**
 * 语义理解
 */
class Semantic
{
    /**
     * Http对象
     *
     * @var Http
     */
    protected $http;

    /**
     * 应用ID
     *
     * @var string
     */
    protected $appId;

    const API_SEARCH = 'https://api.weixin.qq.com/semantic/semproxy/search';

    /**
     * constructor
     *
     * @param string $appId
     * @param string $appSecret
     */
    public function __construct($appId, $appSecret)
    {
        $this->appId = $appId;
        $this->http = new Http(new AccessToken($appId, $appSecret));
    }

    /**
     * 语义理解
     *
     * @param string         $keyword
     * @param array | string $categories
     * @param array          $other
     *
     * @return Bag
     */
    public function query($keyword, $categories, array $other = array())
    {
        $params = array(
                   'query'    => $keyword,
                   'category' => implode(',', (array) $categories),
                   'appid'    => $this->appId,
                  );

        return new Bag($this->http->jsonPost(self::API_CREATE, array_merge($params, $other)));
    }
}
