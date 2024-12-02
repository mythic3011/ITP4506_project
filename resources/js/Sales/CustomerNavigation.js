$(document).ready(function () {
    // Vehicles dropdown toggle
    $('#Vehicles-dropdown-toggle').on('mouseenter', function () {
        $('#Vehicles-dropdown').stop(true, true).fadeIn(200).css('display', 'block');
    });

    $('#Vehicles-dropdown').on('mouseleave', function () {
        $(this).stop(true, true).fadeOut(200);
    });

    // Insurance dropdown toggle
    $('#Insurance-dropdown-toggle').on('mouseenter', function () {
        $('#Insurance-dropdown').stop(true, true).fadeIn(200).css('display', 'block');
    });

    $('#Insurance-dropdown').on('mouseleave', function () {
        $(this).stop(true, true).fadeOut(200);
    });

    // Close dropdowns when clicking outside
    $(document).click(function (e) {
        if (!$(e.target).closest('#Vehicles-dropdown, #Vehicles-dropdown-toggle').length) {
            $('#Vehicles-dropdown').fadeOut(200);
        }
        if (!$(e.target).closest('#Insurance-dropdown, #Insurance-dropdown-toggle').length) {
            $('#Insurance-dropdown').fadeOut(200);
        }
    });

    const notificationToggle = document.getElementById('notificationToggle');
    notificationToggle.addEventListener('click', () => {
        alert('You have new notifications!');
    });

    $('#user-menu').on('mouseenter', function () {
        $('#user-Submenu').stop(true, true).fadeIn(200).css('display', 'block');
    });

    $('#user-Submenu').on('mouseleave', function () {
        $(this).stop(true, true).fadeOut(200);
    });

    // change the username-name text and avatar when loading the page
    const user = JSON.parse(localStorage.getItem('userInfo')); // Correctly parse the user info

    if (user) {
        $('#username-name').text(user.firstName + " " + user.lastName); // Accessing firstName and lastName
        $('#username-avatar').text(getFirstLetter(user.firstName)); // Assuming getFirstLetter is a defined function
    } else {
        console.error('User information not found in localStorage.');
    }

    function getFirstLetter(name) {
        return name.charAt(0).toUpperCase();
    }
});
