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

error_log('Login attempt started');
error_log("Received POST data: " . print_r($_POST, true));
error_log("Session CSRF token: " . ($_SESSION['csrf_token'] ?? 'Not set'));
error_log("Received CSRF token: " . ($_POST['csrf_token'] ?? 'Not set'));
error_log("Session ID: " . session_id());
error_log("Session data: " . print_r($_SESSION, true));

// CSRF validation
if (!isset($_POST['csrf_token'])) {
    error_log("CSRF token not provided");
    sendJsonResponse(['error' => 'CSRF token not provided'], 403);
}

if (!$csrf->validateToken($_POST['csrf_token'])) {
    error_log("CSRF validation failed");
    sendJsonResponse(['error' => 'Invalid CSRF token'], 403);
}

error_log('CSRF validation passed');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log('Invalid request method');
    sendJsonResponse(['error' => 'Invalid request method'], 405);
}

// Verify Turnstile response (skipped in dev environment)
if (!IS_DEV_ENV) {
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
        error_log('Turnstile verification failed: ' . $e->getMessage());
        sendJsonResponse(['error' => 'Turnstile verification failed'], 400);
    }

    if (!$responseData['success']) {
        error_log('Turnstile verification failed');
        sendJsonResponse(['error' => 'Turnstile verification failed'], 400);
    }
} else {
    error_log('Development environment: Turnstile verification bypassed');
}

// Get login credentials
$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_EMAIL);
$password = $_POST['password'] ?? '';

error_log('Attempting login for username: ' . $username);

// Ensure username and password are provided
if (empty($username) || empty($password)) {
    error_log('Username or password is empty');
    sendJsonResponse(['error' => 'Username or password is empty'], 400);
}

// Attempt login
try {
    error_log('Checking if user is locked');
    if ($user->isUserLocked($username)) {
        throw new RuntimeException('Account is temporarily locked. Please try again later.', 403);
    }

    $loginResult = $auth->login($username, $password);

    if (isset($loginResult['error'])) {
        error_log('Login failed: ' . $loginResult['error']);
        $user->logLoginAttempt($username, false);
        sendJsonResponse(['error' => $loginResult['error']], 401);
    } else {
        error_log('Login successful for username: ' . $username);
        setcookie('username', $username, time() + 3600000000, '/');
        $user->logLoginAttempt($username, true);
        $role = $loginResult['result']['role'] ?? 'DefaultRole';
        $loginResult['result']['page'] = $user->getPageForRole($role);
        sendJsonResponse($loginResult);
    }

} catch (Exception $e) {
    error_log('Login error: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    sendJsonResponse(['error' => $e->getMessage()], $e->getCode() ?: 400);
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

// remove old user token
if (!$auth->validateToken($_POST['CheckToken'])) {
    echo "Invalid Token";
    exit;
}