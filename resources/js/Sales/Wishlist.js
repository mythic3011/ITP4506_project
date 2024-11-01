$(document).ready(function () {

    const wishlist = localStorage.getItem('LMC_WishList');
    console.log(wishlist);


    renderWishlist();
    updateWishlistCount();

    // Event listener for payment method selection
    $('#paymentMethod').change(function () {
        const selectedMethod = $(this).val();
        if (selectedMethod === 'CreditCard') {
            $('#CreditCard').removeClass('hidden');
        } else {
            $('#CreditCard').addClass('hidden');
        }
    });

    // Event listener for form submission
    $('#paymentForm').submit(function (event) {
        event.preventDefault();
        isValid = validateForm();
        if (!isValid){
            showNotification('Please fill in all required fields correctly.');
        }
        showNotification('Submitted successfully!', 'success');
        showNotification('Redirecting to Checkout page...', 'info');
        setTimeout(() => {
            window.location.href = './Checkout.html';
        },3000);
    });
});

function validateForm() {
    const paymentMethod = $('#paymentMethod').val();
    const cardName = $('#cardName').val();
    const cardNumber = $('#cardNumber').val();
    const expiryDate = $('#expiryDate').val();
    const cvv = $('#cvv').val();

    if (paymentMethod === 'CreditCard') {
        if (!cardName || !cardNumber || !expiryDate || !cvv) {
            showNotification('Credit card details are required.', 'error');
            return false;
        }
    }
}



function renderWishlist() {
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

        const row = $('<tr>').append(
            $('<td>', {class: 'px-6 py-4', text: item.make}),
            $('<td>', {class: 'px-6 py-4', text: item.model}),
            $('<td>', {class: 'px-6 py-4', text: item.color}),
            $('<td>', {class: 'px-6 py-4', title: upgradesList, style: "overflow:hidden;",
                       html: upgradesList.split(', ').map(upgrade => `<div>${upgrade}</div>`).join('')}),
            $('<td>', {class: 'px-6 py-4', title: insuranceList, style: "overflow:hidden;",
                       html: insuranceList.split(', ').map(plan => `<div>${plan}</div>`).join('')}),
            $('<td>', {class: 'px-6 py-4', text: `$${item.price}`}),
            $('<td>', {class: 'px-6 py-4'}).append(
                $('<button>', {
                    class: 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px2 rounded',
                    text: 'Remove',
                    click: function () {
                        removeFromWishlist(item.id);
                    }
                })
            )
        );

        wishlistTableBody.append(row);
    });
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

    alert(`${vehicle.make} ${vehicle.model} has been added to your wishlist!`);
}
