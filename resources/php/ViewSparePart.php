<?php
declare(strict_types=1);

// Enable error reporting for debugging (remove in production)
ini_set('display_errors', '1');
error_reporting(E_ALL);

// Include necessary files
require_once './class/Database.php';
require_once './class/Session.php';
require_once './class/User.php';
require_once './class/CSRF.php';
require_once './class/SparePart.php';

// Initialize components
$user = new User();
$sparePart = new SparePart();
$csrf = new CSRF();

error_log('View Spare Part request started');

//// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log('Invalid request method');
    sendJsonResponse(['error' => 'Invalid request method'], 405);
}
// api body data
$rawData = file_get_contents('php://input');

try{
    $sparePartListData = $sparePart->getSparePartList();
    error_log('SparePartList data retrieved: ' . ($sparePartListData ? 'Yes' : 'No'));
    if (!$sparePartListData) {
        throw new RuntimeException('SparePartList not found', 404);
    }
    error_log('SparePart data retrieved: ' . ($sparePartListData ? 'Yes' : 'No'));
    if (!$sparePartListData) {
        throw new RuntimeException('SparePart not found', 404);
    }
    sendJsonResponse($sparePartListData);
}catch (Exception $e){
    error_log('ViewSparePart error: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    sendJsonResponse(['error' => $e->getMessage()], 400);
}

function sendJsonResponse(array $data, int $statusCode = 200): void
{
    $output = ob_get_clean(); // Capture any output before our intended JSON

    if (!empty($output)) {
        error_log("Unexpected output before JSON: " . $output);
    }

    http_response_code($statusCode);
    header('Content-Type: application/json');

    $response = [
        'data' => $data,
        'debug' => [
            'output_before_json' => $output,
            'post' => $_POST,
            'session' => isset($_SESSION) ? $_SESSION : 'No session',
            'server' => $_SERVER
        ]
    ];


    try {
        echo json_encode($response, JSON_THROW_ON_ERROR);
    } catch (JsonException $e) {
        error_log('JSON encoding failed: ' . $e->getMessage());
        sendJsonResponse(['error' => 'JSON encoding failed'], 500);
    }
    exit;
}

//$username1 = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_EMAIL);