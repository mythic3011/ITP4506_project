// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Dark mode
    const isLoggedIn = sessionStorage.getItem('logout') === false;

    // Check if the user is logged in
    if (!isLoggedIn) {
        // redirect to login page
        window.location.href = '../index.html';
    }
});
