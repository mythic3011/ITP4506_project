<?php

require_once("Database.php");
require_once("SparePart.php");

class Cart
{
    public $cartId;
    private $cartItems = [];
    private $sparePart;

    public function __construct()
    {
        $this->cartId = uniqid('', true);
        $this->sparePart = new SparePart();
    }

    public function addItem($itemID, $quantity)
    {
        $sparePartData = $this->sparePart->getSparePart($itemID);
        if (!$sparePartData) {
            throw new Exception("Item not found: $itemID");
        }

        if ($sparePartData['stockItemQty'] < $quantity) {
            throw new Exception("Not enough stock for item: $itemID");
        }

        $existingItem = $this->getCartItem($itemID);
        if ($existingItem) {
            $existingItem->quantity += $quantity;
        } else {
            $this->cartItems[] = new CartItem($itemID, $quantity);
        }
        return true;
    }

    public function getCartItems()
    {
        return $this->cartItems;
    }

    public function getCartItem($itemID)
    {
        foreach ($this->cartItems as $cartItem) {
            if ($cartItem->itemID == $itemID) {
                return $cartItem;
            }
        }
        return null;
    }

    public function updateQuantity($itemID, $quantity)
    {
        $sparePartData = $this->sparePart->getSparePart($itemID);
        if (!$sparePartData) {
            throw new Exception("Item not found: $itemID");
        }

        if ($sparePartData['stockItemQty'] < $quantity) {
            throw new Exception("Not enough stock for item: $itemID");
        }

        $cartItem = $this->getCartItem($itemID);
        if ($cartItem) {
            $cartItem->quantity = $quantity;
            return $cartItem;
        } else {
            throw new Exception("Item not found in cart: $itemID");
        }
    }

    public function removeItem($itemID)
    {
        $this->cartItems = array_filter($this->cartItems, function ($item) use ($itemID) {
            return $item->itemID != $itemID;
        });
    }

    public function getCartTotal()
    {
        $total = 0;
        foreach ($this->cartItems as $item) {
            $sparePartData = $this->sparePart->getSparePart($item->itemID);
            if ($sparePartData) {
                $total += $sparePartData['price'] * $item->quantity;
            }
        }
        return $total;
    }

    public function clearCart()
    {
        $this->cartItems = [];
    }

    public function getCartId()
    {
        return $this->cartId;
    }

    public function checkStock($itemID)
    {
        $sparePartData = $this->sparePart->getSparePart($itemID);
        if (!$sparePartData) {
            throw new Exception("Item not found: $itemID");
        }

        $cartItem = $this->getCartItem($itemID);
        $cartQuantity = $cartItem ? $cartItem->quantity : 0;

        return [
            'stockItemQty' => $sparePartData['stockItemQty'],
            'cartQuantity' => $cartQuantity,
            'isAvailable' => $sparePartData['stockItemQty'] >= $cartQuantity
        ];
    }

    public function calculateShippingCost($cart)
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
    public function getTotalWeight(){
        $totalWeight = 0;
        foreach ($this->cartItems as $item) {
            $sparePartData = $this->sparePart->getSparePart($item->itemID);
            if ($sparePartData) {
                $totalWeight += $sparePartData['weight'] * $item->quantity;
            }
        }
        return $totalWeight;
    }
}

class CartItem
{
    public $itemID;
    public $quantity;

    public function __construct($itemID, $quantity)
    {
        $this->itemID = $itemID;
        $this->quantity = $quantity;
    }

    public function getItemDetails()
    {
        $sparePart = new SparePart();
        return $sparePart->getSparePart($this->itemID);
    }

    public function getTotalPrice()
    {
        $details = $this->getItemDetails();
        return $details ? $details['price'] * $this->quantity : 0;
    }

}
?>
