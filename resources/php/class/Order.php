<?php

require_once 'Database.php';

class Order
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function placeOrder($orderData, $user)
    {
        $this->db->beginTransaction();

        try {
            $cart = $orderData['cart'];
            $deliveryAddress = $user["deliveryAddress"];
            // deliveryDate = order datatime aka now and + 7 days
            $deliveryDate = date('Y-m-d H:i:s', strtotime("+7 days")) ?? '';

            // Generate orderID
            $orderID = $this->generateOrderID();

            $orderDateTime = date('Y-m-d H:i:s');

            // Calculate shipping cost
            $shipCost = $this->calculateShippingCost($cart);

            $salesManagerID = $this->RandomAssignSalesManager();

            // Insert order
            $this->db->query("INSERT INTO Orders (orderID, dealerID, salesManagerID, orderDateTime, deliveryAddress, deliveryDate, orderStatus, shipCost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [$orderID, $user['id'], null, $orderDateTime, $deliveryAddress, $deliveryDate, 'Pending', $shipCost]);

            // Insert order items and update stock
            foreach ($cart as $item) {
                $this->processOrderItem($orderID, $item);
            }

            $this->db->commit();
            return $orderID;
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }

    private function processOrderItem($orderID, $item)
    {
        // Check stock
        $stock = $this->checkStock($item['itemID']);
        if ($stock === false || $stock < $item['quantity']) {
            throw new Exception("Insufficient stock for item: " . $item['itemID']);
        }

        // Insert order item
        $this->db->query("INSERT INTO OrdersItem (orderID, sparePartNum, orderQty, sparePartOrderPrice) VALUES (?, ?, ?, ?)",
            [$orderID, $item['itemID'], $item['quantity'], $item['totalPrice']]);

        // Update stock
        $this->updateStock($item['itemID'], $stock - $item['quantity']);
    }

    private function generateOrderID()
    {
        $result = $this->db->query("SELECT MAX(orderID) as maxID FROM Orders");
        return ($result && isset($result[0]['maxID'])) ? $result[0]['maxID'] + 1 : 1;
    }

    private function calculateShippingCost($cart)
    {
        $cartItems = [];
        $totalWeight = 0;
        $totalQuantity = 0;

        foreach ($cart as $item) {
            $cartItems[] = [
                'id' => $item->itemID,
                'name' => $item->itemName,
                'price' => $item->itemPrice,
                'quantity' => $item->quantity,
                'totalPrice' => $item->getTotalPrice(),
            ];
            $totalWeight += $item->weight * $item->quantity;
            $totalQuantity += $item->quantity;
        }

        $shipCostWeight = $this->getShippingCost('weight', $totalWeight);
        $shipCostQuantity = $this->getShippingCost('quantity', $totalQuantity);

        // Return the higher of the two costs
        return max($shipCostWeight, $shipCostQuantity);
    }

    // call api to get shipping cost
    private function getShippingCost($mode, $value)
    {
        $apiUrl = "http://127.0.0.1:8080/ship_cost_api/{$mode}/{$value}";

        $ch = curl_init($apiUrl);
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

    private function checkStock($itemID)
    {
        $result = $this->db->query("SELECT stockItemQty FROM Item WHERE sparePartNum = ?", [$itemID]);
        return ($result && isset($result[0]['stockItemQty'])) ? $result[0]['stockItemQty'] : false;
    }

    private function updateStock($itemID, $newQuantity)
    {
        $this->db->query("UPDATE Item SET stockItemQty = ? WHERE sparePartNum = ?", [$newQuantity, $itemID]);
    }

    public function getOrder($orderID)
    {
        $result = $this->db->query("SELECT * FROM Orders WHERE orderID = ?", [$orderID]);
        return $result ? $result[0] : null;
    }

    public function getOrderOrderTotal($orderID)
    {
        $orderItemsObj = new OrdersItem();
        $orderItems = $orderItemsObj->getOrdersItemsByOrderID($orderID);
        $totalCost = 0;
        foreach ($orderItems as $item) {
            $totalCost += $item['orderQty'] * $item['sparePartOrderPrice'];
        }

        $result = $this->db->query("SELECT shipCost FROM Orders WHERE orderID = ?", [$orderID]);
        if ($result && isset($result[0]['shipCost'])) {
            $orderShippingCost = $result[0]['shipCost'];
            $totalCost += $orderShippingCost;
        } else {
            // fallback to 0 if shipping cost is not found
            error_log("Failed to retrieve shipping cost for order ID: $orderID");
            $totalCost += 0;
        }

        return $totalCost;
    }


    public function getOrderListByDealer($dealerID)
    {
        $orders = [];
        $min = $this->db->query("SELECT MIN(orderID) as minID FROM Orders WHERE dealerID = ?", [$dealerID]);
        $max = $this->db->query("SELECT MAX(orderID) as maxID FROM Orders WHERE dealerID = ?", [$dealerID]);
        $min = $min[0]['minID'];
        $max = $max[0]['maxID'];
        // loop from min to max row number to add order total to array
        for ($i = $min; $i <= $max; $i++) {
            $result = $this->db->query("SELECT * FROM Orders WHERE orderID = ?", [$i]);
            if ($result && isset($result[0])) {
                $order = $result[0];
                try {
                    $order['totalCost'] = $this->getOrderOrderTotal($order['orderID']);
                } catch (Exception $e) {
                    // Handle error or set a default shipping cost if needed
                    throw new Exception("Failed to retrieve shipping cost for order ID: $i");
                }
                $orders[] = $order;
            }
        }
        return $orders;
    }

    public function getOrderListBySalesManager()
    {
        $orders = [];
        $min = $this->db->query("SELECT MIN(orderID) as minID FROM Orders");
        $max = $this->db->query("SELECT MAX(orderID) as maxID FROM Orders");
        $min = $min[0]['minID'];
        $max = $max[0]['maxID'];
        // loop from min to max row number to add order total to array
        for ($i = $min; $i <= $max; $i++) {
            $result = $this->db->query("SELECT * FROM Orders WHERE orderID = ?", [$i]);
            if ($result && isset($result[0])) {
                $order = $result[0];
                try {
                    $order['totalCost'] = $this->getOrderOrderTotal($order['orderID']);
                } catch (Exception $e) {
                    // Handle error or set a default shipping cost if needed
                    throw new Exception("Failed to retrieve shipping cost for order ID: $i");
                }
                $orders[] = $order;
            }
        }
        return $orders;
    }

    // get the order details by orderID
    public function getOrderDetails($orderID)
    {
        $orderItems = new OrdersItem();
        $orderItems->getOrdersItemsByOrderID($orderID);
        return $orderItems;
    }

    public function updateOrder($orderID, $order)
    {
        $result = $this->db->query("UPDATE Orders SET dealerID = ?, salesManagerID = ?, orderDateTime = ?, deliveryAddress = ?, deliveryDate = ?, orderStatus = ?, shipCost = ? WHERE orderID = ?",
            [$order->dealerID, $order->salesManagerID, $order->orderDateTime, $order->deliveryAddress, $order->deliveryDate, $order->orderStatus, $order->shipCost, $orderID]);
        return $result ? $this->getOrder($orderID) : null;
    }

    public function updateOrderStatus($orderID, $orderStatus)
    {
        $result = $this->db->query("UPDATE Orders SET orderStatus = ? WHERE orderID = ?", [$orderStatus, $orderID]);
        return $result ? $this->getOrder($orderID) : null;
    }

    public function deleteOrder($orderID)
    {
        $result = $this->db->query("DELETE FROM Orders WHERE orderID = ?", [$orderID]);
        return $result && !$this->getOrder($orderID);
    }

    public function addOrder($order)
    {
        $result = $this->db->query("INSERT INTO Orders (orderID, dealerID, salesManagerID, orderDateTime, deliveryAddress, deliveryDate, orderStatus, shipCost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [$order->orderID, $order->dealerID, $order->salesManagerID, $order->orderDateTime, $order->deliveryAddress, $order->deliveryDate, $order->orderStatus, $order->shipCost]);
        return $result ? $this->getOrder($order->orderID) : null;
    }

    public function getOrderById(mixed $id)
    {
        $result = $this->db->query("SELECT * FROM Orders WHERE orderID = ?", [$id]);
        return $result ? $result[0] : null;
    }

    public function getOrderByIdAndDealer($id, $dealerID)
    {
        // Fetch order details
        $orderResult = $this->db->query("SELECT o.*, u.CompanyName as dealerCompany, u.contactName as dealerContact, u.contactNumber as dealerPhone,
                                     sm.contactName as salesManagerName, sm.contactNumber as salesManagerContact
                                     FROM Orders o
                                     JOIN UserRoles u ON o.dealerID = u.UserID
                                     JOIN UserRoles sm ON o.salesManagerID = sm.UserID
                                     WHERE o.orderID = ? AND o.dealerID = ?", [$id, $dealerID]);

        if (empty($orderResult)) {
            return null; // Order not found or doesn't belong to this dealer
        }

        $order = $orderResult[0];

        // Fetch order items
        $orderItems = $this->db->query("SELECT oi.*, sp.sparePartName, sp.weight
                                    FROM OrdersItem oi
                                    JOIN Item sp ON oi.sparePartNum = sp.sparePartNum
                                    WHERE oi.orderID = ?", [$id]);

        // Calculate totals
        $totalAmount = 0;
        $totalWeight = 0;
        foreach ($orderItems as &$item) {
            $item['totalPrice'] = $item['orderQty'] * $item['sparePartOrderPrice'];
            $totalAmount += $item['totalPrice'];
            $totalWeight += $item['orderQty'] * ($item['weight'] ?? 0);
        }

        // Prepare the summary
        $summary = [
            'id' => $order['orderID'],
            'orderDate' => $this->formatDate($order['orderDateTime']),
            'orderTime' => $this->formatTime($order['orderDateTime']),
            'orderStatus' => $order['orderStatus'],
            'salesManagerId' => $order['salesManagerID'],
            'salesManager' => $order['salesManagerName'],
            'salesManagerContact' => $order['salesManagerContact'],
            'deliveryAddress' => $order['deliveryAddress'],
            'deliveryDate' => $this->formatDate($order['deliveryDate']),
            'contactPerson' => $order['dealerContact'],
            'contactPhone' => $order['dealerPhone'],
            'totalAmount' => $totalAmount,
            'totalWeight' => $totalWeight,
            'shippingCost' => $order['shipCost'],
            'totalCost' => $totalAmount + $order['shipCost'],
        ];

        // Prepare the items
        $items = array_map(static function ($item) {
            return [
                'name' => $item['sparePartName'],
                'id' => $item['sparePartNum'],
                'quantity' => $item['orderQty'],
                'price' => $item['sparePartOrderPrice']
            ];
        }, $orderItems);

        return [
            'summary' => $summary,
            'items' => $items
        ];
    }


    private function formatDate($dateTime)
    {
        return date('d/m/Y', strtotime($dateTime));
    }

    private function formatTime($dateTime)
    {
        return date('H:i', strtotime($dateTime));
    }

    public function cancelOrder(mixed $id)
    {
        $result = $this->db->query("UPDATE Orders SET orderStatus = 'Cancelled' WHERE orderID = ?", [$id]);
        return $result ? $this->getOrder($id) : null;
    }

    public function getOrderByIdAndSalesManager($id): ?array
    {
        // Fetch order details
        $orderResult = $this->db->query("SELECT o.*, u.CompanyName as dealerCompany, u.contactName as dealerContact, u.contactNumber as dealerPhone,
                                     sm.contactName as salesManagerName, sm.contactNumber as salesManagerContact
                                     FROM Orders o
                                     JOIN UserRoles u ON o.dealerID = u.UserID
                                     JOIN UserRoles sm ON o.salesManagerID = sm.UserID
                                     WHERE o.orderID = ?", [$id]);

        if (empty($orderResult)) {
            return null; // Order not found or doesn't belong to this dealer
        }

        $order = $orderResult[0];

        // Fetch order items
        $orderItems = $this->db->query("SELECT oi.*, sp.sparePartName, sp.weight
                                FROM OrdersItem oi
                                JOIN Item sp ON oi.sparePartNum = sp.sparePartNum
                                WHERE oi.orderID = ?", [$id]);

        // Calculate totals
        $totalAmount = 0;
        $totalWeight = 0;
        foreach ($orderItems as &$item) {
            $item['totalPrice'] = $item['orderQty'] * $item['sparePartOrderPrice'];
            $totalAmount += $item['totalPrice'];
            $totalWeight += $item['orderQty'] * ($item['weight'] ?? 0);
        }

        // Prepare the summary
        $summary = [
            'id' => $order['orderID'],
            'orderDate' => $this->formatDate($order['orderDateTime']),
            'orderTime' => $this->formatTime($order['orderDateTime']),
            'orderStatus' => $order['orderStatus'],
            'salesManagerId' => $order['salesManagerID'],
            'salesManager' => $order['salesManagerName'],
            'salesManagerContact' => $order['salesManagerContact'],
            'deliveryAddress' => $order['deliveryAddress'],
            'deliveryDate' => $this->formatDate($order['deliveryDate']),
            'contactPerson' => $order['dealerContact'],
            'contactPhone' => $order['dealerPhone'],
            'totalAmount' => $totalAmount,
            'totalWeight' => $totalWeight,
            'shippingCost' => $order['shipCost'],
            'totalCost' => $totalAmount + $order['shipCost'],
        ];

        // Prepare the items
        $items = array_map(static function ($item) {
            return [
                'name' => $item['sparePartName'],
                'id' => $item['sparePartNum'],
                'quantity' => $item['orderQty'],
                'price' => $item['sparePartOrderPrice']
            ];
        }, $orderItems);

        return [
            'summary' => $summary,
            'items' => $items
        ];
    }

    private function getUserRole($userId)
    {
        $result = $this->db->query("SELECT UserRole As Role FROM UserRoles WHERE UserID = ?", [$userId]);
        return $result ? $result[0]['Role'] : null;
    }

    // random assign int as row number
    public function RandomAssignSalesManager() {
        try {
            // Query to get all available sales managers
            $query = "SELECT salesManagerID FROM SalesManager";
            $stmt = $this->db->prepare($query);
            $stmt->execute();

            // Fetch all salesManagerIDs
            $salesManagers = $stmt->fetchAll(PDO::FETCH_COLUMN);

            // Check if there are any sales managers
            if (empty($salesManagers)) {
                throw new Exception("No sales managers available.");
            }

            // Randomly select a sales manager
            $randomIndex = array_rand($salesManagers);
            return $salesManagers[$randomIndex];
        } catch (Exception $e) {
            // Log the error
            error_log("Error in RandomAssignSalesManager: " . $e->getMessage());
            return null;
        }
    }

}

class OrdersItem
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getOrdersItem($orderID, $sparePartNum)
    {
        $result = $this->db->query("SELECT * FROM OrdersItem WHERE orderID = ? AND sparePartNum = ?", [$orderID, $sparePartNum]);
        return $result ? $result[0] : null;
    }

    public function getOrdersItemsByOrderID($orderID)
    {
        return $this->db->query("SELECT * FROM OrdersItem WHERE orderID = ?", [$orderID]) ?: [];
    }

    public function getOrdersItemList()
    {
        return $this->db->query("SELECT * FROM OrdersItem") ?: [];
    }

    public function updateOrdersItem($orderID, $sparePartNum, $ordersItem)
    {
        $result = $this->db->query("UPDATE OrdersItem SET orderQty = ?, sparePartOrderPrice = ? WHERE orderID = ? AND sparePartNum = ?",
            [$ordersItem->orderQty, $ordersItem->sparePartOrderPrice, $orderID, $sparePartNum]);
        return $result ? $this->getOrdersItem($orderID, $sparePartNum) : null;
    }

    public function deleteOrdersItem($orderID, $sparePartNum)
    {
        $result = $this->db->query("DELETE FROM OrdersItem WHERE orderID = ? AND sparePartNum = ?", [$orderID, $sparePartNum]);
        return $result && !$this->getOrdersItem($orderID, $sparePartNum);
    }

    public function addOrdersItem($ordersItem)
    {
        $result = $this->db->query("INSERT INTO OrdersItem (orderID, sparePartNum, orderQty, sparePartOrderPrice) VALUES (?, ?, ?, ?)",
            [$ordersItem->orderID, $ordersItem->sparePartNum, $ordersItem->orderQty, $ordersItem->sparePartOrderPrice]);
        return $result ? $this->getOrdersItem($ordersItem->orderID, $ordersItem->sparePartNum) : null;
    }

}