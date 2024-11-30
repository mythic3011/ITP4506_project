$(document).ready(function () {
    $('#loginForm').on('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        const $loginButton = $('button[type="submit"]');
        const $message = $('#message');

        // Show loading spinner
        $loginButton.addClass('loading').prop('disabled', true);
    });

    // Load remembered username
    const rememberedUsername = localStorage.getItem('username');
    if (rememberedUsername) {
        $('#username').val(rememberedUsername);
        $('#remember-me').prop('checked', true);
    }

    $('#darkModeToggle').on('click', function () {
        $('body').toggleClass('dark-mode');
        $('.mainContainer').toggleClass('dark-mode');
        $('input').toggleClass('dark-mode');
        $('#darkModeToggle').toggleClass('dark-mode');
        $('#switch-theme').toggleClass('dark-mode');
        $('footer').toggleClass('dark-mode');
        $('nav').toggleClass('dark-mode');
        $('#menu').toggleClass('dark-mode');
        $('li').toggleClass('dark-mode');
        $('a').toggleClass('dark-mode');
        $('div_menu').toggleClass('dark-mode');

        // Save theme preference
        const isDarkMode = $('body').hasClass('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // Check system preference for dark mode or saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        $('body').addClass('dark-mode');
        $('.mainContainer').addClass('dark-mode');
        $('input').addClass('dark-mode');
        $('#darkModeToggle').addClass('dark-mode');
        $('body').addClass('switch-theme');
        $('footer').addClass('dark-mode');
        $('nav').addClass('dark-mode');
        $('#menu').addClass('dark-mode');
        $('li').addClass('dark-mode');
        $('a').addClass('dark-mode');
        $('div_menu').addClass('dark-mode');

    }
});