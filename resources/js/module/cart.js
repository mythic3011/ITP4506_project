function updateCartCount(cartItems) {
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = cartItems.length;
}

function updateTotal(cartItems) {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiv = document.getElementById('totalAmount');

    // Clear existing content
    while (totalDiv.firstChild) {
        totalDiv.removeChild(totalDiv.firstChild);
    }

    // Create new paragraph element
    const totalP = document.createElement('p');
    totalP.className = 'text-xl font-bold mb-4';
    totalP.textContent = `Total: $${total.toFixed(2)}`;

    // Append the new paragraph to totalDiv
    totalDiv.appendChild(totalP);
}


function createShoppingCartTable(cartItems) {
    const table = document.createElement('table');
    table.className = 'min-w-full divide-y divide-gray-200 dark:divide-gray-700';

    const thead = createTableHeader(['Item', 'Price', 'Quantity', 'Total', 'Actions']);
    const tbody = createTableBody(cartItems);

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function createTableHeader(headers) {
    const thead = document.createElement('thead');
    thead.className = 'bg-gray-50 dark:bg-gray-700';

    const headerRow = document.createElement('tr');

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.className = 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider';
        th.scope = 'col';
        th.textContent = headerText;
        th.id = "Cart-Header"+headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    return thead;
}

function createTableBody(cartItems) {
    const tbody = document.createElement('tbody');
    tbody.className = 'bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700';

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.id = `row-${item.id}`; // Add ID to the row for easy access
        row.appendChild(createTableCell(`${item.name} (${item.id})`));
        row.appendChild(createTableCell(`$${item.price.toFixed(2)}`));
        row.appendChild(createQuantityCell(item));
        row.appendChild(createTotalCell(item));
        row.appendChild(createActionsCell(item.id));

        tbody.appendChild(row);
    });

    return tbody;
}

function createTableCell(content) {
    const cell = document.createElement('td');
    cell.className = 'px-6 py-4 whitespace-nowrap';
    cell.textContent = content;
    return cell;
}

function createTotalCell(item) {
    const cell = document.createElement('td');
    cell.className = 'px-6 py-4 whitespace-nowrap';
    cell.id = `total-${item.id}`;
    cell.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
    return cell;
}

function createQuantityCell(item) {
    const cell = document.createElement('td');
    cell.className = 'px-6 py-4 whitespace-nowrap';

    const quantityInput = document.createElement('input');
    quantityInput.className = 'text-left pl-1 w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white';
    quantityInput.id = `cart-item-${item.id}-quantity`;
    quantityInput.type = 'number';
    quantityInput.min = '1';
    quantityInput.value = item.quantity;

    quantityInput.addEventListener('change', function() {
        item.quantity = parseInt(this.value);
        updateItemTotal(item);
        updateTotal(cartItems);
    });

    cell.appendChild(quantityInput);
    return cell;
}

function createActionsCell(itemId) {
    const cell = document.createElement('td');
    cell.className = 'px-6 py-4 whitespace-nowrap text-sm font-medium text-left';

    const removeButton = document.createElement('button');
    removeButton.className = 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300';
    removeButton.textContent = 'Remove';
    removeButton.onclick = () => removeItem(itemId);

    cell.appendChild(removeButton);
    return cell;
}

function removeItem(itemId) {
    const index = cartItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
        cartItems.splice(index, 1);
        updateCartCount(cartItems);
        updateTotal(cartItems);
        const row = document.getElementById(`row-${itemId}`);
        if (row) row.remove();
    }
}

function updateItemTotal(item) {
    const totalCell = document.getElementById(`total-${item.id}`);
    if (totalCell) {
        totalCell.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
    }
}

// Example usage:
const cartItems = [
    { id: 'A00001', name: 'Tinned Plate', price: 100, quantity: 2 },
    // Add more items as needed
];

const tableContainer = document.getElementById('shoppingCartTableContainer');
const shoppingCartTable = createShoppingCartTable(cartItems);
tableContainer.appendChild(shoppingCartTable);

function foreach(elementsByClassName, param2) {
    for (let i = 0; i < elementsByClassName.length; i++) {
        param2(elementsByClassName[i]);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const orderData = {
        orderId: 'SL00009',
        orderDate: '1/5/2024',
        orderTime: '13:00',
        deliveryDate: '[Insert date here]',
        address: 'No. 123 East Street, Haidian District, Beijing 100086',
        contactPerson: 'Thomas Cheung',
    };
    const cartId = localStorage.getItem('cartId');
    const cart = await

    // Update initial cart count and total
    updateCartCount(cartItems);
    updateTotal(cartItems);

    function populateOrderSummary(orderData) {
        const orderSummaryDiv = document.getElementById('orderSummary');
        const summaryItems = [
            ['Order ID', orderData.orderId],
            ['Order Date', orderData.orderDate],
            ['Order Time', orderData.orderTime],
            ['Available Delivery Date', orderData.deliveryDate],
            ['Address', orderData.address],
            ['Contact Person', orderData.contactPerson]
        ];

        summaryItems.forEach(([label, value]) => {
            const strong = document.createElement('strong');
            strong.textContent = `${label}: `;
            orderSummaryDiv.appendChild(strong);
            orderSummaryDiv.appendChild(document.createTextNode(value));
            orderSummaryDiv.appendChild(document.createElement('br'));
        });

        const totalDiv = document.getElementById('totalAmount');
        const totalP = document.createElement('p');
        totalP.className = 'text-xl font-bold mb-4';
        // totalP.textContent = `Total: $${orderData.total}`;
        totalDiv.appendChild(totalP);
    }

    function handleFormSubmission(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        fetch('api.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Payment successful');
                } else {
                    alert('Payment failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    // // Cart items count will be updated here by JavaScript
    // const cartCount = document.getElementById('cartCount');
    // cartCount.textContent = cartItems.length;

    populateOrderSummary(orderData);

    if (cartItems.length === 0) {
        document.getElementById('shoppingCartTableContainer').style.display = 'display: none;';
        foreach(document.getElementsByClassName("Cart-Header"), function(element) {
            element.style.display = 'none;';
        });
    }
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.addEventListener('submit', handleFormSubmission);
});
