$(document).ready(function () {
    const wishlist = localStorage.getItem('LMC_WishList') || [];
    console.log(wishlist);

    renderWishlist();
    updateWishlistCount();
    renderOrderSummary();

    // Event listener for form submission
    $('#paymentForm').submit(function (event) {
        event.preventDefault();

        const wishlistItems = JSON.parse(localStorage.getItem('LMC_WishList')) || [];
        if (wishlistItems.length === 0) {
            alert('Please add at least one item to your wishlist before proceeding.', 'error');
            return;
        }

        // Show loading indicator
        $('#loadingIndicator').removeClass('hidden');

        alert('Submitted successfully!', 'success');
        alert('Redirecting to Checkout page...', 'info');

        setTimeout(() => {
            window.location.href = './Checkout.html';
        }, 3000);
    });
});


function renderWishlist() {
    try {

        const wishlistItems = JSON.parse(localStorage.getItem('LMC_WishList')) || [];
        const wishlistTableBody = $('#wishlistTableBody');

        if (wishlistItems.length === 0) {
            wishlistTableBody.html('<tr><td colspan="7" class="text-red-500 px-6 py-4">Your wishlist is empty.</td></tr>');
            return;
        }

        // Clear previous items
        wishlistTableBody.empty();

        wishlistItems.forEach(item => {
            const upgradesList = item.upgrades.length > 0 ? item.upgrades.join(', ') : 'None';
            const insuranceList = item.insurancePlans.length > 0 ? item.insurancePlans.map(plan => plan.planName).join(', ') : 'None';

            const row = $('<tr>').append($('<td>', { class: 'px-6 py-4', text: item.make }), $('<td>', {
                class: 'px-6 py-4',
                text: item.model
            }), $('<td>', { class: 'px-6 py-4', text: item.color }), $('<td>', {
                class: 'px-6 py-4',
                title: upgradesList,
                style: "overflow:hidden;",
                html: upgradesList.split(', ').map(upgrade => `<div>${upgrade}</div>`).join('')
            }), $('<td>', {
                class: 'px-6 py-4',
                title: insuranceList,
                style: "overflow:hidden;",
                html: insuranceList.split(', ').map(plan => `<div>${plan}</div>`).join('')
            }), $('<td>', {
                class: 'px-6 py-4',
                text: `$${item.price}`
            }), $('<td>', { class: 'px-6 py-4' }).append($('<button>', {
                class: 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px2 rounded',
                text: 'Remove',
                click: function () {
                    removeFromWishlist(item.id);
                }
            })));

            wishlistTableBody.append(row);
            console.log(row);
        });
    } catch (error) {
        console.error('Error rendering wishlist:', error);
    }
}


function updateWishlistCount() {
    const wishlistItems = JSON.parse(localStorage.getItem('LMC_WishList')) || [];
    $('#wishlistCount').text(wishlistItems.length);
}

function removeFromWishlist(vehicleId) {
    let wishlistItems = JSON.parse(localStorage.getItem('LMC_WishList')) || [];
    wishlistItems = wishlistItems.filter(item => item.id !== vehicleId);

    localStorage.setItem('LMC_WishList', JSON.stringify(wishlistItems));

    renderWishlist();
    updateWishlistCount();
}

// Function to add vehicle to wishlist with selected options
function addToWishlist(vehicle) {
    let wishlistItems = JSON.parse(localStorage.getItem('LMC_WishList')) || [];

    // Store selected options
    const selectedColor = $('input[name="colorOption"]:checked').val() || 'Not selected';

    const selectedUpgrades = [];
    $('input[type="checkbox"]:checked').each(function () {
        selectedUpgrades.push($(this).attr('id')); // Store the ID or name of the upgrade
    });

    const selectedInsurancePlans = [];
    $('input[type="checkbox"][id^="insurance"]:checked').each(function () {
        selectedInsurancePlans.push($(this).attr('id').replace('insurance-', '')); // Store the plan name
    });

    const wishlistItem = {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        color: selectedColor,
        upgrades: selectedUpgrades,
        insurancePlans: selectedInsurancePlans,
        price: vehicle.price
    };

    wishlistItems.push(wishlistItem);

    localStorage.setItem('LMC_WishList', JSON.stringify(wishlistItems));

    console.log(`${vehicle.make} ${vehicle.model} has been added to your wishlist!`);

}

function renderOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const totalAmount = document.getElementById('totalAmountValue');
    const depositAmount = document.getElementById('DepositAmountValue');
    const estimatedDelivery = document.getElementById('EstimatedDeliveryValue');

    // Check if required elements exist
    if (!subtotalAmount || !totalAmount || !depositAmount || !estimatedDelivery) {
        console.error('One or more required elements are missing in the DOM.');
        return; // Exit the function if any required element is missing
    }

    // Fetch wishlist items from local storage
    const wishlist = JSON.parse(localStorage.getItem('LMC_WishList')) || [];

    // Calculate total price and populate item list
    let totalPrice = 0;
    wishlist.forEach(item => {
        totalPrice += item.price;
    });

    // Calculate deposit amount (1% of total price)
    const depositAmountValue = totalPrice * 0.01;

    // Set estimated delivery date (today + 14 days)
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 14);
    estimatedDelivery.textContent = `Estimated Delivery Date: ${estimatedDeliveryDate.toLocaleDateString()}`;

    // Update amounts in the summary
    subtotalAmount.textContent = `Subtotal: $${totalPrice.toLocaleString()}`;
    totalAmount.textContent = `Total Amount Due: $${totalPrice.toLocaleString()}`;
    depositAmount.textContent = `Deposit Amount (1%): $${depositAmountValue.toLocaleString()}`;

    // Show the order summary section
    orderSummary.style.display = 'block';

    // Store the order summary in local storage and show it on the next page
    localStorage.setItem('LMC_OrderSummary',
        JSON.stringify({
            subtotal: totalPrice,
            total: totalPrice,
            deposit: depositAmountValue,
            estimatedDelivery: estimatedDeliveryDate
        })
    );
}

function showNotification(message, type) {
    const notificationArea = $('#notificationArea');

    // Clear previous notifications
    notificationArea.empty();

    // Create a new notification element
    const notification = $('<div>').addClass(`notification ${type}`).text(message);

    // Append and fade out after 3 seconds
    notificationArea.append(notification);

    setTimeout(() => {
        notification.fadeOut(400, function () { $(this).remove(); });
    }, 3000);
}