<?php
// ManageItem.php

require_once './class/Database.php';
require_once './class/Report.php';

header('Content-Type: application/json');


error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Action: " . ($_GET['action'] ?? 'Not set'));
error_log("POST data: " . print_r($_POST, true));
error_log("FILES data: " . print_r($_FILES, true));

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log the raw POST data
$rawPostData = file_get_contents('php://input');
error_log("Raw POST data: " . $rawPostData);

$report = new Report();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($method) {
        case 'GET':
            if ($action === 'getStockReport') {
                $stockReport = $report->getStockReport();
                echo json_encode(['status' => 'success', 'data' => $stockReport]);
                break;
            } else {
                throw new Exception('Invalid GET action');
            }
            break;
        default:
            throw new Exception('Invalid request method');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}