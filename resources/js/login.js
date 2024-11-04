document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const loginMessage = document.getElementById('loginMessage');
    const rememberMe = document.getElementById('remember-me');
    const usernameInput = document.getElementById('username');
    const html = document.documentElement;

    if (!loginForm) console.error('Login form not found');
    if (!loginButton) console.error('Login button not found');
    if (!loginMessage) console.error('Login message element not found');
    if (!rememberMe) console.error('Remember me checkbox not found');
    if (!usernameInput) console.error('Username input not found');


    // Load remembered username if exists
    const rememberedUsername = localStorage.getItem('username');
    if (rememberedUsername && usernameInput) {
        usernameInput.value = rememberedUsername;
        if (rememberMe) rememberMe.checked = true;
    }

    if (loginForm && loginButton && loginMessage) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loginButton.disabled = true;
            loginButton.textContent = 'Logging in...';

            const formData = new FormData(loginForm);

            fetch('resources/php/login.php', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Server response:', data);
                    if (data.data && data.data.success) {
                        loginMessage.textContent = 'Login successful!';
                        loginMessage.style.color = 'green';

                        if (rememberMe && rememberMe.checked) {
                            localStorage.setItem('userToken', data.data.token);
                            localStorage.setItem('remember-me', 'true');
                            localStorage.setItem('username', data.data.username);
                            loginMessage.textContent = 'Login successful! Remember me is enabled.';
                        } else {
                            localStorage.removeItem('userToken');
                            localStorage.removeItem('remember-me');
                            localStorage.removeItem('username');
                        }

                        if (data.data.page === '/2fa') {
                            console.log('Redirecting to 2FA page');
                            window.location.href = data.data.page;
                        } else if (data.data.role === 'Sales Manager') {
                            console.log('Redirecting to Sales Manager page');
                            window.location.href = '../../page/Staff/order.html';
                        } else {
                            setTimeout(() => {
                                window.location.href = data.data.page;
                            }, 1000);
                        }
                    } else {
                        throw new Error(data.data.error || 'Login failed. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Login error:', error);
                    loginMessage.textContent = error.message || 'An error occurred. Please try again.';
                    loginMessage.style.color = 'red';
                    loginButton.disabled = false;
                    loginButton.textContent = 'Login';
                });
        });
    } else {
        console.error('One or more required elements are missing from the page.');
    }
});
