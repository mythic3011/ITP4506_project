$(document).ready(function () {
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

    // Function to get user role (replace with actual logic)
    function getUserRole() {
        // Retrieve user role from local storage or default to 'customer'
        return localStorage.getItem('role') || 'customer';
    }

    // Function to get user information (replace with actual logic)
    function getUserInfo() {
        // Example user data; replace with actual data retrieval
        return {
            name: localStorage.getItem('username') || 'User',
            avatar: localStorage.getItem('avatar') || ''
        };
    }

    // Function to render the full navbar
    function renderNavbar(role) {
        const userInfo = getUserInfo();
        const userFirstLetter = userInfo.name.charAt(0).toUpperCase();

        // Create header
        const header = $(`
            <header class="navbar bg-white shadow-md sticky top-0 z-50">
                <div class="container mx-auto flex items-center justify-between p-4">
                    ${createLogo()}
                    ${createSearchBar()}
                    <nav id="navbar" class="flex space-x-4"></nav>
                    ${createUserMenu(userFirstLetter, userInfo.name)}
                </div>
            </header>
        `);

        // Append header to body
        $('body').prepend(header);

        // Render navbar items
        const navbar = $('#navbar');
        const roleItems = navbarItems[role] || [];

        roleItems.forEach(category => {
            // Create category element
            const categoryElem = $(`
                <div class="relative group">
                    <button class="category-toggle text-gray-700 hover:text-blue-500 focus:outline-none flex items-center">
                        ${category.category}
                        <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="dropdown-menu hidden absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md z-20">
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

        // Initialize dropdown functionality
        initializeDropdowns();
    }

    // Function to create the logo element
    function createLogo() {
        return `
            <a href="/" class="flex items-center">
                <img src="../../../resources/image/icon-removebg.png" alt="Legend Motor Limited" class="h-12 w-12">
                <span class="ml-3 text-xl font-bold text-gray-800">LMC</span>
            </a>
        `;
    }

    // Function to create the search bar
    function createSearchBar() {
        return `
            <div class="relative flex-grow mx-4">
                <label for="search-bar-vehicles" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </label>
                <input type="text" id="search-bar-vehicles" placeholder="Search Vehicles..."
                    class="border rounded px-10 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300" />
            </div>
        `;
    }

    // Function to create the user menu
    function createUserMenu(firstLetter, userName) {
        return `
            <div class="relative group">
                <button class="flex items-center gap-2 p-2 bg-gray-100 rounded-md shadow-sm border focus:outline-none"
                    id="user-menu">
                    <!-- User Avatar -->
                    <span
                        class="user-avatar bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
                        ${firstLetter}
                    </span>
                    <!-- Username -->
                    <span class="user-name text-gray-800 font-medium hidden md:inline">${userName}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div id="user-Submenu"
                    class="dropdown-menu hidden absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-30">
                    <ul class="py-2">
                        <li>
                            <a href="../profile.html"
                                class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                Profile
                            </a>
                        </li>
                        <li>
                            <a href="../logout.html"
                                class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Function to initialize dropdown functionality
    function initializeDropdowns() {
        // Toggle category dropdown
        $('.category-toggle').on('click', function (e) {
            e.stopPropagation();
            const dropdown = $(this).next('.dropdown-menu');
            $('.dropdown-menu').not(dropdown).hide(); // Close other dropdowns
            dropdown.toggle();
        });

        // Toggle user submenu
        $('#user-menu').on('click', function (e) {
            e.stopPropagation();
            $('#user-Submenu').toggle();
        });

        // Close all dropdowns when clicking outside
        $(document).on('click', function () {
            $('.dropdown-menu').hide();
        });

        // Prevent closing when clicking inside dropdown
        $('.dropdown-menu').on('click', function (e) {
            e.stopPropagation();
        });
    }

    // Render the navbar on page load
    const userRole = getUserRole();
    renderNavbar(userRole);
});