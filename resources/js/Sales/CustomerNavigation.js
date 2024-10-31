$(document).ready(function () {
    // Search functionality
    $('#search-bar-vehicles').on('input', function () {
        const query = $(this).val().toLowerCase();
        // Assuming `vehicles` is an array of vehicle objects available in scope
        const filteredVehicles = vehicles.filter(vehicle => vehicle.name.toLowerCase().includes(query));
        // Render filtered results (implement renderFilteredVehicles function)
        renderFilteredVehicles(filteredVehicles);
    });

    // Hamburger menu toggle
    $('.hamburger').click(function () {
        $('.nav-links').toggleClass('hidden');
    });

    // Highlight active link
    const currentPath = window.location.pathname;
    $('.nav-links a').each(function () {
        const linkPath = $(this).attr('href');
        if (linkPath === currentPath) {
            $(this).addClass('text-blue-500 font-bold'); // Highlight active link
        }
    });
});