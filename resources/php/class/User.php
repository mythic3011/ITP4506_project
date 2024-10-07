<?php

require_once 'Database.php';
require_once 'Session.php';

class User
{
    private ?Database $db;
    private Session $session;
    private const PASSWORD_MIN_LENGTH = 8;
    private const MAX_LOGIN_ATTEMPTS = 5;
    private const LOCKOUT_TIME = 900; // 15 minutes

    public function __construct()
    {
        $this->db = Database::getInstance();
        $this->session = new Session();
    }



    public function logLoginAttempt(string $username, bool $success): void
    {
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $success_int = $success ? 1 : 0;
        $this->db->query(
            "INSERT INTO login_attempts (username, ip_address, attempt_time, success) VALUES (?, ?, NOW(), ?)",
            [$username, $ip_address, $success_int]
        );
    }

    public function getPageForRole(string $role): string
    {
        $pages = [
            "Dealer" => "./page/dealer/viewSparePart.php",
            "SalesManager" => "./page/staff/order.html"
        ];
        return $pages[$role] ?? "index.php";
    }

    public function updateProfile(string $userId, array $data): bool
    {
        $user = $this->getCurrentUser();
        if (!$user || $user['id'] !== $userId) {
            return false;
        }

        $table = $user['role'] === 'Dealer' ? 'Dealer' : 'SalesManager';
        $idField = $user['role'] === 'Dealer' ? 'dealerID' : 'salesManagerID';

        $allowedFields = $user['role'] === 'Dealer'
            ? ['contactName', 'contactNumber', 'faxNumber', 'deliveryAddress']
            : ['managerName', 'contactNumber'];

        $updates = [];
        $params = [];

        foreach ($allowedFields as $field) {
            if (isset($data[$field]) && $this->validateInput($data[$field])) {
                $updates[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($updates)) {
            return false;
        }

        $params[] = $userId;
        $query = "UPDATE $table SET " . implode(', ', $updates) . " WHERE $idField = ?";

        $result = $this->db->query($query, $params);
        if ($result) {
            $this->updateSessionUser($userId);
        }
        return $result !== false;
    }


    private function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_ARGON2ID);
    }

    public function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    public function updatePassword(string $userId, string $currentPassword, string $newPassword): bool
    {
        $user = $this->getCurrentUser();
        if (!$user || $user['id'] !== $userId) {
            return false;
        }

        $dbUser = $this->db->query("SELECT * FROM UserRoles WHERE UserID = ?", [$userId]);
        if (empty($dbUser) || !$this->verifyPassword($currentPassword, $dbUser[0]['password'])) {
            return false;
        }

        if (strlen($newPassword) < self::PASSWORD_MIN_LENGTH || !$this->isPasswordStrong($newPassword)) {
            return false;
        }

        $hashedPassword = $this->hashPassword($newPassword);
        $table = $user['role'] === 'Dealer' ? 'Dealer' : 'SalesManager';
        $idField = $user['role'] === 'Dealer' ? 'dealerID' : 'salesManagerID';

        return $this->db->query("UPDATE $table SET password = ? WHERE $idField = ?", [$hashedPassword, $userId]) !== false;
    }

    public function logout(): void
    {
        $this->session->destroy();
    }

    public function getCurrentUser(): ?array
    {
        return $this->session->getUser();
    }

    public function isLoggedIn(): bool
    {
        return $this->session->isLoggedIn();
    }

    private function updateSessionUser(string $userId): void
    {
        $user = $this->db->query("SELECT * FROM UserRoles WHERE UserID = ?", [$userId]);
        if (!empty($user)) {
            $user = $user[0];
            $this->session->setUser([
                'id' => $user['UserID'],
                'username' => $user['UserID'],
                'role' => $user['UserRole'],
                'companyName' => $user['CompanyName'],
                'contactName' => $user['contactName'],
                'surname' => $user['Surname']
            ]);
        }
    }

    public function getUser(string $userId): ?array
    {
        $user = $this->db->query("SELECT * FROM UserRoles WHERE UserID = ?", [$userId]);
        return !empty($user) ? $user[0] : null;
    }

    public function getSession(): Session
    {
        return $this->session;
    }

    private function validateInput(string $input): bool
    {
        return strlen($input) <= 255 && !preg_match('/[<>]/', $input);
    }

    private function isPasswordStrong(string $password): bool
    {
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/', $password);
    }

    public function isUserLocked(string $username): bool
    {
        $lockInfo = $this->db->query(
            "SELECT COUNT(*) as attempts, MAX(attempt_time) as last_attempt 
             FROM login_attempts 
             WHERE username = ? AND attempt_time > DATE_SUB(NOW(), INTERVAL ? SECOND) AND success = 0",
            [$username, self::LOCKOUT_TIME]
        );

        if (!empty($lockInfo) && $lockInfo[0]['attempts'] >= self::MAX_LOGIN_ATTEMPTS) {
            return true;
        }
        return false;
    }

    public function getRoleByUserId(mixed $UserID)
    {
        $user = $this->db->query("SELECT UserRole AS Role FROM UserRoles WHERE UserID = ?", [$UserID]);
        return ($user && is_array($user) && isset($user[0]['Role'])) ? $user[0]['Role'] : null;
    }

    private function incrementLoginAttempts(string $username): void
    {
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $this->db->query(
            "INSERT INTO login_attempts (username, ip_address, attempt_time, success) VALUES (?, ?, NOW(), 0)",
            [$username, $ip_address]
        );
    }

    private function resetLoginAttempts(string $username): void
    {
        $this->db->query(
            "DELETE FROM login_attempts WHERE username = ? AND success = 0",
            [$username]
        );
    }
}
