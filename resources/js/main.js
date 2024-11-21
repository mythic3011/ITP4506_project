import {toggleDarkMode, setInitialDarkMode} from './module/darkMode.js';
import {updatePageLanguage} from './module/language.js';
import {initRouter} from './router.js';
import {initAuth} from './services/auth.js';
import {initializeMockData} from './services/admin/mockData.js';
import {initTheme} from './services/theme.js';

$(document).ready(async () => {
    try {
        await initAuth();
        initTheme();
        initRouter();

        console.log("Main.js loaded");
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});


export function initializeMain() {
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

    // Language
    const languageSelect = $("language");
    if (languageSelect) {
        const savedLanguage = localStorage.getItem("language") || "en";
        languageSelect.value = savedLanguage;
        updatePageLanguage(savedLanguage, languageMap); // Assuming languageMap is defined globally

        languageSelect.addEventListener("change", function () {
            const selectedLanguage = this.value;
            localStorage.setItem("language", selectedLanguage);
            updatePageLanguage(selectedLanguage, languageMap);
        });
    }

    // Logout functionality
    $('logoutButton').addEventListener('click', logout);

    // Store the current page in the history array
    const historyArr = JSON.parse(sessionStorage.getItem('pageHistory')) || [];
    historyArr.push(window.location.href);
    sessionStorage.setItem('pageHistory', JSON.stringify(historyArr));
}

export function logout() {
    localStorage.removeItem('userToken');
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('logout');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('theme');
    sessionStorage.removeItem('language');
    sessionStorage.removeItem('pageHistory');
    window.location.href = '../logout.html';
}
