import { apiRequest } from './module/api.js';

const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.style.display = mobileMenu.style.display === 'none' ? 'block' : 'none';
});

let currentOrders = [];

document.addEventListener('DOMContentLoaded', () => {
    showLoading();
    fetchOrders(1, 10)
        .then(orders => {
            currentOrders = orders;
            displayOrders(orders);
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            displayError(error.message);
        })
        .finally(() => {
            hideLoading();
        });

    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        sortOrders(e.target.value);
    });
});

// TODO: Add pagination AND remove the dealerID parameter since it is not safe to use
function fetchOrders(page = 1, limit = 10) {
    const dealerID = sessionStorage.getItem('username') || localStorage.getItem('username') || getCookie('id');
    const apiUrl = `../../resources/php/order_api.php?action=Dealer-list&page=${page}&limit=${limit}&username=${dealerID}`;
    const AuthToken = localStorage.getItem('userToken');

    return fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthToken
        },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                document.getElementById('order-table').style.display = 'none';
                document.getElementById('total-orders').textContent = '0';
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let mappedOrders;
            if (data.status === 'success') {
                mappedOrders = mapTheOrders(data.data);
                return mappedOrders;
            } else {
                throw new Error(data.message || 'Failed to fetch orders');
            }
        });
}

function mapTheOrders(orders) {
    // Check if orders is null or undefined
    if (!orders) {
        console.error("Orders is null or undefined");
        // Handle the error or return an empty array
        return [];
    }

    // Check if orders is an array
    if (!Array.isArray(orders)) {
        console.error("Orders is not an array");
        // Handle the error or return an empty array
        return [];
    }

    const mappedOrders = [];
    orders.forEach(order => {
        const [orderDate, orderTime] = order.orderDateTime.split(' ');
        const mappedOrder = {
            id: order.orderID,
            orderDate: formatDate(orderDate),
            orderTime: formatTime(orderTime),
            deliveryDate: formatDate(order.deliveryDate),
            totalCost: `${order.totalCost.toLocaleString()}`,
            status: order.orderStatus,
            viewLink: `OrderDetails.html?id=${order.orderID}`
        };
        mappedOrders.push(mappedOrder);
    });
    return mappedOrders;
}


function formatDate(dateString) {
    // DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split('/');
        return `${day}/${month}/${year}`;
    }
    // YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
    console.error('Invalid date string:', dateString);
    return 'Invalid Date';
}

function formatTime(timeString) {
    if (!timeString || !/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
        console.error('Invalid time string:', timeString);
        return 'Invalid Time';
    }
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

function displayOrders(orders) {
    const orderBody = document.getElementById('order-body');
    orderBody.replaceChildren(); // Clear existing content

    if (orders.length > 0) {
        document.getElementById('total-orders').textContent = orders.length;
        document.getElementById('order-table').style.display = 'table';

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-100 dark:hover:bg-gray-700';

            row.appendChild(createCell('td', order.id, 'px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'));
            row.appendChild(createCell('td', formatDate(order.orderDate), 'px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden sm:table-cell'));
            row.appendChild(createCell('td', order.orderTime, 'px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell'));
            row.appendChild(createCell('td', formatDate(order.deliveryDate), 'px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell'));
            row.appendChild(createCell('td', `$${order.totalCost.toLocaleString()}`, 'px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium'));

            const statusCell = document.createElement('td');
            statusCell.className = 'px-4 py-4 whitespace-nowrap';
            const statusSpan = document.createElement('span');
            statusSpan.className = `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`;
            statusSpan.textContent = order.status;
            statusCell.appendChild(statusSpan);
            row.appendChild(statusCell);

            const viewLinkCell = document.createElement('td');
            viewLinkCell.className = 'px-4 py-4 whitespace-nowrap text-sm font-medium';
            const viewLink = document.createElement('a');
            viewLink.href = `OrderDetails.html?id=${order.id}`;
            viewLink.className = 'text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300';
            viewLink.textContent = 'View';
            viewLinkCell.appendChild(viewLink);
            row.appendChild(viewLinkCell);

            orderBody.appendChild(row);
        });
    } else {
        document.getElementById('order-table').style.display = 'none';
        document.getElementById('total-orders').textContent = '0';
        displayError('No orders found');
    }
}

function createCell(tag, textContent, className) {
    const cell = document.createElement(tag);
    cell.className = className;
    cell.textContent = textContent;
    return cell;
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'preparing':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
        case 'shipped':
            return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
        case 'processing':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
        case 'cancelled':
            return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
}

function sortOrders(sortBy) {
    if (currentOrders.length === 0) {
        console.warn('No orders to sort');
        return;
    }

    const sortedOrders = [...currentOrders]; // Create a copy of the orders array

    sortedOrders.sort((a, b) => {
        switch (sortBy) {
            case 'id':
                return a.id.localeCompare(b.id);
            case 'orderDate':
                return new Date(b.orderDate) - new Date(a.orderDate);
            case 'deliveryDate':
                return new Date(a.deliveryDate) - new Date(b.deliveryDate);
            case 'totalCost':
                return b.totalCost - a.totalCost;
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return 0; // If an unknown sort criteria is passed, don't sort
        }
    });

    displayOrders(sortedOrders);
}

function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
    document.getElementById('order-table').classList.add('hidden');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
    document.getElementById('order-table').classList.remove('hidden');
}

function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-center mt-4';
    errorDiv.textContent = message;
    document.getElementById('order-table').insertAdjacentElement('beforebegin', errorDiv);
}