<?php
if (!defined('CONFIG')) {
    define('CONFIG', [
        'origins' => ['http://localhost', 'https://example.com'],
        'dev_token' => 'aab012e9-ae5d-4c74-adc0-ce4f9b9b7d8c'
    ]);
}

$environment = getenv('APP_ENV') ?: 'xampp';

$config = [
    'db_name' => 'projectDB',
];

$environments = [
    'xampp' => [
        'db_host' => 'localhost',
        'db_user' => 'root',
        'db_pass' => '',
    ],
    'docker' => [
        'db_host' => '10.0.0.3',
        'db_user' => 'root',
        'db_pass' => 'rootpassword',
    ],
];

return array_merge($config, $environments[$environment]);
