<?php
require_once("Database.php");

class SparePart
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getSparePart($id)
    {
        $result = $this->db->query("SELECT * FROM Item WHERE sparePartNum = ?", [$id]);
        return $result ? $result[0] : null;
    }

    public function getSparePartList()
    {
        $result = $this->db->query("SELECT * FROM Item");
        return $result ? $result : [];
    }

    public function updateSparePart($id, $data)
    {
        $allowedFields = ['stockItemQty', 'price', 'sparePartDescription', 'sparePartImage'];
        $updateData = array_intersect_key($data, array_flip($allowedFields));

        $setClauses = [];
        $params = [];
        foreach ($updateData as $key => $value) {
            $setClauses[] = "$key = ?";
            $params[] = $value;
        }
        $params[] = $id;

        $sql = "UPDATE Item SET " . implode(', ', $setClauses) . " WHERE sparePartNum = ?";
        return $this->db->query($sql, $params);
    }


    public function deleteSparePart($id)
    {
        $result = $this->db->query("DELETE FROM Item WHERE sparePartNum = ?", [$id]);
        return $result && !$this->getSparePart($id);
    }

    public function addSparePart($data)
    {
        error_log("Adding new spare part with data: " . print_r($data, true));

        if (!isset($data['sparePartNum']) || empty($data['sparePartNum'])) {
            throw new Exception("Valid spare part number is required");
        }

        $sql = "INSERT INTO Item (sparePartNum, sparePartCategory, sparePartName, weight, stockItemQty, price, sparePartDescription, sparePartImage) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $params = [
            $data['sparePartNum'],
            intval($data['sparePartCategory']),
            $data['sparePartName'],
            floatval($data['weight']),
            intval($data['stockItemQty']),
            floatval($data['price']),
            $data['sparePartDescription'] ?? '',
            "NoImage.jpg"
        ];

        error_log("Executing SQL: " . $sql);
        error_log("With parameters: " . print_r($params, true));

        $result = $this->db->query($sql, $params);

        if ($result === false) {
            throw new Exception("Failed to add new spare part: " . $this->db->error);
        }

        $insertedItem = $this->getSparePart($data['sparePartNum']);
        if (!$insertedItem) {
            throw new Exception("Failed to retrieve the newly inserted spare part");
        }

        error_log("Successfully added new spare part: " . print_r($insertedItem, true));

        return $insertedItem;
    }

    public function getNewSparePartId()
    {
        $result = $this->db->query("SELECT MAX(sparePartNum) as max FROM Item");
        if ($result === false) {
            throw new Exception("Database query failed: " . $this->db->error);
        }
        if (empty($result) || $result[0]['max'] === null) {
            return 1;
        }
        $newId = intval($result[0]['max']) + 1;
        error_log("Generated new spare part ID: " . $newId);
        return $newId;
    }








    // public function getSparePartById(mixed $id)
    // {
    //     $result = $this->db->query("SELECT * FROM Item WHERE sparePartNum = ?", [$id]);
    //     return $result ? $result[0] : null;
    // }

    public function getSparePartById($id)
    {
        $result = $this->db->query("SELECT * FROM Item WHERE sparePartNum = ?", [$id]);
        if ($result && isset($result[0])) {
            // Map the database fields to the expected property names
            return [
                'sparePartNum' => $result[0]['sparePartNum'],
                'sparePartCategory' => $result[0]['sparePartCategory'],
                'sparePartName' => $result[0]['sparePartName'],
                'weight' => $result[0]['weight'],
                'stockItemQty' => $result[0]['stockItemQty'],
                'price' => $result[0]['price'],
                'sparePartDescription' => $result[0]['sparePartDescription'],
                'sparePartImage' => $result[0]['sparePartImage']
            ];
        }
        return null;
    }

    public function batchDeleteSparePart(mixed $ids)
    {
        // array of ids for spare parts to be deleted
        $ids = is_array($ids) ? $ids : [$ids];
        $result = $this->db->query("DELETE FROM Item WHERE sparePartNum IN (" . implode(',', $ids) . ")");
        return $result;
    }


    public function checkSparePartExists($id)
    {
        $result = $this->db->query("SELECT COUNT(*) as count FROM Item WHERE sparePartNum = ?", [$id]);
        return $result[0]['count'] > 0;
    }

    public function getSpareParts()
    {
        $result = $this->db->query("SELECT * FROM Item");
        return $result ? $result : [];
    }

    public function getAllSpareParts()
    {
        $result = $this->db->query("SELECT * FROM Item");
        return $result ? $result : [];
    }
}


?>
