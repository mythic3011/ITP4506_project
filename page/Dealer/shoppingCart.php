<?php
// shoppingCart.php
session_start();
require_once '../../resources/php/class/Order.php';
require_once '../../resources/php/class/Cart.php';
require_once '../../resources/php/class/User.php';
require_once '../../resources/php/class/Auth.php';
require_once '../../resources/php/class/Shipping.php';

$user = new User();
$order = new Order();
$cart = new Cart();
$auth = new Auth();
$sparePart = new SparePart();
$shipping = new Shipping();

// Get token from session (consider using cookies or headers for better security)
$token = $_SESSION['token'] ?? '';

// In a real application, you should validate the token and get the user
// For now, we're using a hardcoded user
$currentUser = $user->getUser("alex@auto-racing.com");

// Get cart ID from session
$cartId = $_SESSION['cartId'] ?? '';

// Handle form submission for placing an order or removing an item
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['remove_item_id'])) {
        try {
            $cart->removeItem($_POST['remove_item_id']);
            $successMessage = 'Item removed successfully!';
        } catch (Exception $e) {
            $errorMessage = 'Failed to remove item: ' . $e->getMessage();
        }
    } elseif (isset($_POST['cart_id']) && isset($_POST['user_id'])) {
        try {
            $orderData = [
                'cart' => $cart->getCartItems(),
                'cartId' => $_POST['cart_id'],
                'userId' => $_POST['user_id']
            ];
            $newOrderId = $order->placeOrder($orderData, $currentUser);
            $cart->clearCart();
            $successMessage = 'Order placed successfully!';
        } catch (Exception $e) {
            $errorMessage = 'Failed to place order: ' . $e->getMessage();
        }
    }
}

$cartItems = $cart->getCartItems();

function calculateShippingCost($cart)
{
    global $shipping;
    $totalWeight = 0;
    $totalQuantity = 0;

    foreach ($cart as $item) {
        $itemWeight = $item->weight ?? 0; // Use 0 if weight is not set
        $totalWeight += $itemWeight * $item->quantity;
        $totalQuantity += $item->quantity;
    }

    if ($totalWeight <= 0) {
        return 0; // Or a default shipping cost
    }

    $shipCostWeight = $shipping->calculateShippingCost('weight', $totalWeight);
    $shipCostQuantity = $shipping->calculateShippingCost('quantity', $totalQuantity);

    return max($shipCostWeight, $shipCostQuantity);
}

try {
    $shippingCost = calculateShippingCost($cartItems);
} catch (Exception $e) {
    $errorMessage = 'Failed to calculate shipping cost: ' . $e->getMessage();
    $shippingCost = 0;
}

$subtotal = array_reduce($cartItems, static function ($sum, $item) {
    return $sum + $item->quantity * $item->getTotalPrice();
}, 0);

$totalAmount = $subtotal + $shippingCost;

?>
<!doctype html>
<html class="dark" lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>Cart | Smart & Luxury Motor Company</title>
    <link href="../../resources/image/SLMC_Icon_DM.png" rel="icon" type="image/x-icon"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp,container-queries"></script>
    <script type="module" src="../../resources/js/script.js"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: {
                            "50": "#eff6ff",
                            "100": "#dbeafe",
                            "200": "#bfdbfe",
                            "300": "#93c5fd",
                            "400": "#60a5fa",
                            "500": "#3b82f6",
                            "600": "#2563eb",
                            "700": "#1d4ed8",
                            "800": "#1e40af",
                            "900": "#1e3a8a",
                            "950": "#172554"
                        }
                    }
                },
                fontFamily: {
                    'body': [
                        'Inter',
                        'ui-sans-serif',
                        'system-ui',
                        '-apple-system',
                        'system-ui',
                        'Segoe UI',
                        'Roboto',
                        'Helvetica Neue',
                        'Arial',
                        'Noto Sans',
                        'sans-serif',
                        'Apple Color Emoji',
                        'Segoe UI Emoji',
                        'Segoe UI Symbol',
                        'Noto Color Emoji'
                    ],
                    'sans': [
                        'Inter',
                        'ui-sans-serif',
                        'system-ui',
                        '-apple-system',
                        'system-ui',
                        'Segoe UI',
                        'Roboto',
                        'Helvetica Neue',
                        'Arial',
                        'Noto Sans',
                        'sans-serif',
                        'Apple Color Emoji',
                        'Segoe UI Emoji',
                        'Segoe UI Symbol',
                        'Noto Color Emoji'
                    ]
                }
            }
        }
    </script>
</head>

<body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
<nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
            <div class="h-8 w-8 relative">
                <img alt="SLMC Logo" class="absolute inset-0 object-contain dark:hidden pt-2 dark:pt-1 "
                     src="../../resources/image/SLMC_LOGO.png"/>
                <img alt="SLMC Logo" class="absolute inset-0 object-contain hidden dark:block"
                     src="../../resources/image/SLMC_LOGO_DM.png"/>
            </div>
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">SLMC</span>
        </a>

        <div class="flex items-center md:order-2">
            <!-- Dark mode toggle button -->
            <button id="darkModeToggle"
                    class="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
            </button>

            <!-- Mobile menu button -->
            <button id="mobile-menu-button" aria-controls="navbar-default" aria-expanded="false"
                    class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    type="button">
                <span class="sr-only">Open main menu</span>
                <svg aria-hidden="true" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 14"
                     fill="none">
                    <path d="M1 1h15M1 7h15M1 13h15" stroke="currentColor" stroke-linecap="round"
                          stroke-linejoin="round" stroke-width="2"/>
                </svg>
            </button>
        </div>

        <div class="hidden w-full md:flex md:w-auto md:order-1" id="navbar-default">
            <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                    <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                       href="viewOrderRecord.html">Order Record</a>
                </li>
                <li>
                    <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                       href="viewSparePart.php">Spare Part</a>
                </li>
                <li>
                    <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                       href="shoppingCart.php">Cart</a>
                </li>
                <li>
                    <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                       href="profile.html">Profile</a>
                </li>
                <li>
                    <a class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                       href="../../logout.html" onclick="logout()">Log Out</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
<main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold mb-6">Shopping Cart</h1>
    <p class="mb-4">You have <span class="font-bold"><?= count($cartItems) ?></span> items in cart.</p>

    <?php if (isset($errorMessage)): ?>
        <div class="bg-red-500 text-white p-4 mb-4">
            <?= htmlspecialchars($errorMessage) ?>
        </div>
    <?php endif; ?>

    <?php if (isset($successMessage)): ?>
        <div class="bg-green-500 text-white p-4 mb-4">
            <?= htmlspecialchars($successMessage) ?>
        </div>
    <?php endif; ?>

    <div class="flex flex-col md:flex-row gap-6">
        <!-- Cart Table -->
        <div class="md:w-2/3">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Item
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Quantity
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 dark:divide-gray-700 divide-y">
                <?php foreach ($cartItems as $item): ?>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap"><?= htmlspecialchars($item->getItemDetails()['sparePartName'] ?? 'N/A') ?></td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            $<?= number_format($item->getItemDetails()['price'] ?? 0, 2) ?></td>
                        <td class="px-6 py-4 whitespace-nowrap"><?= $item->quantity ?? 0 ?></td>
                        <td class="px-6 py-4 whitespace-nowrap">$<?= number_format($item->getTotalPrice() ?? 0, 2) ?></td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <form method="POST" style="display:inline;">
                                <input type="hidden" name="remove_item_id"
                                       value="<?= htmlspecialchars($item->itemID ?? '') ?>">
                                <button type="submit"
                                        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 text-sm">
                                    Remove
                                </button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>

                </tbody>
            </table>
        </div>

        <!-- Payment Details -->
        <div id="orderSummaryContainer" class="md:w-1/3">
            <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
                <!-- Order Summary -->
                <div class="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
                    <p>Address: <?= htmlspecialchars($currentUser['deliveryAddress'] ?? '') ?></p>
                    <p>Contact Person: <?= htmlspecialchars($currentUser['contactName'] ?? '') ?></p>
                </div>
                <h2 class="text-xl font-semibold mb-4">Order Details</h2>
                <form method="POST">
                    <input type="hidden" name="cart_id" value="<?= htmlspecialchars($cartId ?? '') ?>">
                    <input type="hidden" name="user_id" value="<?= htmlspecialchars($currentUser['id'] ?? '') ?>">
                    <div class="mt-6">
                        <p class="text-xl font-bold mb-4">Shipping Cost: $<?= number_format($shippingCost, 2) ?></p>
                    </div>
                    <div class="mt-6">
                        <p class="text-xl font-bold mb-4">Subtotal: $<?= number_format($subtotal, 2) ?></p>
                    </div>
                    <div class="mt-6">
                        <p class="text-xl font-bold mb-4">Total: $<?= number_format($totalAmount, 2) ?></p>
                    </div>
                    <div class="mt-6">
                        <button class="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                type="submit">
                            Checkout →
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</main>
<footer class="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
    <div class="container mx-auto px-4 py-8">
        <div class="flex flex-wrap items-center justify-between md:flex-no-wrap">
            <div class="flex items-center mb-6 md:mb-0">
                <span class="text-sm text-gray-500 dark:text-gray-400">Copyright &copy; 2023 Smart & Luxury Motor Company</span>
            </div>
        </div>
    </div>
</footer>
</body>

</html>
