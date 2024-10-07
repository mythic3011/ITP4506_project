<?php
// profile_api.php
ini_set('display_errors', '1');
error_reporting(E_ALL);

ob_start();

require_once './class/Session.php';
require_once './class/User.php';
require_once './class/CSRF.php';
require_once './class/Auth.php';

$user = new User();
$csrf = new CSRF();
$auth = new Auth();

function authenticateUser()
{
    global $auth;
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (empty($authHeader)) {
        sendJsonResponse(['error' => 'No token provided'], 401);
    }

    $authResult = $auth->validateToken($authHeader);

    if (!$authResult || !isset($authResult['UserID'])) {
        sendJsonResponse(['error' => 'Invalid or expired token'], 401);
    }

    return $authResult['UserID'];
}

function parseAddress($address) {
    $parts = array_map('trim', explode(',', $address));
    $count = count($parts);

    $result = [
        'addressLine1' => '',
        'addressLine2' => '',
        'district' => '',
        'city' => '',
        'stateProvince' => '',
        'country' => ''
    ];

    if ($count >= 1) $result['addressLine1'] = $parts[0];
    if ($count >= 2) $result['addressLine2'] = $parts[1];
    if ($count >= 3) $result['district'] = $parts[2];
    if ($count >= 4) $result['city'] = $parts[3];
    if ($count >= 5) $result['country'] = $parts[4];

    return $result;
}

function handleGetProfile($user, $userId)
{
    $userData = $user->getUser($userId);
    if (!$userData) {
        throw new RuntimeException('User not found', 404);
    }

    $names = explode(' ', $userData['contactName'], 2);
    $addressParts = parseAddress($userData['deliveryAddress']);

    return [
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
}

function handleEditProfile($user, $userId, $data)
{
    $userData = $user->getUser($userId);
    if (!$userData) {
        throw new RuntimeException('User not found', 404);
    }

    $updateData = [];
    foreach ($data as $key => $value) {
        if (isset($userData[$key]) && $userData[$key] != $value) {
            $updateData[$key] = $value;
        }
    }

    if (!empty($updateData)) {
        $user->updateProfile($userId, $updateData);
        return ['success' => true, 'message' => 'Profile updated successfully'];
    } else {
        return ['success' => true, 'message' => 'No changes detected'];
    }
}

function handleUpdatePassword($user, $userId, $data)
{
    $currentPassword = $data['currentPassword'] ?? '';
    $newPassword = $data['newPassword'] ?? '';
    $confirmPassword = $data['confirmPassword'] ?? '';

    if (!$currentPassword || !$newPassword || !$confirmPassword) {
        return ['error' => 'All password fields are required', 'type' => 'password'];
    }

    $userData = $user->getUser($userId);
    if (!$userData) {
        throw new RuntimeException('User not found', 404);
    }

    if (!password_verify($currentPassword, $userData['password'])) {
        return ['error' => 'Current password is incorrect', 'type' => 'password'];
    }

    if ($currentPassword === $newPassword) {
        return ['error' => 'New password must be different from the current password', 'type' => 'password'];
    }

    if ($newPassword !== $confirmPassword) {
        return ['error' => 'New password and confirm password do not match', 'type' => 'password'];
    }

    $user->updatePassword($userId, $currentPassword, $newPassword);
    return ['success' => true, 'message' => 'Password updated successfully'];
}

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$rawData = file_get_contents('php://input');
$data = json_decode($rawData, true);

try {
    $userId = authenticateUser();

    switch ($method) {
        case 'GET':
            if ($action === 'get') {
                $response = handleGetProfile($user, $userId);
            } else {
                throw new RuntimeException('Invalid GET action', 400);
            }
            break;

        case 'POST':
            switch ($action) {
                case 'edit':
                    $response = handleEditProfile($user, $userId, $data);
                    break;
                case 'update_password':
                    $response = handleUpdatePassword($user, $userId, $data);
                    break;
                default:
                    throw new RuntimeException('Invalid POST action', 400);
            }
            break;

        default:
            throw new RuntimeException('Invalid request method', 405);
    }

    sendJsonResponse($response);
} catch (Exception $e) {
    error_log('Profile error: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    sendJsonResponse(['error' => $e->getMessage()], $e->getCode() ?: 400);
}

function sendJsonResponse(array $data, int $statusCode = 200): void
{
    ob_end_clean();
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_THROW_ON_ERROR);
    exit;
}