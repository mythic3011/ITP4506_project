<?php
declare(strict_types=1);
ob_start();
ini_set('display_errors', '1');
error_reporting(E_ALL);

require_once './class/Database.php';
require_once './class/Session.php';
require_once './class/User.php';
require_once './class/CSRF.php';
require_once './class/SparePart.php';

$user = new User();
$sparePart = new SparePart();
$csrf = new CSRF();

error_log('View Spare Part request started');

//if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
//    error_log('Invalid request method');
//    sendJsonResponse(['error' => 'Invalid request method'], 405);
//}

$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

$sparePartId = $data['sparePartId'] ?? filter_input(INPUT_GET, 'sparePartId', FILTER_SANITIZE_STRING);

if (empty($sparePartId)) {
    error_log('SparePart ID is empty');
    sendJsonResponse(['error' => 'SparePart ID is empty'], 400);
}

try {
    $sparePartData = $sparePart->getSparePart($sparePartId);
    if (!$sparePartData) {
        throw new RuntimeException('Spare part not found', 404);
    }

    $response = [
        'sparePartNum' => $sparePartData['sparePartNum'],
        'sparePartName' => $sparePartData['sparePartName'],
        'sparePartCategory' => $sparePartData['sparePartCategory'],
        'sparePartImage' => $sparePartData['sparePartImage'],
        'sparePartDescription' => $sparePartData['sparePartDescription'],
        'weight' => $sparePartData['weight'],
        'stockItemQty' => $sparePartData['stockItemQty'],
        'price' => $sparePartData['price'],
        'countryOfOrigin' => $sparePartData['countryOfOrigin'] ?? 'N/A',
        'brand' => $sparePartData['brand'] ?? 'N/A'
    ];

    sendJsonResponse($response);
} catch (Exception $e) {
    error_log('SparePart Detail error: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    sendJsonResponse(['error' => $e->getMessage()], $e->getCode() ?: 400);
}

function sendJsonResponse(array $data, int $statusCode = 200): void
{
    if (ob_get_length()) {
        ob_clean();
    }

    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode(['data' => $data], JSON_THROW_ON_ERROR);
    exit;
}
