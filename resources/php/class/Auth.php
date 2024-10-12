<?php
// Auth.php

require_once 'Database.php';

class Auth {
    private $db;
    private const TOKEN_EXPIRATION = 3600; // 1 hour in seconds

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function login($username, $password) {
        $user = $this->db->query("SELECT * FROM UserRoles WHERE UserID = ?", [$username]);
        if (!$user) {
            return ['error' => 'User not found'];
        }

        if (!password_verify($password, $user[0]['password'])) {
            return ['error' => 'Invalid password'];
        }

        $token = $this->generateToken($user[0]['UserID'], $user[0]['UserRole']);

        return [
            'result' => [
                'token' => $token,
                'username' => $user[0]['UserID'],
                'role' => $user[0]['UserRole'],
                'page' => $this->getPageForRole($user[0]['UserRole'])
            ]
        ];
    }

    public function logout($token) {
        // Invalidate the token
        $this->db->query("DELETE FROM user_tokens WHERE token = ?", [$token]);
        return ['message' => 'Logged out successfully'];
    }

    public function authenticateRequest() {
        $token = $this->getBearerToken();
        if (!$token) {
            return null;
        }

        $userData = $this->validateToken($token);
        if (!$userData) {
            return null;
        }

        return [
            'id' => $userData['UserID'],
            'username' => $userData['UserID'],
            'role' => $userData['UserRole']
        ];
    }

    private function generateToken($userId, $userRole) {
        $token = bin2hex(random_bytes(32));
        $expiresAt = time() + self::TOKEN_EXPIRATION;

        $this->db->query(
            "INSERT INTO user_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
            [$userId, $token, date('Y-m-d H:i:s', $expiresAt)]
        );

        return $token;
    }

    public function validateToken($token) {
        // remove 'Bearer '
        $token = str_replace('Bearer ', '', $token);
        $token = trim($token);

        $result = $this->db->query(
            "SELECT u.* FROM user_tokens t JOIN UserRoles u ON t.user_id = u.UserID 
         WHERE t.token = ? AND t.expires_at > NOW()",
            [$token]
        );

        return $result ? $result[0] : null;
    }

    public function getBearerToken() {
        $headers = apache_request_headers();
        if (!isset($headers['Authorization'])) {
            return null;
        }
        if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
        return null;
    }

    private function getPageForRole($role) {
        $pages = [
            "Dealer" => "./page/dealer/viewSparePart.php",
            "SalesManager" => "./page/staff/order.html"
        ];
        return $pages[$role] ?? "index.html";
    }
}
