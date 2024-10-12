<?php

// this is the old version and deprecated
// please do not use it


//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
//
//require_once("Database.php");
//require_once("User.php");
//require_once("SparePart.php");
//require_once("Report.php");
//require_once("Order.php");
//
//header("Content-Type: application/json");
//header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
//header("Access-Control-Allow-Headers: Content-Type, Authorization");
//header("Access-Control-Allow-Credentials: true");
//
//if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//    exit(0);
//}
//
//function logMessage($message): void
//{
//    file_put_contents(__DIR__ . '/api_log.log', date('Y-m-d H:i:s') . ' - ' . $message . "\n", FILE_APPEND);
//}
//
//logMessage('API call started');
//
//$user = new User();
//$sparePart = new SparePart();
//$report = new Report();
//$order = new Order();
//$ordersItem = new OrdersItem();
//
////$devToken = CONFIG['dev_token'] ?? null;
//
//const ACTIONS = [
//    'getSparePart', 'getSparePartList', 'updateSparePart', 'deleteSparePart', 'addSparePart',
//    'getStockReport',
//    'getUser', 'updateDealerProfile', 'updateDealerPassword',
//    'login', 'logout', 'getSession',
//    'getOrder', 'getOrderList', 'updateOrder', 'deleteOrder', 'addOrder',
//    'getOrdersItem', 'getOrdersItemList', 'updateOrdersItem', 'deleteOrdersItem', 'addOrdersItem'
//];
//
//$method = $_SERVER['REQUEST_METHOD'];
//$data = ($method === 'POST') ? json_decode(file_get_contents('php://input'), true) : $_GET;
//
//logMessage('Request data: ' . print_r($data, true));
//
//function sendResponse($data, $statusCode = 200): void
//{
//    http_response_code($statusCode);
//    echo json_encode($data);
//    exit;
//}
//
//function validateAction(string $action): void
//{
//    if (!in_array($action, ACTIONS, true)) {
//        sendResponse(['error' => 'Invalid action'], 400);
//    }
//}
//
////function authenticateUser(): void
////{
////    global $user, $devToken;
////    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
////    $sessionToken = $user->getSession()->get('token') ?? null;
////
////    if (!hash_equals((string)$authHeader, (string)$sessionToken) && !hash_equals((string)$authHeader, (string)$devToken)) {
////        sendResponse(['error' => 'Unauthorized'], 403);
////    }
////}
////if ($action !== 'login') {
////    authenticateUser();
////}
//
//function validateInput(array $data, array $requiredFields): void
//{
//    foreach ($requiredFields as $field) {
//        if (!isset($data[$field]) || trim($data[$field]) === '') {
//            sendResponse(['error' => "Missing required field: $field"], 400);
//        }
//    }
//}
//
//$action = $data['action'] ?? null;
//
//if (!$action) {
//    sendResponse(['error' => 'No action specified'], 400);
//}
//
//validateAction($action);
//
//
//
//try {
//    logMessage('Performing action: ' . $action);
//
//    switch ($action) {
//        case 'login':
//            validateInput($data, ['username', 'password']);
//            $result = $user->login($data['username'], $data['password']);
//            logMessage('Login result: ' . print_r($result, true));
//            if (isset($result['error'])) {
//                sendResponse(['error' => $result['error']], 401);
//            } else {
//                sendResponse(['message' => 'Successfully Logged In', 'result' => $result]);
//            }
//            break;
//
//        case 'logout':
//            $user->logout();
//            sendResponse(['message' => 'Successfully logged out']);
//            break;
//
//        case 'getSparePart':
//            validateInput($data, ['id']);
//            $result = $sparePart->getSparePart($data['id']);
//            break;
//
//        case 'getSparePartList':
//            $result = $sparePart->getSparePartList();
//            break;
//
//        case 'updateSparePart':
//            validateInput($data, ['id', 'sparePart']);
//            $result = $sparePart->updateSparePart($data['id'], $data['sparePart']);
//            break;
//
//        case 'deleteSparePart':
//            validateInput($data, ['id']);
//            $result = $sparePart->deleteSparePart($data['id']);
//            break;
//
//        case 'addSparePart':
//            validateInput($data, ['sparePart']);
//            $result = $sparePart->addSparePart($data['sparePart']);
//            break;
//
//        case 'getStockReport':
//            $result = $report->getStockReport();
//            break;
//
//        case 'getUser':
//            $result = $user->getCurrentUser();
//            break;
//
//        case 'updateDealerProfile':
//            validateInput($data, ['userId']);
//            $result = $user->updateProfile($data['userId'], $data);
//            break;
//
//        case 'updateDealerPassword':
//            validateInput($data, ['userId', 'currentPassword', 'newPassword']);
//            $result = $user->updatePassword($data['userId'], $data['currentPassword'], $data['newPassword']);
//            break;
//
//        case 'getOrder':
//            validateInput($data, ['orderID']);
//            $result = $order->getOrder($data['orderID']);
//            break;
//
//        case 'getOrderList':
//            $result = $order->getOrderList();
//            break;
//
//        case 'updateOrder':
//            validateInput($data, ['orderID', 'order']);
//            $result = $order->updateOrder($data['orderID'], $data['order']);
//            break;
//
//        case 'deleteOrder':
//            validateInput($data, ['orderID']);
//            $result = $order->deleteOrder($data['orderID']);
//            break;
//
//        case 'addOrder':
//            validateInput($data, ['order']);
//            $result = $order->addOrder($data['order']);
//            break;
//
//        case 'getOrdersItem':
//            validateInput($data, ['orderID']);
//            $result = $ordersItem->getOrdersItem($data['orderID']);
//            break;
//
//        case 'getOrdersItemList':
//            $result = $ordersItem->getOrdersItemList();
//            break;
//
//        case 'updateOrdersItem':
//            validateInput($data, ['orderID', 'ordersItem']);
//            $result = $ordersItem->updateOrdersItem($data['orderID'], $data['ordersItem']);
//            break;
//
//        case 'deleteOrdersItem':
//            validateInput($data, ['orderID']);
//            $result = $ordersItem->deleteOrdersItem($data['orderID']);
//            break;
//
//        case 'addOrdersItem':
//            validateInput($data, ['ordersItem']);
//            $result = $ordersItem->addOrdersItem($data['ordersItem']);
//            break;
//
//        default:
//            sendResponse(['error' => 'Action not implemented'], 501);
//    }
//
//    sendResponse(['result' => $result]);
//} catch (Exception $e) {
//    logMessage('Exception: ' . $e->getMessage());
//    logMessage('Stack trace: ' . $e->getTraceAsString());
//    sendResponse(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
//}
