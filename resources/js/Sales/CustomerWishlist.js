$(document).ready(function () {
    renderWishlist();

    // Event delegation for dynamically created remove buttons
    $('#wishlist-content').on('click', '.remove-button', function () {
        removeFromWishlist($(this).data('id'));
    });

    // Event for checkout button
    $('#wishlist-content').on('click', '#checkout-button', function () {
        window.location.href = './checkout.html'; // Redirect to checkout page
    });
});

// Function to render the wishlist
function renderWishlist() {
    const wishlist = getWishlist();
    const wishlistContent = $('#wishlist-content');
    wishlistContent.empty();

    if (wishlist.length === 0) {
        wishlistContent.append('<p class="text-center">Your wishlist is empty.</p>');
        return;
    }

    // Create grid layout for each item in the wishlist
    const gridItems = wishlist.map(item => `
        <div class="bg-white shadow-lg rounded-lg p-4 mb-4 flex flex-col items-center">
            <img src="${item.imageUrl}" alt="${item.name}" class="w-full h-40 rounded mb-4 object-cover">
            <div class="flex-grow text-center">
                <h3 class="font-bold">${item.name}</h3>
                <p class="text-gray-700">${item.price}</p>
            </div>
            <button class="remove-button mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600" data-id="${item.id}">Remove</button>
        </div>
    `).join('');

    // Add grid layout to the container
    wishlistContent.append(`
        <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            ${gridItems}
        </div>
    `);

    // Calculate and display total cost
    const totalCost = calculateTotalCost(wishlist);
    wishlistContent.append(`
        <div class="bg-gray-100 p-4 rounded-lg mt-4 text-center">
            <h3 class="font-bold mb-2">Total Cost</h3>
            <p class="text-lg font-semibold mb-2">${totalCost}</p>
            <button id="checkout-button" class="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600">Proceed to Checkout</button>
        </div>
    `);
}

// Function to calculate total cost
function calculateTotalCost(wishlist) {
    return '$' + wishlist.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.-]+/g, "")); // Remove $ sign and convert to float
        return total + price;
    }, 0).toFixed(2);
}

// Function to get wishlist from local storage
function getWishlist() {
    return DomeWishlist();
    //return JSON.parse(localStorage.getItem('lml_wishlist')) || [];
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
    const notificationContainer = $('#notification-container');

    const notification = $(`
        <div class='notification ${type} p-4 mb-4 rounded shadow-md bg-white'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class='text-sm font-bold'>${message}</p>
        </div>
    `);

    notificationContainer.append(notification);

    setTimeout(() => {
        notification.fadeOut(300, () => {
            notification.remove();
        });
    }, 3000);
}

function DomeWishlist() {
    const DomeWishlist = [
        {id: 1, name: 'Nissan Altima', price: '$23K', imageUrl: '../../../resources/image/car-image.png'},
        {id: 2, name: 'Ford Fusion', price: '$24K', imageUrl: '../../../resources/image/car-image.png'},
        {id: 3, name: 'Honda Accord', price: '$22K', imageUrl: '../../../resources/image/car-image.png'},
        {id: 4, name: 'Chevrolet Silverado', price: '$25K', imageUrl: '../../../resources/image/car-image.png'},
        {id: 5, name: 'BMW X4', price: '$25K', imageUrl: '../../../resources/image/car-image.png'},
        {id: 6, name: 'Tesla Model S', price: '$18K', imageUrl: '../../../resources/image/car-image.png'}
    ];
    return DomeWishlist;
}