<?php
// Shipping.php

class Shipping
{
    private $apiUrl;

    public function __construct($apiUrl = "http://127.0.0.1:8080/ship_cost_api")
    {
        $this->apiUrl = rtrim($apiUrl, '/');
    }

    public function calculateShippingCost($mode, $value)
    {
        if ($value <= 0) {
            throw new Exception("Error: $mode must be a positive numeric value");
        }

        $url = "{$this->apiUrl}/{$mode}/{$value}";

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10); // Set a timeout of 10 seconds

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            throw new Exception('Error calling shipping cost API: ' . curl_error($ch));
        }

        curl_close($ch);

        $result = json_decode($response, true);

        if (!$result || !isset($result['result'])) {
            throw new Exception('Invalid response from shipping cost API');
        }

        if ($result['result'] === 'rejected') {
            throw new Exception('Shipping cost calculation rejected: ' . ($result['reason'] ?? 'Unknown reason'));
        }

        return $result['cost'] ?? 0;
    }
}
