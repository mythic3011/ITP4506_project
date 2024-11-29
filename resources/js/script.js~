// script.js
console.log("hello");

$(document).ready(function () {
    // Navbar items organized by user roles
    const navbarItems = {
        admin: [
            {
                category: 'Dashboard',
                items: [{ name: 'Admin Home', url: '/page/Admin/index.html' }]
            },
            {
                category: 'Management',
                items: [
                    { name: 'Users', url: '/page/Admin/Users.html' },
                    { name: 'Reports', url: '/page/Admin/Reports.html' }
                ]
            }
        ],
        customer: [
            {
                category: 'Home',
                items: [{ name: 'Customer Home', url: '/page/Customer/index.html' }]
            },
            {
                category: 'Vehicles',
                items: [
                    { name: 'View Vehicles', url: '/page/Customer/Sales/ViewVehicles.html' },
                    { name: 'Wishlist', url: '/page/Customer/Sales/Wishlist.html' },
                    { name: 'Orders', url: '/page/Customer/Sales/viewOrderRecord.html' }
                ]
            },
            {
                category: 'Insurance',
                items: [
                    { name: 'Insurance Info', url: '/page/Customer/Insurance/index.html' },
                    { name: 'Apply', url: '/page/Customer/Insurance/progress.html' },
                    { name: 'Applications', url: '/page/Customer/Insurance/ordersindex.html' }
                ]
            }
        ],
        staff: [
            {
                category: 'Dashboard',
                items: [{ name: 'Staff Home', url: '/page/Staff/home.html' }]
            },
            {
                category: 'Tasks',
                items: [
                    { name: 'View Tasks', url: '/page/Staff/Tasks/view.html' },
                    { name: 'Update Status', url: '/page/Staff/Tasks/update.html' }
                ]
            }
        ],
        common: [
            {
                name: 'Profile',
                url: '/page/profile.html'
            },
            {
                name: 'Logout',
                url: '/page/logout.html'
            }
        ]
    };

    // Retrieve the user role from localStorage
    function getUserRole() {
        return localStorage.getItem('role') || 'customer';
    }

    // Retrieve user information from localStorage
    function getUserInfo() {
        return {
            name: localStorage.getItem('username') || 'User',
            avatar: localStorage.getItem('avatar') || 'U'
        };
    }

    // Highlight active menu item
    function highlightActiveMenu() {
        const currentPath = window.location.pathname;
        $('nav a').each(function () {
            if (this.pathname === currentPath) {
                $(this).addClass('text-blue-500 font-semibold');
            }
        });
    }

    // Render the navbar based on the user role
    function renderNavbar(role) {
        const userInfo = getUserInfo();
        const userFirstLetter = userInfo.name.charAt(0).toUpperCase();

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

        $('body').prepend(header);

        const navbar = $('#navbar');
        const roleItems = navbarItems[role] || [];

        roleItems.forEach(category => {
            const categoryElem = $(`
                <div class="relative group">
                    <button class="category-toggle text-gray-700 hover:text-blue-500 focus:outline-none flex items-center">
                        ${category.category}
                        <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div class="dropdown-menu hidden absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md z-20">
                        <ul class="py-2"></ul>
                    </div>
                </div>
            `);

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

            navbar.append(categoryElem);
        });

        initializeDropdowns();
        highlightActiveMenu();
    }

    // Create the logo element
    function createLogo() {
        return `
            <a href="/" class="flex items-center">
                <img src="../../../resources/image/icon-removebg.png" alt="Legend Motor Limited" class="h-12 w-12">
                <span class="ml-3 text-xl font-bold text-gray-800">LMC</span>
            </a>
        `;
    }

    // Create the search bar element
    function createSearchBar() {
        return `
            <div class="relative flex-grow mx-4">
                <label for="search-bar-vehicles" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </label>
                <input type="text" id="search-bar-vehicles" placeholder="Search Vehicles..."
                       class="border rounded px-10 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"/>
            </div>
        `;
    }

    // Create the user menu element
    function createUserMenu(firstLetter, userName) {
        return `
            <div class="relative group">
                <button class="flex items-center gap-2 p-2 bg-gray-100 rounded-md shadow-sm border focus:outline-none"
                        id="user-menu">
                    <span class="user-avatar bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
                        ${firstLetter}
                    </span>
                    <span class="user-name text-gray-800 font-medium hidden md:inline">${userName}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                <div id="user-Submenu"
                     class="dropdown-menu hidden absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-30">
                    <ul class="py-2">
                        ${createUserMenuItems()}
                    </ul>
                </div>
            </div>
        `;
    }

    function createUserMenuItems() {
        return navbarItems.common.map(item => `
            <li>
                <a href="${item.url}" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    ${item.name}
                </a>
            </li>
        `).join('');
    }

    // Initialize dropdown menus
    function initializeDropdowns() {
        // Toggle category dropdowns
        $(document).on('click', '.category-toggle', function (e) {
            e.stopPropagation();
            const $dropdown = $(this).next('.dropdown-menu');
            $('.dropdown-menu').not($dropdown).hide();
            $dropdown.toggle();
        });

        // Toggle user submenu
        $(document).on('click', '#user-menu', function (e) {
            e.stopPropagation();
            $('#user-Submenu').toggle();
        });

        // Hide dropdowns when clicking outside
        $(document).on('click', function () {
            $('.dropdown-menu').hide();
        });
    }

    // Get the user role and render the navbar
    const userRole = getUserRole();
    renderNavbar(userRole);

    // Append the main CSS file to the document head
    $('<link>', {
        rel: 'stylesheet',
        href: '../../resources/css/main.css'
    }).appendTo('head');
});