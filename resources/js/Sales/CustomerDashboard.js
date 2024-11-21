$(document).ready(function () {
    const orders = [{id: 1, status: 'Picked Up', vehicle: 'Toyota Camry'}, {
        id: 2, status: 'Processing', vehicle: 'Honda Accord'
    }, {id: 3, status: 'Picked Up', vehicle: 'Ford Fusion'}, {
        id: 4, status: 'Processing', vehicle: 'Nissan Altima'
    }, {id: 5, status: 'Picked Up', vehicle: 'Chevrolet Malibu'}, {
        id: 6, status: 'Picked Up', vehicle: 'Hyundai Sonata'
    }, {id: 7, status: 'Processing', vehicle: 'Subaru Legacy'}, {
        id: 8, status: 'Shipped', vehicle: 'Kia Optima'
    }, {id: 9, status: 'Delivered', vehicle: 'Mazda 6'}, {
        id: 10, status: 'Cancelled', vehicle: 'Volkswagen Passat'
    }, {id: 11, status: 'Processing', vehicle: 'Chrysler 300'},];

    const vehicles = [{id: 1, name: 'Toyota Camry', price: '$25000'}, {
        id: 2, name: 'Honda Accord', price: '$22000'
    }, {id: 3, name: 'Ford Fusion', price: '$24000'}, {id: 4, name: 'Nissan Altima', price: '$23000'}, {
        id: 5, name: 'Chevrolet Malibu', price: '$21000'
    }, {id: 6, name: 'Hyundai Sonata', price: '$22500'}, {id: 7, name: 'Subaru Legacy', price: '$23500'}, {
        id: 8, name: 'Kia Optima', price: '$21500'
    }, {id: 9, name: 'Mazda 6', price: '$26000'}, {id: 10, name: 'Volkswagen Passat', price: '$24000'}, {
        id: 11, name: 'Chrysler 300', price: '$29000'
    },];

    const wishlist = [{
        id: 1,
        name: 'Nissan Altima',
        price: '$23000',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 2,
        name: 'Ford Fusion',
        price: '$24000',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 3,
        name: 'Chevrolet Malibu',
        price: '$21000',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 4,
        name: 'Hyundai Sonata',
        price: '$22500',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 5,
        name: 'Subaru Legacy',
        price: '$23500',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 6,
        name: 'Kia Optima',
        price: '$21500',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 7,
        name: 'Mazda 6',
        price: '$26000',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 8,
        name: 'Volkswagen Passat',
        price: '$24000',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }, {
        id: 9,
        name: 'Chrysler 300',
        price: '$29000',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'
    }];

    const svgIcons = {
        salesHistory: '<svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>',
        orders: '<svg xmlns="http://www.w3.org/2000/svg" fill="blue" viewBox="0 0 24 24" width="16" height="16"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>',
        vehicles: '<svg xmlns="http://www.w3.org/2000/svg" fill="orange" viewBox="0 0 24 24" width="16" height="16"><path d="M21 13l-2-4V6c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v3l-2 4h1l3.6 7.2c.4.8 1.4 1.2 2.2.8s1.2-1.4.8-2.2L10.6 15h2.8l1-2H8.5L12 8h8l-2 5h-3.5l-1.2 2.5 1 2c.1.2.2.4.3.5L21 13zm-9.4 9c-.4 0-.6-.3-.7-.7-.1-.4.2-.8.6-.9.4-.1.7.2.8.6.2.4-.2.8-.7.8zm2-2c-.4 0-.6-.3-.7-.7-.1-.4.2-.8.6-.9.4-.1.7.2.8.6.2.4-.2.8-.7.8z"/></svg>',
        wishlist: '<svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" width="16" height="16"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-3 .9-5 .9-5S5 .42 7 .42c1 .01 .9 .42 .9 .42s0 .01 .9 .42c1 .01 .9 .42 .9 .42s0 .01 .9 .42c1 .01 .9 .42 .9 .42s0 .01 .9 .42c1 ..."/></svg>',
        armor: '<svg xmlns="http://www.w3.org/2000/svg" fill="blue" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>',
    };

    const insurance = [{

    }]

    // Function to render dashboard content
    function renderDashboard() {
        $('#dashboard-content').html(`
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

    function renderOrders() {
        return orders.map(order => `
        <div class='bg-white ${getOrderCardClass(order.status)} shadow-lg rounded-lg p-6 transition-transform transform hover:scale-[1.02] duration-200'>
            ${getStatusIcon(order.status)}
            <h3 class='font-bold'>Order #${order.id}</h3>
            <p>Status: ${order.status}</p>
            <p>Vehicle: ${order.vehicle}</p>
            <a href='./OrderDetails.html?id=${order.id}' class='text-blue-500 hover:underline mt-4 block'>Track Order</a>
        </div>`).join('');
    }

    function renderVehicles() {
        return vehicles.map(vehicle => `
        <a href='./ViewVehicles.html' class='bg-white border-l-4 border-orange-500 shadow-lg rounded-lg p-[30px] text-center hover:bg-gray-[100] transition duration-[200ms] ease-in-out delay-[0ms]'>
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
            case 'Picked Up':
                return 'border-l-4 border-green-500'; // Green border for Picked Up
            case 'Processing':
                return 'border-l-4 border-yellow-500'; // Yellow border for processing
            case 'Shipped':
                return 'border-l-4 border-orange-500'; // Orange border for shipped
            case 'Delivered':
                return 'border-l-4 border-purple-500'; // Purple border for delivered
            case 'Cancelled':
                return 'border-l-4 border-red-500'; // Red border for cancelled
            default:
                return ''; // Default case for unknown status
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
                case 'Picked Up':
                    return '<svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>';
            case 'Delivered':
                return '<svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>';
            case 'Cancelled':
                return '<svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>';
            case 'Paid':
                return '<svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>';
                case 'wait for clam':
                    return '<svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>';
                    case 'wait for payment':
                        return '<svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>';
            case 'wait for approval':
                return '<svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>';
                case 'wait for delivery':
                    return '<svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" width="16" height="16"><path d="M12 0L9.5 5H0v7l12 12l12 -12V5h-9.5L12 0z"/></svg>';
            default:
                return '';
        }
    }

    // function to render the insurance section
    function renderInsurance() {
        return insurance.map(insurance => `
        <div class='bg-white ${getInsuranceCardClass(insurance.status)} shadow-lg rounded-lg p-[30px] text-center hover:bg-gray-[100] transition duration-[200ms] ease-in-out delay-[0ms] '>
            ${svgIcons.armor}
            <h3>${insurance.name}</h3> 
            <p>Status: ${insurance.status}</p>
            <p>Price: ${insurance.price}</p> 
        </div>`).join('');
    }

    function getInsuranceCardClass(status) {
        switch (status) {
            case 'pending':
                return 'border-l-4 border-blue-500'; // Blue border for pending
            case 'active':
                return 'border-l-4 border-green-500'; // Green border for active
            case 'underReview':
                return 'border-l-4 border-yellow-500'; // Yellow border for under review
            case 'expired':
                return 'border-l-4 border-red-500'; // Red border for expired
            case 'wait for clam':
                return 'border-l-4 border-green-500'; // Green border for wait for clam
            case 'wait for approval':
                return 'border-l-4 border-green-500'; // Green border for wait for approval
            case 'wait for payment':
                return 'border-l-4 border-green-500'; // Green border for wait for payment
            case 'cancelled':
                return 'border-l-4 border-red-500'; // Red border for cancelled
            default:
                return ''; // Default case for unknown status
        }
    }

    // Initial rendering of the dashboard
    renderDashboard();
});
