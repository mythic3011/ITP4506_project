<?php
declare(strict_types=1);
const IS_DEV_ENV = true; // Set this to false for production

// Start output buffering
ob_start();

// Enable error reporting for debugging (remove in production)
ini_set('display_errors', '1');
error_reporting(E_ALL);

// Include necessary files
require_once './class/Database.php';
require_once './class/Session.php';
require_once './class/User.php';
require_once './class/CSRF.php';
require_once './class/Auth.php';

// Initialize components
$user = new User();
$csrf = new CSRF();
$session = new Session(); // This will start the session
$auth = new Auth();

// Get the action from the request
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        handleLogin();
        break;
    case 'logout':
        handleLogout();
        break;
    case 'verify_token':
        handleVerifyToken();
        break;
    default:
        sendJsonResponse(['error' => 'Invalid action'], 400);
}

function handleLogin() {
    global $user, $csrf, $auth;

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendJsonResponse(['error' => 'Invalid request method'], 405);
    }

    // CSRF validation
    if (!isset($_POST['csrf_token']) || !$csrf->validateToken($_POST['csrf_token'])) {
        sendJsonResponse(['error' => 'Invalid CSRF token'], 403);
    }

    // Verify Turnstile response (skipped in dev environment)
    if (!IS_DEV_ENV) {
        verifyTurnstile();
    }

    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        sendJsonResponse(['error' => 'Username or password is empty'], 400);
    }

    try {
        if ($user->isUserLocked($username)) {
            throw new RuntimeException('Account is temporarily locked. Please try again later.', 403);
        }

        $loginResult = $auth->login($username, $password);

        if (isset($loginResult['error'])) {
            $user->logLoginAttempt($username, false);
            sendJsonResponse(['error' => $loginResult['error']], 401);
        } else {
            setcookie('username', $username, time() + 3600000000, '/');
            $user->logLoginAttempt($username, true);
            $role = $loginResult['result']['role'] ?? 'DefaultRole';
            $loginResult['result']['page'] = $user->getPageForRole($role);
            sendJsonResponse($loginResult);
        }
    } catch (Exception $e) {
        sendJsonResponse(['error' => $e->getMessage()], $e->getCode() ?: 400);
    }
}

function handleLogout() {
    global $auth;

    $token = $auth->getBearerToken();
    if (!$token) {
        sendJsonResponse(['error' => 'No token provided'], 400);
    }

    $result = $auth->logout($token);
    sendJsonResponse($result);
}

function handleVerifyToken() {
    global $auth;

    $token = $auth->getBearerToken();
    if (!$token) {
        sendJsonResponse(['error' => 'No token provided'], 400);
    }

    $isValid = $auth->validateToken($token);
    sendJsonResponse(['isValid' => $isValid]);
}

function verifyTurnstile() {
    $turnstileResponse = $_POST['turnstile_response'] ?? '';
    $secretKey = '0x4AAAAAAAdmns_EtM0RpzgyOJbc2zx-6mY';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['secret' => $secretKey, 'response' => $turnstileResponse]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    try {
        $responseData = json_decode($response, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $e) {
        sendJsonResponse(['error' => 'Turnstile verification failed'], 400);
    }

    if (!$responseData['success']) {
        sendJsonResponse(['error' => 'Turnstile verification failed'], 400);
    }
}

function sendJsonResponse(array $data, int $statusCode = 200): void
{
    $output = ob_get_clean();

    if (!empty($output)) {
        error_log("Unexpected output before JSON: " . $output);
    }

    http_response_code($statusCode);
    header('Content-Type: application/json');

    $response = ['result' => $data];

    try {
        echo json_encode($response, JSON_THROW_ON_ERROR);
    } catch (JsonException $e) {
        error_log('JSON encoding failed: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'JSON encoding failed'], JSON_THROW_ON_ERROR);
    }
    exit;
}
