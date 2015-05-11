<?php

namespace Overtrue\Wechat;

/**
 * 微信 JSSDK
 */
class Js
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

    /**
     * Cache对象
     *
     * @var Cache
     */
    protected $cache;

    /**
     * 当前URL
     *
     * @var string
     */
    protected $url;

    const API_TICKET = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi';

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
        $this->cache     = new Cache($appId);
    }

    /**
     * 获取JSSDK的配置数组
     *
     * @param array $APIs
     * @param bool  $debug
     * @param bool  $json
     *
     * @return array
     */
    public function config(array $APIs, $debug = false, $json = true)
    {
        $signPackage = $this->getSignaturePackage();

        $config = array_merge(array('debug' => $debug), $signPackage, array('jsApiList' => $APIs));

        return $json ? json_encode($config) : $config;
    }

    /**
     * 获取jsticket
     *
     * @return string
     */
    public function getTicket()
    {
        $key = 'overtrue.wechat.jsapi_ticket'.$this->appId;

        return $this->cache->get($key, function ($key) {
            $http  = new Http(new AccessToken($this->appId, $this->appSecret));

            $result = $http->get(self::API_TICKET);

            $this->cache->set($key, $result['ticket'], $result['expires_in']);

            return $result['ticket'];
        });
    }

    /**
     * 签名
     *
     * @param string $url
     * @param string $nonce
     * @param int    $timestamp
     *
     * @return array
     */
    public function getSignaturePackage($url = null, $nonce = null, $timestamp = null)
    {
        $url       = $url ? $url : $this->getUrl();
        $nonce     = $nonce ? $nonce : $this->getNonce();
        $timestamp = $timestamp ? $timestamp : time();
        $ticket    = $this->getTicket();

        $sign = array(
                 'appId'     => $this->appId,
                 'nonceStr'  => $nonce,
                 'timestamp' => $timestamp,
                 'url'       => $url,
                 'signature' => $this->getSignature($ticket, $nonce, $timestamp, $url),
                );

        return $sign;
    }

    /**
     * 生成签名
     *
     * @param string $ticket
     * @param string $nonce
     * @param int    $timestamp
     * @param string $url
     *
     * @return string
     */
    public function getSignature($ticket, $nonce, $timestamp, $url)
    {
        return sha1("jsapi_ticket={$ticket}&noncestr={$nonce}&timestamp={$timestamp}&url={$url}");
    }

    /**
     * 设置当前URL
     *
     * @param string $url
     *
     * @return Js
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * 获取当前URL
     *
     * @return string
     */
    public function getUrl()
    {
        if ($this->url) {
            return $this->url;
        }

        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] === 443) ? 'https://' : 'http://';

        return $protocol.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
    }

    /**
     * 获取随机字符串
     *
     * @return string
     */
    public function getNonce()
    {
        return uniqid('rand_');
    }
}
