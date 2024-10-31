$(document).ready(function () {
    // Sample data for demonstration purposes
    const salesHistory = [
        {id: 1, date: 'Jan 15, 2024', amount: '$30K'},
        {id: 2, date: 'Feb 20, 2024', amount: '$25K'},
        {id: 3, date: 'Mar 10, 2024', amount: '$45K'}
    ];

    const orders = [
        {id: 1, status: 'Shipped', vehicle: 'Toyota Camry'},
        {id: 2, status: 'Processing', vehicle: 'Honda Accord'}
    ];

    const vehicles = [
        {id: 1, name: 'Toyota Camry', price: '$25K'},
        {id: 2, name: 'Honda Accord', price: '$22K'}
    ];

    const wishlist = [
        {id: 1, name: 'Nissan Altima', price: '$23K'},
        {id: 2, name: 'Ford Fusion', price: '$24K'}
    ];

    const svgIcons = {
        salesHistory: '<svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>',
        orders: '<svg xmlns="http://www.w3.org/2000/svg" fill="blue" viewBox="0 0 24 24" width="16" height="16"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>',
        vehicles: '<svg xmlns="http://www.w3.org/2000/svg" fill="orange" viewBox="0 0 24 24" width="16" height="16"><path d="M21 13l-2-4V6c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v3l-2 4h1l3.6 7.2c.4.8 1.4 1.2 2.2.8s1.2-1.4.8-2.2L10.6 15h2.8l1-2H8.5L12 8h8l-2 5h-3.5l-1.2 2.5 1 2c.1.2.2.4.3.5L21 13zm-9.4 9c-.4 0-.6-.3-.7-.7-.1-.4.2-.8.6-.9.4-.1.7.2.8.6.2.4-.2.8-.7.8zm2-2c-.4 0-.6-.3-.7-.7-.1-.4.2-.8.6-.9.4-.1.7.2.8.6.2.4-.2.8-.7.8z"/></svg>',
        wishlist: '<svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" width="16" height="16"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-3 .9-5 .9-5S5 .42 7 .42c1 .01 .9 .42 .9 .42s0 .01 .9 .42c1 .01 .9 .42 .9 .42s0 .01 .9 .42c1 .01 .9 .42 .9 .42s0 .01 .9 .42c1 ..."/></svg>'
    };

    // Function to render dashboard content
    function renderDashboard() {
        $('#dashboard-content').html(`
            <section class="mb-8">
                <h2 class="text-xl font-semibold mb-4">Sales History</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">${renderSalesHistory()}</div>
            </section>

            <section class="mb-8">
                <h2 class="text-xl font-semibold mb-4">Your Orders</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">${renderOrders()}</div>
            </section>

            <section class="mb-8">
                <h2 class="text-xl font-semibold mb-4">Browse Vehicles</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">${renderVehicles()}</div>
            </section>

            <section class="">
                <h2 class="text-xl font-semibold mb-4">Your Wishlist</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-[30px] gap-x-[20px]">${renderWishlist()}</div> 
            </section>
        `);
    }

    // Render functions for each section
    function renderSalesHistory() {
        return salesHistory.map(sale => `
        <div class='bg-white border-l-4 border-green-500 shadow-lg rounded-lg p-6 transition-transform transform hover:scale-[1.02] duration-200'>
            ${svgIcons.salesHistory}
            <h3 class='font-bold'>Sale #${sale.id}</h3>
            <p>Date: ${sale.date}</p>
            <p>Total Amount: ${sale.amount}</p>
            <a href='#' class='text-blue-500 hover:underline mt-4 block'>View Details</a>
        </div>`).join('');
    }

    function renderOrders() {
        return orders.map(order => `
        <div class='bg-white ${getOrderCardClass(order.status)} shadow-lg rounded-lg p-6 transition-transform transform hover:scale-[1.02] duration-200'>
            ${getStatusIcon(order.status)}
            <h3 class='font-bold'>Order #${order.id}</h3>
            <p>Status: ${order.status}</p>
            <p>Vehicle: ${order.vehicle}</p>
            <a href='./OrderDetails?id=${order.id}' class='text-blue-500 hover:underline mt-4 block'>Track Order</a>
        </div>`).join('');
    }


    function renderVehicles() {
        return vehicles.map(vehicle => `
        <a href='./ViewCar.html' class='bg-white border-l-4 border-orange-500 shadow-lg rounded-lg p-[30px] text-center hover:bg-gray-[100] transition duration-[200ms] ease-in-out delay-[0ms]'>
            ${svgIcons.vehicles}
            <h3>${vehicle.name}</h3> 
            <p>Price: ${vehicle.price}</p> 
        </a>`).join('');
    }

    function renderWishlist() {
        return wishlist.map(item => `
        <a href='./wishlist.html' class='bg-white border-l-4 border-red-500 shadow-lg rounded-lg p-[30px] text-center hover:bg-gray-[100] transition duration-[200ms] ease-in-out delay-[0ms]'>
            ${svgIcons.wishlist}
            <h3>${item.name}</h3> 
            <p>Price: ${item.price}</p> 
        </a>`).join('');
    }


    // Function to get order card classes based on status
    function getOrderCardClass(status) {
        switch (status) {
            case 'paid':
                return 'border-l-4 border-green-500'; // Green border for paid
            case 'Pending':
                return 'border-l-4 border-blue-500'; // Blue border for pending
            case 'Shipped':
                return 'border-l-4 border-green-500'; // Green border for shipped
            case 'Processing':
                return 'border-l-4 border-yellow-500'; // Yellow border for processing
            default:
                return '';
        }
    }

    // Function to get status icon based on order status
    function getStatusIcon(status) {
        switch (status) {
            case 'Pending':
                return '<svg xmlns="http://www.w3.org/2000/svg" fill="blue" viewBox="0 0 24 24" width="16" height="16"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>';
            case 'Shipped':
                return '<svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>';
            case 'Processing':
                return '<svg xmlns="http://www.w3.org/2000/svg" fill="orange" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>';
            default:
                return '';
        }
    }

    // Initial rendering of the dashboard
    renderDashboard();
});
