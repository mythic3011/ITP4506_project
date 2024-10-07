document.addEventListener('DOMContentLoaded', function() {
    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Function to remove URL parameters
    function removeUrlParameters() {
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Function to fetch order details from API
    async function fetchOrderDetails(orderId) {
        try {
            const response = await fetch(`../resources/php/api.php?orderId=${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Unauthorized');
                }
                throw new Error('Failed to fetch order details');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching order details:', error);
            return null;
        }
    }

    // Function to check if the order is related to the logged-in user
    function isOrderRelatedToUser(orderData) {
        const loggedInUserId = localStorage.getItem('userId');
        return orderData.userId === loggedInUserId;
    }

    // Function to create and append a text element
    function createTextElement(parent, text) {
        const textNode = document.createTextNode(text);
        parent.appendChild(textNode);
    }

    // Function to create and append a paragraph with strong text
    function createStrongParagraph(parent, label, value) {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        createTextElement(strong, label);
        p.appendChild(strong);
        createTextElement(p, `: ${value}`);
        parent.appendChild(p);
    }

    // Function to update order summary
    function updateOrderSummary(orderData) {
        const summaryDiv = document.querySelector('.bg-white.dark\\:bg-gray-800.shadow.overflow-hidden.sm\\:rounded-lg.p-6');
        summaryDiv.textContent = ''; // Clear existing content

        const h2 = document.createElement('h2');
        h2.className = 'text-xl font-semibold mb-4';
        createTextElement(h2, 'Order Summary');
        summaryDiv.appendChild(h2);

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 gap-4';
        summaryDiv.appendChild(grid);

        createStrongParagraph(grid, 'Order Date', orderData.orderDate);
        createStrongParagraph(grid, 'Order Time', orderData.orderTime);
        createStrongParagraph(grid, 'Order Status', orderData.orderStatus);
        createStrongParagraph(grid, 'Sales Manager ID', orderData.salesManagerId);
        createStrongParagraph(grid, 'Sales Manager', orderData.salesManagerName);
        createStrongParagraph(grid, 'Contact', orderData.salesManagerContact);
        createStrongParagraph(grid, 'Delivery Address', orderData.deliveryAddress);
        createStrongParagraph(grid, 'Delivery Date', orderData.deliveryDate);
        createStrongParagraph(grid, 'Contact Person', orderData.contactPerson);
        createStrongParagraph(grid, 'Contact Phone', orderData.contactPhone);
        createStrongParagraph(grid, 'Total Amount', `$${orderData.totalAmount.toLocaleString()}`);
        createStrongParagraph(grid, 'Total Weight', `${orderData.totalWeight}kg`);
        createStrongParagraph(grid, 'Shipping Cost', `$${orderData.shippingCost} ($${orderData.shippingCostPerKg}/kg)`);
        createStrongParagraph(grid, 'Total Cost', `$${orderData.totalCost.toLocaleString()}`);
        createStrongParagraph(grid, 'Payment Method', orderData.paymentMethod);
        createStrongParagraph(grid, 'Paid On', orderData.paidOn);
    }

    // Function to update order items table
    function updateOrderItems(orderItems) {
        const tableBody = document.querySelector('tbody');
        tableBody.textContent = ''; // Clear existing content
        orderItems.forEach(item => {
            const row = document.createElement('tr');

            const createCell = (content) => {
                const cell = document.createElement('td');
                cell.className = 'px-6 py-4 whitespace-nowrap';
                createTextElement(cell, content);
                return cell;
            };

            row.appendChild(createCell(`${item.name} (${item.id})`));
            row.appendChild(createCell(item.quantity.toString()));
            row.appendChild(createCell(`$${item.price.toLocaleString()}`));
            row.appendChild(createCell(`$${(item.quantity * item.price).toLocaleString()}`));

            tableBody.appendChild(row);
        });
    }

    // Function to initialize the page
    async function initializePage() {
        const orderId = getUrlParameter('orderId');
        if (!orderId) {
            window.location.href = '../../error/403.html'; // Redirect to 403 page if no orderId is provided
            return;
        }

        const orderData = await fetchOrderDetails(orderId);

        if (orderData && isOrderRelatedToUser(orderData)) {
            document.querySelector('h1').textContent = `Order Details - ${orderId}`;
            updateOrderSummary(orderData);
            updateOrderItems(orderData.items);
            removeUrlParameters(); // Remove URL parameters after successful fetch
        } else {
            window.location.href = '../../error/403.html'; // Redirect to 403 page if order fetch fails or not related to user
        }
    }

    // Initialize the page
    initializePage();

    // send order action request
    function sendOrderActionRequest($orderId, $action) {
        fetch(`../resources/php/api.php?orderId=${$orderId}&action=${$action}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }
        });
    }

    // Event listeners for buttons
    document.getElementById('printOrder').addEventListener('click', () => {
        window.print();
    });

    document.getElementById('downloadInvoice').addEventListener('click', () => {
        // Implement invoice download logic
        alert('Download invoice functionality not implemented');
    });

    document.getElementById('deleteOrder').addEventListener('click', () => {
        // Implement order deletion logic
        if (confirm('Are you sure you want to delete this order?')) {
            alert('Delete order functionality not implemented');
        }
        // send request to delete order
        sendOrderActionRequest(orderId, 'delete');
    });
});
