document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const footer = document.querySelector('footer');
    const container = document.querySelector('.container');
    const inputs = document.querySelectorAll('input');
    const selects = document.querySelectorAll('select');
    const options = document.querySelectorAll('.option');
    const estimateSidebar = document.querySelector('.estimateSidebar');
    const estimateMainContent = document.querySelector('.estimateMainContent');
    const estimateTitle = document.querySelector('.estimateTitle');
    const estimateDetails = document.querySelector('.estimateDetails');
    const price = document.querySelector('#price');
    const progressBarContainer = document.querySelector('.progress_bar_container');

    // Check for saved dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'enabled';
    if (darkMode) {
        enableDarkMode();
    }

    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    function enableDarkMode() {
        body.classList.add('dark-mode');
        darkModeToggle.classList.add('dark-mode');
        navbar?.classList.add('dark-mode');
        footer?.classList.add('dark-mode');
        container?.classList.add('dark-mode');
        progressBarContainer?.classList.add('dark-mode');
        estimateSidebar?.classList.add('dark-mode');
        estimateMainContent?.classList.add('dark-mode');
        estimateTitle?.classList.add('dark-mode');
        estimateDetails?.classList.add('dark-mode');
        price?.classList.add('dark-mode');

        navLinks.forEach(link => link.classList.add('dark-mode'));
        inputs.forEach(input => input.classList.add('dark-mode'));
        selects.forEach(select => select.classList.add('dark-mode'));
        options.forEach(option => option.classList.add('dark-mode'));

        localStorage.setItem('darkMode', 'enabled');
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        darkModeToggle.classList.remove('dark-mode');
        navbar?.classList.remove('dark-mode');
        footer?.classList.remove('dark-mode');
        container?.classList.remove('dark-mode');
        progressBarContainer?.classList.remove('dark-mode');
        estimateSidebar?.classList.remove('dark-mode');
        estimateMainContent?.classList.remove('dark-mode');
        estimateTitle?.classList.remove('dark-mode');
        estimateDetails?.classList.remove('dark-mode');
        price?.classList.remove('dark-mode');

        navLinks.forEach(link => link.classList.remove('dark-mode'));
        inputs.forEach(input => input.classList.remove('dark-mode'));
        selects.forEach(select => select.classList.remove('dark-mode'));
        options.forEach(option => option.classList.remove('dark-mode'));

        localStorage.setItem('darkMode', null);
    }
});