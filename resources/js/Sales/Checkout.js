$(document).ready(function () {
    fetchUserinfo();
    renderOrderSummary();

    $('#financingMethod').change(calculateMonthlyPayment); // Recalculate when financing option changes

    $('#checkoutForm').on('submit', function (event) {
        event.preventDefault();

        const fullName = $('#fullName').val();
        const address = $('#address').val();

        // Validate inputs
        if (!fullName || !address) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Show confirmation notification
        showNotification('Order confirmed! Thank you for your purchase!', 'success');

        console.log({
            fullName,
            address,
            wishlist: JSON.parse(localStorage.getItem('LMC_WishList')),
            selectedFinancingOption: $('#financingMethod').val()
        });

        // // Optionally clear the wishlist after confirming the order
        // localStorage.removeItem('LMC_WishList');

        // Redirect or perform another action after confirmation
        PlaceOrder();
    });
});


function PlaceOrder() {
    const user = localStorage.getItem('username');
    const fullName = $('#fullName').val();
    const address = $('#address').val();
    const wishlist = JSON.parse(localStorage.getItem('LMC_WishList')) || [];
    const selectedFinancingOption = $('#financingMethod').val();

    // Generate unique identifiers for the order
    const orderId = generateId();
    const orderNumber = generateOrderNumber();

    // Calculate total amounts
    const totalAmount = parseFloat($('#totalAmount').text().replace(/[^0-9.-]+/g, ""));
    const depositAmount = parseFloat($('#DepositAmount').text().replace(/[^0-9.-]+/g, ""));

    // Check if wishlist is empty
    if (wishlist.length === 0) {
        showNotification('Your wishlist is empty.', 'error');
        return;
    }

    // Validate inputs
    if (!fullName || !address) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Show confirmation notification
    showNotification('Order confirmed! Thank you for your purchase!', 'success');

    // Construct the order object
    const order = {
        id: orderId,
        orderNumber: orderNumber,
        date: new Date().toISOString(),
        status: 'pending',
        customer: {
            id: user,
            name: fullName,
            email: user,
            phone: user,
            address: address
        },
        vehicle: wishlist.map(item => ({
            make: item.make,
            model: item.model,
            color: item.color,
            upgrades: item.upgrades,
            insurancePlans: item.insurancePlans,
            price: item.price
        })),
        payment: {
            status: 'pending',
            amount: totalAmount - depositAmount, // Remaining amount after deposit
            method: selectedFinancingOption
        }
    };

    console.log(order); // Log the complete order object for debugging

    // Optionally clear the wishlist after confirming the order
    //localStorage.removeItem('LMC_WishList');
    //window.location.href = './OrderDetails.html?id=' + orderId;
    // store the order in the database and local storage
    // send the order to the server for processing
    // show a success message
    sendOrder(order);
}

function sendOrder(order) {
    const userUrl = "../../../resources/json/user.json";
    const orderUrl = "../../../resources/json/orders.json";

    // build the user object from the order use the customer object

    const user = {
        id: order.customer.id,
        username: order.customer.username,
        email: order.customer.email,
        phone: order.customer.phone,
        address: order.customer.address,
        roles: order.customer.roles,
        permissions: order.customer.permissions,
        preferences: order.customer.preferences,
        lastLogin: order.customer.lastLogin,
        status: order.customer.status,
        orders: order.customer.orders
    };





    localStorage.setItem('orders', JSON.stringify(order));
    localStorage.setItem('orders_user', JSON.stringify(user));

        window.location.href = './OrderDetails.html?id=' + order.id;
    // Add order to the order.json file and local storage
    $.ajax({
        url: orderUrl,
        type: "POST",
        data: JSON.stringify(order),
        contentType: "application/json",
        success: function (data) {
            console.log("Successfully added order to order.json file:", data);
            localStorage.setItem('LMC_Order', JSON.stringify(order));
            showNotification('Order added to your order history.', 'success');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX error:", textStatus, errorThrown);
            console.log("Response:", jqXHR.responseText);
        }
    });

    // Add order ID to the user.json file and local storage
    $.ajax({
        url: userUrl,
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log("Successfully fetched user data:", data);
            if (data.status === "success" && data.data) {
                const userData = data.data;
                userData.orders.push(order);
                showNotification('Order added to your order history.', 'success');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX error:", textStatus, errorThrown);
            console.log("Response:", jqXHR.responseText);
        }
    });
}

 function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

 function generateStaffNumber() {
    const prefix = 'STF';
    const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${number}`;
}

 function generateOrderNumber() {
    const prefix = 'ORD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
}

function fetchUserinfo() {
    const user = localStorage.getItem('username');
    // get user info from server and set it to the page
    $.ajax({
        url: "../../../resources/json/user.json", type: "GET", dataType: "json", success: function (data) {
            console.log(data);
            if (data.status === "success" && data.data) {
                populateUserInfo(data.data);
            } else {
                console.log("Error fetching user info:", data.message);
            }
        }, error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX error:", textStatus, errorThrown);
            console.log("Response:", jqXHR.responseText);
        }
    });
}

function populateUserInfo(user) {
    const fullName = user.firstName + " " + user.lastName || "";
    const address = user.addressLine1 + ", " + user.city + ", " + user.stateProvince + " " + user.country || "";
    console.log(fullName, address);
    $('#fullName').val(fullName);
    $('#address').val(address);
}


// Function to render order summary
function renderOrderSummary() {
    const orderSummary = $('#orderSummary');
    const subtotalAmount = $('#subtotalAmount');
    const totalAmount = $('#totalAmount');
    const depositAmount = $('#DepositAmount');
    const estimatedDelivery = $('#EstimatedDelivery');

    // Fetch wishlist items from local storage
    const wishlist = JSON.parse(localStorage.getItem('LMC_WishList')) || [];

    // Check if wishlist is empty
    if (wishlist.length === 0) {
        orderSummary.html('<p class="text-red-500">Your wishlist is empty.</p>');
        return;
    }

    // Calculate total price and populate item list
    let totalPrice = 0;

    // Create a table for the order summary
    let summaryHTML = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upgrades</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance Plans</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
            </thead>
            <tbody>`;

    wishlist.forEach(item => {
        totalPrice += item.price;

        const upgradesList = item.upgrades.length > 0 ? item.upgrades.join(', ') : 'None';
        const insuranceList = item.insurancePlans.length > 0 ? item.insurancePlans.map(plan => `${plan.planName} ($${plan.annualPremium.toLocaleString()} annual premium)`).join('<br>') : 'None';

        summaryHTML += `
            <tr>
                <td class="px-6 py-4">${item.make}</td>
                <td class="px-6 py-4">${item.model}</td>
                <td class="px-6 py-4">${item.color}</td>
                <td class="px-6 py-4">${upgradesList}</td>
                <td class="px-6 py-4">${insuranceList}</td>
                <td class="px-6 py-4">$${item.price.toLocaleString()}</td>
            </tr>`;
    });

    summaryHTML += `
            </tbody>
        </table>`;

    // Calculate deposit amount (1% of total price)
    const depositAmountValue = totalPrice * 0.01;

    // Set estimated delivery date (today + 14 days)
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 14);

    // Update amounts in the summary
    estimatedDelivery.text(`Estimated Delivery Date: ${estimatedDeliveryDate.toLocaleDateString()}`);

    subtotalAmount.text(`Subtotal: $${totalPrice.toLocaleString()}`);
    totalAmount.text(`Total Amount Due: $${totalPrice.toLocaleString()}`);
    depositAmount.text(`Deposit Amount (1%): $${depositAmountValue.toLocaleString()}`);

    // Show the order summary section
    orderSummary.html(summaryHTML).show();

    // Store the order summary in local storage for future reference
    localStorage.setItem('LMC_OrderSummary', JSON.stringify({
        subtotal: totalPrice,
        total: totalPrice,
        deposit: depositAmountValue,
        estimatedDelivery: estimatedDeliveryDate.toISOString()
    }));
}


function showNotification(message, type) {
    const notificationContainer = $('#notification-container');

    // Clear previous notifications
    notificationContainer.empty();

    // Create a new notification element
    const notification = $('<div>').addClass(`notification ${type}`).text(message);

    // Append and fade out after 3 seconds
    notificationContainer.append(notification);

    setTimeout(() => {
        notification.fadeOut(400, function () {
            $(this).remove();
        });
    }, 3000);
}

// Calculate and display monthly payment based on selected financing option
function calculateMonthlyPayment() {
    const selectedOption = $('#financingMethod option:selected');

    if (selectedOption.val() === 'none') {
        $('#monthlyPaymentDisplay').addClass('hidden');
        return;
    }

    const principal = parseFloat($('#totalAmount').text().replace(/[^0-9.-]+/g, "")) - parseFloat($('#DepositAmount').text().replace(/[^0-9.-]+/g, "")); // Total minus deposit
    const interestRate = parseFloat(selectedOption.data('interest-rate')); // Get interest rate from selected option
    const termMonths = parseInt(selectedOption.data('term-months')); // Get term in months from selected option

    if (!principal || principal <= 0) {
        $('#monthlyPaymentDisplay').addClass('hidden');
        return;
    }

    // Monthly interest rate
    const r = interestRate / 12;

    // Monthly payment formula
    const M = principal * r * Math.pow(1 + r, termMonths) / (Math.pow(1 + r, termMonths) - 1);

    $('#monthlyPayment').text(M.toFixed(2)); // Display formatted monthly payment
    $('#monthlyPaymentDisplay').removeClass('hidden'); // Show the payment display
}