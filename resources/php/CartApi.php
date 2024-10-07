<?php

require_once './class/Cart.php';
require_once './class/SparePart.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$cart = new Cart();
$sparePart = new SparePart();

try {
    switch ($method) {
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON input');
            }

            switch ($action) {
                case 'create':
                    handleCreateCart($input, $cart);
                    break;
                case 'add':
                    handleAddItem($input, $cart);
                    break;
                case 'update':
                    handleUpdateQuantity($input, $cart);
                    break;
                case 'remove':
                    handleRemoveItem($input, $cart);
                    break;
                case 'buyNow':
                    handleBuyNow($input, $cart);
                    break;
                case 'clearCart':
                    handleClearCart($cart);
                    break;
                default:
                    throw new Exception('Invalid action');
            }
            break;
        case 'GET':
            switch ($action) {
                case 'get':
                    handleGetCart($cart);
                    break;
                case 'checkStock':
                    handleCheckStock($cart);
                    break;
                default:
                    throw new Exception('Invalid GET action');
            }
            break;
        default:
            throw new Exception('Invalid method', 405);
    }
} catch (Exception $e) {
    sendErrorResponse($e->getMessage(), $e->getCode() ?: 400);
}

function handleCreateCart($input, $cart) {
    $userId = $input['userId'] ?? null;
    if (!$userId) {
        throw new Exception('User ID is required');
    }
    $cartId = $cart->getCartId();
    sendResponse([
        "message" => "Cart created successfully",
        "status" => "success",
        "owner" => $userId,
        'cartId' => $cartId,
        'cartItems' => [],
    ]);
}

function handleAddItem($input, $cart) {
    $cartId = $input['cartId'] ?? null;
    $partId = $input['partId'] ?? null;
    $quantity = $input['quantity'] ?? 1;

    if (!$cartId || !$partId) {
        throw new Exception('Cart ID and Item ID are required');
    }
    if (!is_numeric($quantity) || $quantity < 1) {
        throw new Exception('Invalid quantity');
    }

    $stockInfo = $cart->checkStock($partId);
    if (!$stockInfo['isAvailable']) {
        throw new Exception('Item is out of stock');
    }

    $result = $cart->addItem($partId, $quantity);
    if (!$result) {
        throw new Exception('Failed to add item to cart');
    }

    sendResponse(getCartResponse($cart));
}

function handleUpdateQuantity($input, $cart) {
    $cartId = $input['cartId'] ?? null;
    $partId = $input['partId'] ?? null;
    $quantity = $input['quantity'] ?? null;

    if (!$cartId || !$partId || $quantity === null) {
        throw new Exception('Cart ID, Item ID, and Quantity are required');
    }
    if (!is_numeric($quantity) || $quantity < 0) {
        throw new Exception('Invalid quantity');
    }

    $result = $cart->updateQuantity($partId, $quantity);
    if (!$result) {
        throw new Exception('Failed to update item quantity');
    }

    sendResponse(getCartResponse($cart));
}

function handleRemoveItem($input, $cart) {
    $cartId = $input['cartId'] ?? null;
    $partId = $input['partId'] ?? null;

    if (!$cartId || !$partId) {
        throw new Exception('Cart ID and Item ID are required');
    }

    $cart->removeItem($partId);
    sendResponse(getCartResponse($cart));
}

function handleBuyNow($input, $cart) {
    $cartId = $input['cartId'] ?? null;
    $partId = $input['partId'] ?? null;
    $quantity = $input['quantity'] ?? null;

    if (!$cartId || !$partId || $quantity === null) {
        throw new Exception('Cart ID, Item ID, and Quantity are required');
    }
    if (!is_numeric($quantity) || $quantity < 0) {
        throw new Exception('Invalid quantity');
    }

    $stockInfo = $cart->checkStock($partId);
    if (!$stockInfo['isAvailable']) {
        throw new Exception('Item is out of stock');
    }

    $result = $cart->addItem($partId, $quantity);
    if (!$result) {
        throw new Exception('Failed to buy item');
    }

    sendResponse(getCartResponse($cart));
}

function handleClearCart($cart) {
    $cart->clearCart();
    sendResponse(getCartResponse($cart));
}

function handleGetCart($cart) {
    $cartId = $_GET['cartId'] ?? null;
    if (!$cartId) {
        throw new Exception('Cart ID is required');
    }
    sendResponse(getCartResponse($cart));
}

function handleCheckStock($cart) {
    $cartId = $_GET['cartId'] ?? null;
    $partId = $_GET['partId'] ?? null;

    if (!$cartId || !$partId) {
        throw new Exception('Cart ID and Part ID are required');
    }

    $stockInfo = $cart->checkStock($partId);
    sendResponse([
        'status' => 'success',
        'stockItemQty' => $stockInfo['stockItemQty'],
        'cartQuantity' => $stockInfo['cartQuantity'],
        'isAvailable' => $stockInfo['isAvailable'],
        'message' => "Stock checked successfully for item $partId"
    ]);
}

function getCartResponse($cart) {
    $cartItems = [];
    foreach ($cart->getCartItems() as $item) {
        $itemDetails = $item->getItemDetails();
        if (!$itemDetails) {
            continue;
        }
        $cartItems[] = [
            'id' => $item->itemID,
            'name' => $itemDetails['sparePartName'],
            'price' => $itemDetails['price'],
            'quantity' => $item->quantity,
            'totalPrice' => $item->getTotalPrice(),
        ];
    }

    return [
        "message" => "Cart retrieved successfully",
        "status" => "success",
        'cartId' => $cart->getCartId(),
        'cartItems' => $cartItems,
        'cartTotal' => $cart->getCartTotal(),
    ];
}

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function sendErrorResponse($message, $statusCode = 400) {
    http_response_code($statusCode);
    echo json_encode([
        "status" => "error",
        "message" => $message
    ]);
    exit;
}
?>
