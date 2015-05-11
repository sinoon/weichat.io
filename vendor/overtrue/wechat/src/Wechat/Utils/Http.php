<?php

namespace Overtrue\Wechat\Utils;

/**
 * Http请求类
 *
 * from https://github.com/dsyph3r/curl-php/blob/master/lib/Network/Curl/Curl.php
 */
class Http
{
    /**
     * Constants for available HTTP methods
     */
    const GET     = 'GET';
    const POST    = 'POST';
    const PUT     = 'PUT';
    const PATCH   = 'PATCH';
    const DELETE  = 'DELETE';

    /**
     * @var resource handle
     */
    private $curl;

    /**
     * Create the cURL resource
     */
    public function __construct()
    {
        $this->curl = curl_init();
    }

    /**
     * Clean up the cURL handle
     */
    public function __destruct()
    {
        if (is_resource($this->curl)) {
            curl_close($this->curl);
        }
    }

    /**
     * Get the cURL handle
     *
     * @return resource cURL handle
     */
    public function getCurl()
    {
        return $this->curl;
    }

    /**
     * Make a HTTP GET request
     *
     * @param string $url
     * @param array  $params
     * @param array  $options
     *
     * @return array
     */
    public function get($url, $params = array(), $options = array())
    {
        return $this->request($url, self::GET, $params, $options);
    }

    /**
     * Make a HTTP POST request
     *
     * @param string $url
     * @param array  $params
     * @param array  $options
     *
     * @return array
     */
    public function post($url, $params = array(), $options = array())
    {
        return $this->request($url, self::POST, $params, $options);
    }

    /**
     * Make a HTTP PUT request
     *
     * @param string $url
     * @param array  $params
     * @param array  $options
     *
     * @return array
     */
    public function put($url, $params = array(), $options = array())
    {
        return $this->request($url, self::PUT, $params, $options);
    }

    /**
     * Make a HTTP PATCH request
     *
     * @param string $url
     * @param array  $params
     * @param array  $options
     *
     * @return array
     */
    public function patch($url, $params = array(), $options = array())
    {
        return $this->request($url, self::PATCH, $params, $options);
    }

    /**
     * Make a HTTP DELETE request
     *
     * @param string $url
     * @param array  $params
     * @param array  $options
     *
     * @return array
     */
    public function delete($url, $params = array(), $options = array())
    {
        return $this->request($url, self::DELETE, $params, $options);
    }

    /**
     * Make a HTTP request
     *
     * @param string $url
     * @param string $method
     * @param array  $params
     * @param array  $options
     *
     * @return array
     */
    protected function request($url, $method = self::GET, $params = array(), $options = array())
    {
        if ($method === self::GET || $method === self::DELETE) {
            $url .= (stripos($url, '?') ? '&' : '?').http_build_query($params);
            $params = array();
        }

        curl_setopt($this->curl, CURLOPT_HEADER, 1);
        curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($this->curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($this->curl, CURLOPT_URL, $url);

        curl_setopt($this->curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($this->curl, CURLOPT_SSL_VERIFYPEER, 0);

        // Check for files
        if (isset($options['files']) && count($options['files'])) {
            foreach ($options['files'] as $index => $file) {
                $params[$index] = $this->createCurlFile($file);
            }

            phpversion() < '5.5' || curl_setopt($this->curl, CURLOPT_SAFE_UPLOAD, false);

            curl_setopt($this->curl, CURLOPT_POST, 1);
            curl_setopt($this->curl, CURLOPT_POSTFIELDS, $params);
        } else {
            if (isset($options['json'])) {
                $params = $this->encode($params);
                $options['headers'][] = 'content-type:application/json';
            }

            curl_setopt($this->curl, CURLOPT_POSTFIELDS, $params);
        }

        // Check for custom headers
        if (isset($options['headers']) && count($options['headers'])) {
            curl_setopt($this->curl, CURLOPT_HTTPHEADER, $options['headers']);
        }

        // Check for basic auth
        if (isset($options['auth']['type']) && 'basic' === $options['auth']['type']) {
            curl_setopt($this->curl, CURLOPT_USERPWD, $options['auth']['username'].':'.$options['auth']['password']);
        }

        $response = $this->doCurl();

        // Separate headers and body
        $headerSize = $response['curl_info']['header_size'];
        $header     = substr($response['response'], 0, $headerSize);
        $body       = substr($response['response'], $headerSize);

        $results = array(
            'curl_info'    => $response['curl_info'],
            'content_type' => $response['curl_info']['content_type'],
            'status'       => $response['curl_info']['http_code'],
            'headers'      => $this->splitHeaders($header),
            'data'         => $body,
        );

        return $results;
    }

    /**
     * make cURL file
     *
     * @param string $filename
     *
     * @return \CURLFile|string
     */
    protected function createCurlFile($filename)
    {
        if (function_exists('curl_file_create')) {
            return curl_file_create($filename);
        }

        return "@$filename;filename=".basename($filename);
    }

    /**
     * Split the HTTP headers
     *
     * @param string $rawHeaders
     *
     * @return array
     */
    protected function splitHeaders($rawHeaders)
    {
        $headers = array();

        $lines = explode("\n", trim($rawHeaders));
        $headers['HTTP'] = array_shift($lines);

        foreach ($lines as $i => $h) {
            $h = explode(':', $h, 2);

            if (isset($h[1])) {
                $headers[$h[0]] = trim($h[1]);
            }
        }

        return $headers;
    }

    /**
     * json encode
     *
     * TODO: 5.4以后去除此方法，5.3不支持JSON_UNESCAPED_UNICODE
     *
     * @param array $data
     *
     * @return string
     */
    protected function encode($data)
    {
        array_walk_recursive($data, function (&$value) {
            if (is_string($value)) {
                $value = urlencode($value);
            }
        });

        return urldecode(json_encode($data));
    }

    /**
     * Perform the Curl request
     *
     * @return array
     */
    protected function doCurl()
    {
        $response = curl_exec($this->curl);
        $curlInfo = curl_getinfo($this->curl);

        $results = array(
            'curl_info' => $curlInfo,
            'response'  => $response,
        );

        return $results;
    }
}
