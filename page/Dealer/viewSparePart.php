<?php
session_start();
require_once '../../resources/php/class/Order.php';
require_once '../../resources/php/class/Cart.php';
require_once '../../resources/php/class/User.php';
require_once '../../resources/php/class/Auth.php';
require_once '../../resources/php/class/SparePart.php';
require_once '../../resources/php/class/Shipping.php';
require_once '../../resources/php/class/Database.php';

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

try {
    $shippingCost = $shipping->calculateShippingCost('weight', array_sum(array_map(function($item) {
        return $item->weight * $item->quantity;
    }, $cartItems)));
} catch (Exception $e) {
    $errorMessage = 'Failed to calculate shipping cost: ' . $e->getMessage();
    $shippingCost = 0;
}

$subtotal = array_reduce($cartItems, static function ($sum, $item) {
    return $sum + $item->quantity * $item->getTotalPrice();
}, 0);

$totalAmount = $subtotal + $shippingCost;

// Fetch spare parts data from database
$spareParts = $sparePart->getAllSpareParts(); // 假设SparePart类中有一个方法getAllSpareParts来获取所有备件数据
?>

<!doctype html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>Spare Parts | Smart & Luxury Motor Company</title>
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
    <h1 class="text-3xl font-bold mb-6">Spare Parts</h1>
    <div class="mb-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <!-- Search Bar -->
        <div class="w-full sm:w-1/3">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="sparePartSearch">Search Spare Parts:</label>
            <input class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   id="sparePartSearch"
                   placeholder="Enter spare part name or ID"
                   type="text">
        </div>

        <!-- Sort By Dropdown -->
        <div class="w-full sm:w-1/3">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="SparePartSorting">Sort By:</label>
            <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="SparePartSorting">
                <option value="None">None</option>
                <option value="Price-Low-to-High">Price - Low to High</option>
                <option value="Price-High-to-Low">Price - High to Low</option>
                <option value="Category">Category</option>
            </select>
        </div>

        <!-- Specify Category Dropdown -->
        <div class="w-full sm:w-1/3" id="CategoryFilterContainer" style="display: none;">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="CategoryFilter">Specify Category:</label>
            <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="CategoryFilter">
                <option value="All">All Categories</option>

            </select>
        </div>
    </div>
    <div id="SparePartList">
        <?php foreach ($spareParts as $part): ?>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4">
                <img class="w-full h-48 object-cover" src="../../resources/image/spare/<?= htmlspecialchars($part['imageUrl']) ?>" alt="<?= htmlspecialchars($part['name']) ?>">
                <div class="p-4">
                    <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white"><?= htmlspecialchars($part['name']) ?></h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-2">Spare Part No. <?= htmlspecialchars($part['id']) ?></p>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">Unit Price: $<?= number_format($part['price'], 2) ?></p>
                    <a href="sparePart-template.html?id=<?= htmlspecialchars($part['id']) ?>" class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 text-center text-sm">View Details</a>
                </div>
            </div>
        <?php endforeach; ?>
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
