<?php

require_once 'Database.php';

class Report {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getStockReport() {
        $result = $this->db->query("SELECT
CAST(i.sparePartNum AS CHAR) AS partNumber,
    i.sparePartName AS partName,
    CONCAT('../../resources/image/spare/', i.sparePartImage) AS partImage,
    (
        SELECT GROUP_CONCAT(CAST(o.orderID AS CHAR)) AS orderNumbers
        FROM orders o
        INNER JOIN ordersitem oi ON o.orderID = oi.orderID
        WHERE CAST(i.sparePartNum AS CHAR) = oi.sparePartNum
    ) AS orderNumbers,
    (
        SELECT GROUP_CONCAT(CAST(oi.orderQty AS CHAR)) AS orderQuantities
        FROM orders o
        INNER JOIN ordersitem oi ON o.orderID = oi.orderID
        WHERE CAST(i.sparePartNum AS CHAR) = oi.sparePartNum
    ) AS orderQuantities,
    CAST(
        (
            SELECT SUM(oi.orderQty * oi.sparePartOrderPrice) AS totalSalesAmount
            FROM orders o
            INNER JOIN ordersitem oi ON o.orderID = oi.orderID
            WHERE CAST(i.sparePartNum AS CHAR) = oi.sparePartNum
        ) AS CHAR
    ) AS totalSalesAmount
FROM item i;");
        return $result ? $result : [];
    }
}
