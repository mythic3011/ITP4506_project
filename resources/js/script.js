// main.js
import { logout } from './module/auth.js';
import { toggleDarkMode, setInitialDarkMode } from './module/darkMode.js';
import { updatePageLanguage } from './module/language.js';

document.addEventListener('DOMContentLoaded', function() {
    const $ = id => document.getElementById(id);
    // Dark mode
    setInitialDarkMode();
    $('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Mobile menu
    const mobileMenuButton = $('mobile-menu-button');
    const navbar = $('navbar-default');

    function toggleMobileMenu() {
        navbar.classList.toggle('hidden');
    }

    mobileMenuButton.addEventListener('click', toggleMobileMenu);

    // Logout functionality
    $('logoutButton').addEventListener('click', logout);

    // Store the current page in the history array
    const historyArr = JSON.parse(sessionStorage.getItem('pageHistory')) || [];
    historyArr.push(window.location.href);
    sessionStorage.setItem('pageHistory', JSON.stringify(historyArr));
});
