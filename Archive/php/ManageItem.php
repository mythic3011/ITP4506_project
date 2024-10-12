<?php
// ManageItem.php

if(isset($_REQUEST['act'])){
    $action = $_REQUEST['act'];
    if($action == 'listTotal'){
        $conn = mysqli_connect('127.0.0.1','root','','projectdb');
        $cmd = "SELECT COUNT(*) FROM item";
        $result = mysqli_query($conn, $cmd);
        $row = mysqli_fetch_row($result);
        $data = array('total' => $row[0]);
        echo json_encode($data);
        exit;
    }
}

require_once './class/Database.php';
require_once './class/SparePart.php';

header('Content-Type: application/json');


error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Action: " . ($_GET['action'] ?? 'Not set'));
error_log("POST data: " . print_r($_POST, true));
error_log("FILES data: " . print_r($_FILES, true));

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log the raw POST data
$rawPostData = file_get_contents('php://input');
error_log("Raw POST data: " . $rawPostData);

$sparePart = new SparePart();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($method) {
        case 'GET':
            if ($action === 'getNewSparePartId') {
                $newId = $sparePart->getNewSparePartId();
                echo json_encode(['status' => 'success', 'data' => $newId]);
            } else if ($action === 'list') {
                $sparePartList = $sparePart->getSparePartList();
                echo json_encode(['status' => 'success', 'data' => $sparePartList, 'length' => count($sparePartList)]);
            } elseif ($action === 'get' && isset($_GET['id'])) {
                $item = $sparePart->getSparePartById($_GET['id']);
                if ($item !== null) {
                    echo json_encode(['status' => 'success', 'data' => $item]);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Item not found']);
                }
            } else {
                throw new Exception('Invalid GET action');
            }
            break;

        case 'POST':
            if ($action === 'update') {
                if (!isset($_POST['id'])) {
                    throw new Exception('Item ID is required for update');
                }
                $updateData = $_POST;
                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                    $uploadDir = '../../resources/image/spare/';
                    $fileName = basename($_FILES['image']['name']);
                    $uploadFile = $uploadDir . $fileName;
                    if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
                        $updateData['sparePartImage'] = $fileName;
                    } else {
                        throw new Exception('Failed to upload image');
                    }
                }
                $sparePart->updateSparePart($_POST['id'], $updateData);
                echo json_encode(['status' => 'success', 'message' => 'Item updated successfully']);
            } else {
                $input = json_decode(file_get_contents('php://input'), true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception('Invalid JSON input');
                }

                switch ($action) {
                    case 'checkId':
                        if (!isset($_GET['id'])) {
                            echo json_encode(['error' => 'ID is required for checking']);
                            exit;
                        }
                        $exists = $sparePart->checkSparePartExists($_GET['id']);
                        echo json_encode(['exists' => $exists]);
                        exit;

                    // case 'add':
                    //     try {
                    //         error_log("Attempting to add new item: " . json_encode($input));
                    //         $newItem = $sparePart->addSparePart($input);
                    //         error_log("Item added successfully: " . json_encode($newItem));
                    //         echo json_encode(['status' => 'success', 'message' => 'Item added successfully', 'data' => $newItem]);
                    //     } catch (Exception $e) {
                    //         error_log("Error adding item: " . $e->getMessage());
                    //         echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
                    //     }
                    //     break;
                    case 'add':
                        $rawInput = file_get_contents('php://input');
                        error_log("Received raw data for adding new item: " . $rawInput);
                        $input = json_decode($rawInput, true);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            throw new Exception('Invalid JSON input: ' . json_last_error_msg());
                        }
                        error_log("Decoded input: " . print_r($input, true));
                    
                        // Handle the image file name
                        if (isset($input['image'])) {
                            $uploadDir = '../../resources/image/spare/';
                            $fileName = $input['image'];
                            $input['sparePartImage'] = $fileName;
                            // Note: The actual file upload will need to be handled separately
                        }
                    
                        $newItem = $sparePart->addSparePart($input);
                        error_log("New item added: " . print_r($newItem, true));
                        echo json_encode(['status' => 'success', 'message' => 'Item added successfully', 'data' => $newItem]);
                        break;
                  

                    case 'BatchDelete':
                        $sparePart->batchDeleteSparePart($input['ids']);
                        echo json_encode(['status' => 'success', 'message' => 'Items deleted successfully']);
                        break;

                    case 'delete':
                        if (!isset($input['id'])) {
                            throw new Exception('Item ID is required for deletion');
                        }
                        $sparePart->deleteSparePart($input['id']);
                        echo json_encode(['status' => 'success', 'message' => 'Item deleted successfully']);
                        break;

                    default:
                        throw new Exception('Invalid POST action');
                }
            }
            break;

        default:
            throw new Exception('Invalid request method');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
