<?php
// profile.php

if($_REQUEST['action'] == 'getInfo') {
    header('Content-Type: application/json');
    $username = $_COOKIE['username'] ?? '';
    $conn = mysqli_connect('127.0.0.1','root','','projectdb');
    $sql = "SELECT * FROM dealer WHERE dealerID = '$username'";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    $name = $row['contactName'];
    $contactNumber = $row['contactNumber'];
    $faxNumber = $row['faxNumber'];
    $address = $row['deliveryAddress'];
    $email = $row['dealerID'];

    echo json_encode(array('name' => $name, 
        'contactNumber' => $contactNumber, 
        'faxNumber' => $faxNumber, 
        'address' => $address, 
        'email' => $email));
    exit;
}

if($_REQUEST['action'] == 'getEditInfo') {
    header('Content-Type: application/json');
    $username = $_COOKIE['username'] ?? '';
    $conn = mysqli_connect('127.0.0.1','root','','projectdb');
    $sql = "SELECT * FROM dealer WHERE dealerID = '$username'";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    $name = $row['contactName'];
    $contactNumber = $row['contactNumber'];
    $faxNumber = $row['faxNumber'];
    $address = $row['deliveryAddress'];
    $email = $row['dealerID'];

    echo json_encode(array('name' => $name, 
        'contactNumber' => $contactNumber, 
        'faxNumber' => $faxNumber, 
        'address' => $address, 
        'email' => $email));
    exit;
}

if($_REQUEST['action'] == 'updateProfile') {
    header('Content-Type: application/json');
    $username = $_COOKIE['username'] ?? '';
    $name = $_REQUEST['name'];
    $contactNumber = $_REQUEST['mobileNumber'];
    $faxNumber = $_REQUEST['faxNumber'];
    $address = $_REQUEST['addressLine1'];

    $conn = mysqli_connect('127.0.0.1','root','','projectdb');
    $sql = "UPDATE dealer SET contactName = '$name', contactNumber = '$contactNumber', faxNumber = '$faxNumber', deliveryAddress = '$address' WHERE dealerID = '$username'";
    $result = mysqli_query($conn, $sql);
    if (mysqli_affected_rows($conn) > 0) {
        echo json_encode(array('status' => 'success'));
    } else {
        echo json_encode(array('status' => 'failed'));
    }
    exit;
}

if($_REQUEST['action'] == 'updatePassword') {
    header('Content-Type: application/json');
    $username = $_COOKIE['username'] ?? '';
    $oldPW = $_REQUEST['oldPassword'];
    $newPW = $_REQUEST['newPassword'];
    
    require_once './class/User.php';
    require_once './class/CSRF.php';

    $user = new User();
    if ($user->updatePassword($username, $oldPW, $newPW)) {
        echo json_encode(array('status' => 'success'));
    } else {
        echo json_encode(array('status' => 'failed'));
    }
   

    
    exit;
}



ini_set('display_errors', '1');
error_reporting(E_ALL);

ob_start();

function sendJsonResponse(array $data, int $statusCode = 200): void
{
    ob_end_clean();
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_THROW_ON_ERROR);
    exit;
}

require_once './class/Session.php';
require_once './class/User.php';
require_once './class/CSRF.php';

$user = new User();
$csrf = new CSRF();
error_log('Profile request started');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['error' => 'Invalid request method'], 405);
}

$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

$username = $data['username'] ?? filter_input(INPUT_POST, 'username', FILTER_SANITIZE_EMAIL) ?? filter_input(INPUT_SERVER, 'HTTP_USERNAME', FILTER_SANITIZE_EMAIL);

if (!$username) {
    sendJsonResponse(['error' => 'Username is required'], 400);
}

try {
    $userData = $user->getUser($username);
    if (!$userData) {
        throw new RuntimeException('User not found', 404);
    }

    $names = explode(' ', $userData['contactName'], 2);
    $addressParts = parseAddress($userData['deliveryAddress']);

    $userProfile = [
        'username' => $userData['UserID'],
        'FullName' => $userData['contactName'],
        'email' => $userData['UserID'],
        'firstName' => $names[0] ?? '',
        'lastName' => $names[1] ?? '',
        'mobileNumber' => $userData['contactNumber'],
        'faxNumber' => $userData['faxNumber'],
        'addressLine1' => $addressParts['addressLine1'],
        'addressLine2' => $addressParts['addressLine2'],
        'stateProvince' => $addressParts['stateProvince'],
        'district' => $addressParts['district'],
        'city' => $addressParts['city'],
        'country' => $addressParts['country'],
    ];

    sendJsonResponse($userProfile);
} catch (Exception $e) {
    error_log('Profile error: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    sendJsonResponse(['error' => $e->getMessage()], $e->getCode() ?: 400);
}

function parseAddress($address) {
    $parts = array_map('trim', explode(',', $address));
    $count = count($parts);

    return [
        'addressLine1' => $count > 0 ? $parts[0] : '',
        'addressLine2' => $count > 1 ? $parts[1] : '',
        'district' => $count > 2 ? $parts[$count - 3] : '',
        'city' => $count > 3 ? $parts[$count - 2] : '',
        'stateProvince' => $count > 1 ? $parts[$count - 1] : '',
        'country' => $count > 0 ? end($parts) : '',
    ];
}
