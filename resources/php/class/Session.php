<?php

class Session
{
    private $sessionData;
    private $token;
    private $cookieLifetime;
    private $cookieDomain;
    private $cookiePath;
    private $cookieSecure;
    private $cookieSameSite;

    public function __construct(
        int     $cookieLifetime = 3600,
        string  $cookiePath = '/',
        ?string $cookieDomain = null,
        bool    $cookieSecure = true,
        string  $cookieSameSite = 'Lax'
    )
    {
        $this->cookieLifetime = $cookieLifetime;
        $this->cookiePath = $cookiePath;
        $this->cookieDomain = $cookieDomain;
        $this->cookieSecure = $cookieSecure;
        $this->cookieSameSite = $cookieSameSite;

        if (session_status() == PHP_SESSION_NONE) {
            $this->startSecureSession();
        }
        $this->sessionData = &$_SESSION;
        $this->token = $this->get('token') ?? $this->regenerateToken();
    }

    private function startSecureSession(): void
    {
        if (!headers_sent()) {
            ini_set('session.use_strict_mode', 1);
            ini_set('session.use_only_cookies', 1);
            ini_set('session.cookie_httponly', 1);
            ini_set('session.cookie_secure', $this->cookieSecure ? 1 : 0);
            ini_set('session.cookie_samesite', $this->cookieSameSite);
            ini_set('session.gc_maxlifetime', $this->cookieLifetime);

            session_set_cookie_params([
                'lifetime' => $this->cookieLifetime,
                'path' => $this->cookiePath,
                'domain' => $this->cookieDomain,
                'secure' => $this->cookieSecure,
                'httponly' => true,
                'samesite' => $this->cookieSameSite
            ]);
        }

        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }

        if (!$this->validateSession()) {
            session_regenerate_id(true);
            $this->set('created', time());
            $this->set('last_activity', time());
        }
    }

    private function validateSession(): bool
    {
        if (!isset($_SESSION['created'])) {
            return false;
        }

        if (time() - $_SESSION['created'] > $this->cookieLifetime) {
            return false;
        }

        if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 300)) {
            return false;
        }

        $_SESSION['last_activity'] = time();
        return true;
    }

    public function set(string $key, $value): void
    {
        if (!empty($key) && $value !== null) {
            $this->sessionData[$key] = $value;
        } else {
            throw new InvalidArgumentException("Invalid key or value");
        }
    }

    public function get(string $key)
    {
        return $this->sessionData[$key] ?? null;
    }

    public function remove(string $key): void
    {
        unset($this->sessionData[$key]);
    }

    public function setUser(array $user): void
    {
        // use for loop to set multiple cookies
        foreach ($user as $key => $value) {
            if ($value !== null) {
                $this->setCookie($key, $value, time() + 3600);
            }
        }
    }

    public function getUser(): ?array
    {
        return $this->get('user');
    }

    public function unsetUser(): void
    {
        $this->remove('user');
    }

    public function setCookie(string $name, string $value, int $expire, string $path = '/', ?string $domain = null, bool $secure = true, bool $httponly = true): void
    {
        setcookie($name, $value, [
            'expires' => $expire,
            'path' => $path,
            'domain' => $domain,
            'secure' => $secure,
            'httponly' => $httponly,
            'samesite' => $this->cookieSameSite
        ]);
    }

    public function getCookie(string $name): ?string
    {
        return $_COOKIE[$name] ?? null;
    }

    public function deleteCookie(string $name, string $path = '/', ?string $domain = null): void
    {
        if (isset($_COOKIE[$name])) {
            $this->setCookie($name, '', time() - 3600, $path, $domain);
            unset($_COOKIE[$name]);
        }
    }

    public function getToken(): string
    {
        return $this->token;
    }

    public function regenerateToken(): string
    {
        $newToken = bin2hex(random_bytes(32));
        $this->set('token', $newToken);
        $this->token = $newToken;
        return $newToken;
    }

    public function destroy(): void
    {
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            $this->deleteCookie(session_name(), $params["path"], $params["domain"]);
        }
        session_destroy();
    }

    public function isLoggedIn(): bool
    {
        return isset($this->sessionData['user']);
    }

    public function validateToken(string $token): bool
    {
        return hash_equals($this->token, $token);
    }

    public function getSessionData()
    {
        return $this->sessionData;
    }

    public function setSessionData($sessionData)
    {
        $this->sessionData = $sessionData;
    }


    public function setToken($token)
    {
        $this->token = $token;
    }

    public function getCookieLifetime()
    {
        return $this->cookieLifetime;
    }

    public function setCookieLifetime($cookieLifetime)
    {
        $this->cookieLifetime = $cookieLifetime;
    }

    public function getCookieDomain()
    {
        return $this->cookieDomain;
    }

    public function setCookieDomain($cookieDomain)
    {
        $this->cookieDomain = $cookieDomain;
    }

    public function getCookiePath()
    {
        return $this->cookiePath;
    }

    public function setCookiePath($cookiePath)
    {
        $this->cookiePath = $cookiePath;
    }

    public function getCookieSecure()
    {
        return $this->cookieSecure;
    }

    public function setCookieSecure($cookieSecure)
    {
        $this->cookieSecure = $cookieSecure;
    }

    public function getCookieSameSite()
    {
        return $this->cookieSameSite;
    }

    public function setCookieSameSite($cookieSameSite)
    {
        $this->cookieSameSite = $cookieSameSite;
    }
}
