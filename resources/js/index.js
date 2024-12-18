$(document).ready(function () {
    $('#loginForm').on('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        const $loginButton = $('button[type="submit"]');
        const $message = $('#message');
        const $systemSelect = $('#system-select-form').val();

        // Show loading spinner
        $loginButton.addClass('loading').prop('disabled', true);

        $.getJSON('resources/json/user.json', function (users) {
            const user = users.find(user => user.email === username && user.password === password);

            if (user) {
                $message.text('Redirecting...').addClass('success').removeClass('error');
                $loginButton.removeClass('loading').text('Login successful!');
                localStorage.setItem('loginUser', username);
                localStorage.setItem('loginUserName', user.firstName + " " + user.lastName);
                if(user.InsuranceLicenseNumber){
                    localStorage.setItem('loginUserLicense', user.InsuranceLicenseNumber);
                }

                if ($('#remember-me').is(':checked')) {
                    localStorage.setItem('username', username);
                } else {
                    localStorage.removeItem('username');
                }

                // Store the user data in the session storage
                sessionStorage.setItem('user', JSON.stringify(user));
                sessionStorage.setItem('logout', false);
                sessionStorage.setItem('last-login', new Date().getTime());
                sessionStorage.setItem('lml_notifications', JSON.stringify([
                    {message: `Welcome Back! user ${username}`, type: 'success'},
                    {message: 'You have successfully logged in.', type: 'success'}
                ]));

                // Redirect based on user role
                setTimeout(() => {
                    window.location.href = `./page/${user.role}/${$systemSelect}/index.html`;
                }, 3000);
            } else {
                $message.text('Invalid username or password.').addClass('error').removeClass('success');

                $loginButton.removeClass('loading').prop('disabled', false).text('Login');
            }
        }).fail(function () {
            $message.text('Error loading user data.').addClass('error').removeClass('success');
            $loginButton.removeClass('loading').prop('disabled', false).text('Login');
        });
    });

    // Load remembered username
    const rememberedUsername = localStorage.getItem('username');
    if (rememberedUsername) {
        $('#username').val(rememberedUsername);
        $('#remember-me').prop('checked', true);
    }


    // Deprecated to develop new theme
    // $('#darkModeToggle').on('click', function () {
    //     $('body').toggleClass('dark-mode');
    //     $('.container').toggleClass('dark-mode');
    //     $('input').toggleClass('dark-mode');
    //     $('#darkModeToggle').toggleClass('dark-mode');
    //     $('#switch-theme').toggleClass('dark-mode');
    //     $('footer').toggleClass('dark-mode');
    //
    //     // Save theme preference
    //     const isDarkMode = $('body').hasClass('dark-mode');
    //     localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    // });
    //
    // // Check system preference for dark mode or saved preference
    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    //     $('body').addClass('dark-mode');
    //     $('.container').addClass('dark-mode');
    //     $('input').addClass('dark-mode');
    //     $('#darkModeToggle').addClass('dark-mode');
    //     $('body').addClass('switch-theme');
    //     $('footer').addClass('dark-mode');
    // }
});