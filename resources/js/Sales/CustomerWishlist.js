// Document ready function
$(document).ready(function () {
    renderWishlist();

    // Event delegation for dynamically created remove buttons
    $('#wishlistTableBody').on('click', '.remove-button', function () {
        removeFromWishlist($(this).data('id'));
    });

    // Event for payment method change
    $('#paymentMethod').change(function () {
        if ($(this).val() === 'CreditCard') {
            $('#CreditCard').removeClass('hidden');
        } else {
            $('#CreditCard').addClass('hidden');
        }
    });

    // Event for showing trade-in info
    $('#tradeInInfo').removeClass('hidden'); // Show trade-in info when available
});

// Function to render the wishlist
function renderWishlist() {
    const wishlist = getWishlist();
    const wishlistTableBody = $('#wishlistTableBody');
    wishlistTableBody.empty();

    $('#wishlistCount').text(wishlist.length);

    if (wishlist.length === 0) {
        wishlistTableBody.append('<tr><td colspan="7" class="text-center">Your wishlist is empty.</td></tr>');
        return;
    }

    // Create table rows for each item in the wishlist
    const rows = wishlist.map(item => `
        <tr data-id="${item.id}">
            <td class='px-6 py-4 whitespace-nowrap'>${item.make}</td>
            <td class='px-6 py-4 whitespace-nowrap'>${item.model}</td>
            <td class='px-6 py-4 whitespace-nowrap'>${item.color}</td>
            <td class='px-6 py-4 whitespace-nowrap'>${item.upgrades}</td>
            <td class='px=6 py=4 whitespace-nowrap'>${item.insurancePlans}</td>
            <td class='px=6 py=4 whitespace-nowrap'>${item.price}</td>
            <td class='px=6 py=4 whitespace-nowrap'>
                <button data-id="${item.id}" class='remove-button bg-red-500 text-white rounded px=2 py=1 hover:bg-red=600'>Remove</button></td> 
        </tr>`).join('');

    // Add rows to the table body
    wishlistTableBody.append(rows);

    // Calculate and display total cost
    const totalCost = calculateTotalCost(wishlist);
}

// Function to calculate total cost
function calculateTotalCost(wishlist) {
    return '$' + wishlist.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0–9.-]+/g, "")); // Remove $ sign and convert to float
        return total + price;
    }, 0).toFixed(2);
}

// Function to get wishlist from local storage or mock data
function getWishlist() {
    return DomeWishlist(); // Replace with localStorage logic if needed
}

// Function to remove an item from the wishlist
function removeFromWishlist(id) {
    const wishlist = getWishlist();
    const updatedWishlist = wishlist.filter(item => item.id !== id);

    localStorage.setItem('lml_wishlist', JSON.stringify(updatedWishlist));
    addNotification('Item removed from your wishlist.', 'success');
    renderWishlist();
}

// Function to add a notification
function addNotification(message, type) {
    const notificationContainer = $('#notificationArea');

    const notification = $(`
        <div class='notification ${type} p–4 mb–4 rounded shadow-md bg-white'>
            ${message}
        </div>`);

    notificationContainer.append(notification);

    setTimeout(() => {
        notification.fadeOut(300, () => {
            notification.remove();
        });
    }, 3000);
}

// Mock data function for the wishlist
function DomeWishlist() {
    return [
        {id: 1, make: 'LMC', model: 'Altima', color: 'Red', upgrades: 'Sunroof', insurancePlans: 'Basic', price: '$23K'},
        {id: 2, make: 'LMC', model: 'Fusion', color: 'Blue', upgrades: 'Leather Seats', insurancePlans: 'Premium', price: '$24K'},
        {id: 3, make: 'LMC', model: 'Accord', color: 'Black', upgrades: 'Navigation', insurancePlans: 'Basic', price: '$22K'},
        {id: 4, make: 'LMC', model: 'Silverado', color: 'White', upgrades: 'Towing Package', insurancePlans: 'Premium', price: '$25K'},
        {id: 5, make: 'LMC', model: 'X4', color: 'Gray', upgrades: 'Sport Package', insurancePlans: 'Basic', price: '$25K'},
        {id: 6, make: 'LMC', model: 'Model S', color: 'Silver', upgrades: 'Autopilot', insurancePlans: 'Premium', price: '$18K'}
    ];
}