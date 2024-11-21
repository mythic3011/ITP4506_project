// customerNavigation.js

$(document).ready(function() {
    const navbarItems = {
        admin: [
            {
                category: 'Dashboard',
                items: [
                    { name: 'Admin Home', url: '/admin/home' }
                ]
            },
            {
                category: 'Management',
                items: [
                    { name: 'Users', url: '/admin/users' },
                    { name: 'Reports', url: '/admin/reports' }
                ]
            }
        ],
        customer: [
            {
                category: 'Home',
                items: [
                    { name: 'Customer Home', url: '/customer/home' }
                ]
            },
            {
                category: 'Vehicles',
                items: [
                    { name: 'View Vehicles', url: '/vehicles' },
                    { name: 'Wishlist', url: '/wishlist' },
                    { name: 'Orders', url: '/orders' }
                ]
            },
            {
                category: 'Insurance',
                items: [
                    { name: 'Insurance Info', url: '/insurance' },
                    { name: 'Apply', url: '/insurance/apply' },
                    { name: 'Applications', url: '/insurance/applications' }
                ]
            }
        ],
        staff: [
            {
                category: 'Dashboard',
                items: [
                    { name: 'Staff Home', url: '/staff/home' }
                ]
            },
            {
                category: 'Tasks',
                items: [
                    { name: 'View Tasks', url: '/tasks' },
                    { name: 'Update Status', url: '/tasks/update' }
                ]
            }
        ]
    };

    // Function to render the full navbar
    function renderNavbar(role) {
        const navbar = $('<nav id="navbar" class="navbar bg-white shadow-md p-4 flex space-x-4"></nav>');
        const roleItems = navbarItems[role] || [];

        roleItems.forEach(category => {
            // Create category element
            const categoryElem = $(`
                <div class="relative">
                    <button class="category-toggle text-gray-700 hover:text-blue-500 focus:outline-none">
                        ${category.category}
                    </button>
                    <div class="dropdown-menu hidden absolute bg-white shadow-lg rounded-md mt-2">
                        <ul class="py-2">
                        </ul>
                    </div>
                </div>
            `);

            // Append items to category
            const itemsContainer = categoryElem.find('.dropdown-menu ul');
            category.items.forEach(item => {
                const itemElem = $(`
                    <li>
                        <a href="${item.url}" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                            ${item.name}
                        </a>
                    </li>
                `);
                itemsContainer.append(itemElem);
            });

            // Append category to navbar
            navbar.append(categoryElem);
        });

        // Append navbar to the body
        $('body').prepend(navbar);

        // Open/Close functionality
        $('.category-toggle').on('click', function() {
            $(this).next('.dropdown-menu').toggle();
        });

        // Close dropdowns when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.category-toggle, .dropdown-menu').length) {
                $('.dropdown-menu').hide();
            }
        });
    }

    // Function to get user role (replace with actual logic)
    function getUserRole() {
        // get user role from local storage or return 'customer' if not logged in
        return localStorage.getItem('role') || 'customer';
    }

    // Render the navbar
    const userRole = getUserRole();
    renderNavbar(userRole);
});