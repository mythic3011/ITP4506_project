<?php
// order_api.php

require_once './class/Database.php';
require_once './class/Order.php';
require_once './class/Auth.php';
require_once './class/Report.php';

header('Content-Type: application/json');

$order = new Order();
$auth = new Auth();
$report = new Report();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

function authenticateUser()
{
    global $auth;
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (empty($authHeader)) {
        sendErrorResponse('No token provided', 401);
    }

    $user = $auth->validateToken($authHeader);

    if (!$user || !isset($user['UserID'])) {
        sendErrorResponse('Invalid or expired token', 401);
    }

    return $user;
}

try {
    // Authenticate user
    $user = authenticateUser();

    switch ($method) {
        case 'GET':
            handleGetRequests($action, $order, $user);
            break;

        case 'POST':
            handlePostRequests($action, $order, $user);
            break;

        default:
            throw new RuntimeException('Invalid request method', 405);
    }
} catch (Exception $e) {
    sendErrorResponse($e->getMessage(), $e->getCode() ?: 400);
}

function handleGetRequests($action, $order, $user): void
{
    global $report;
    switch ($action) {
        case 'Dealer-list':
            if (isset($_GET['username'])) {
                $dealerID = $_GET['username'];
                $orderList = $order->getOrderListByDealer($dealerID);
                sendSuccessResponse(['data' => $orderList]);
                break;
            }
            sendErrorResponse('Invalid or missing username', 400);
            break;
        case 'Sales-manager-list':
            $orderList = $order->getOrderListBySalesManager();
            sendSuccessResponse(['data' => $orderList]);
            break;
        case 'Dealer-get':
            if (!isset($_GET['id'])) {
                throw new RuntimeException('Order ID is required', 400);
            }
            $orderDetails = $order->getOrderByIdAndDealer($_GET['id'], $user['UserID']);
            sendSuccessResponse(['data' => $orderDetails]);
            break;
        case 'Sales-Manager-get':
            if (!isset($_GET['id'])) {
                throw new RuntimeException('Order ID is required', 400);
            }
            $orderDetails = $order->getOrderByIdAndSalesManager($_GET['id']);
            sendSuccessResponse(['data' => $orderDetails]);
            break;
        case 'download':
            if (!isset($_GET['id'])) {
                throw new RuntimeException('Order ID is required', 400);
            }
            $order->downloadInvoice($_GET['id'], $user);
            break;
        case 'orderInfo':
            if (!isset($_GET['id'])) {
                throw new RuntimeException('Order ID is required', 400);
            }
            $order->getOrdersItemsByOrderID($_GET['id'], $user);
            break;
        case 'getStockReport':
            $stockReport = $report->getStockReport();
            sendSuccessResponse(['data' => $stockReport]);
            break;
        default:
            throw new RuntimeException('Invalid GET action', 400);
    }
}

function handlePostRequests($action, $order, $user)
{
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new RuntimeException('Invalid JSON input', 400);
    }

    switch ($action) {
        case 'placeOrder':
            validateOrderInput($input);
            $newOrderId = $order->placeOrder($input, $user);
            sendSuccessResponse(['message' => 'Order created successfully', 'id' => $newOrderId]);
            break;
        case 'update':
            if (!isset($input['id'])) {
                throw new RuntimeException('Order ID is required for update', 400);
            }
            $order->updateOrder($input['id'], $input, $user);
            sendSuccessResponse(['message' => 'Order updated successfully']);
            break;
        case 'updateStatus':
            if (!isset($input['id']) || !isset($input['status'])) {
                throw new RuntimeException('Order ID and status are required for update', 400);
            }
            $order->updateOrderStatus($input['id'], $input['status'], $user);
            sendSuccessResponse(['message' => 'Order status updated successfully']);
            break;
        case 'cancel':
            if (!isset($input['id'])) {
                throw new RuntimeException('Order ID is required for cancellation', 400);
            }
            $order->cancelOrder($input['id'], $user);
            sendSuccessResponse(['message' => 'Order cancelled successfully']);
            break;
        case 'delete':
            if (!isset($input['id'])) {
                throw new RuntimeException('Order ID is required for deletion', 400);
            }
            $order->deleteOrder($input['id'], $user);
            sendSuccessResponse(['message' => 'Order deleted successfully']);
            break;
        default:
            throw new RuntimeException('Invalid POST action', 400);
    }
}

function validateOrderInput($input)
{
    $requiredFields = ['cart', 'deliveryAddress', 'deliveryDate'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field])) {
            throw new RuntimeException("Missing required field: $field", 400);
        }
    }
}

function sendSuccessResponse($data)
{
    echo json_encode(array_merge(['status' => 'success'], $data));
}

function sendErrorResponse($message, $code)
{
    http_response_code($code);
    echo json_encode([
        "status" => "error",
        "message" => $message
    ]);
}