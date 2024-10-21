$(document).ready(function () {
    $('#mobile-menu-button').on('click', function () {
        $('#navbar-default').toggle();
    });

    // mobile menu button click event
    $('.navbar-item').on('click', function () {
        $('.navbar-item').removeClass('active');
        $(this).addClass('active');
    });
});

