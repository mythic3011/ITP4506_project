
document.addEventListener('DOMContentLoaded', function () {
    const sparePartId = getParameterByName('id');
    const csrfToken = getCookie('csrf_token');
    const token = getCookie('token');

    if (!sparePartId) {
        console.error('Spare part ID is missing');
        alert('No spare part ID provided. Please check the URL and try again.');
        return;
    }

    fetchSparePartDetail(sparePartId, csrfToken, token)
        .then(sparePart => {
            if (sparePart) {
                renderSparePart(sparePart);
            } else {
                throw new Error('Spare part not found');
            }
        })
        .catch(error => {
            console.error('Error loading spare part:', error);
            alert('An error occurred while loading the spare part. Please try again later.');
        });
});

function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


function getCategory(category) {
    if (Number.isInteger(category) && category >= 1 && category <= 26) {
        return String.fromCharCode(64 + category);
    } else {
        console.log(category);
        return 'N/A';
    }
}

function mapSparePartData(sparePart) {
    return {
        id: sparePart.sparePartNum,
        name: sparePart.sparePartName,
        category: getCategory(sparePart.sparePartCategory),
        price: sparePart.price,
        imageUrl: "../../resources/image/spare/"+sparePart.sparePartImage,
        stockItemQty: sparePart.stockItemQty,
        weight: sparePart.weight || 'N/A',
        countryOfOrigin: sparePart.countryOfOrigin || 'N/A',
        brand: sparePart.brand || 'N/A'
    };
}


function fetchSparePartDetail(sparePartId, csrfToken, token) {
    return fetch('../../resources/php/SparePartDetail.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
            csrf_token: csrfToken,
            sparePartId: sparePartId,
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            return mapSparePartData(data.data);
        });
}
function renderSparePart(data) {
    // update page title
    document.title = "Spare Part - " + data.name;

    const sparePart = data;
    const container = document.getElementById('sparePartContainer');
    container.replaceChildren(); // Clear the container

    const mainDiv = document.createElement('div');
    mainDiv.className = 'bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden';

    const mdFlexDiv = document.createElement('div');
    mdFlexDiv.className = 'md:flex';

    // Image Section
    const imgSection = document.createElement('div');
    imgSection.className = 'md:w-1/2';
    const img = document.createElement('img');
    img.className = 'w-full h-auto object-cover';
    img.src = sparePart.imageUrl;
    img.alt = sparePart.name;
    img.id = 'sparePart-Image';
    imgSection.appendChild(img);

    // Info Section
    const infoSection = document.createElement('div');
    infoSection.className = 'md:w-1/2 p-6';
    infoSection.id = 'SparePartDetail';

    const nameElement = document.createElement('h1');
    nameElement.id = 'SparePartName';
    nameElement.className = 'text-2xl font-bold text-gray-900 dark:text-white mb-2';
    nameElement.textContent = sparePart.name;

    const partNoElement = document.createElement('p');
    partNoElement.id = 'SparePartNo';
    partNoElement.className = 'text-sm text-gray-600 dark:text-gray-400 mb-4';

    const partNoSpan = document.createElement('span');
    partNoSpan.id = 'SparePart-NO';
    partNoSpan.textContent = sparePart.id;

    partNoElement.textContent = 'No. ';
    partNoElement.appendChild(partNoSpan);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'flex items-center mb-4';

    const priceLabel = document.createElement('span');
    priceLabel.className = 'text-gray-700 dark:text-gray-300';
    priceLabel.textContent = 'Unit Price:';

    const priceValue = document.createElement('span');
    priceValue.id = 'SparePartPrice';
    priceValue.className = 'text-xl font-bold text-blue-600 dark:text-blue-400 ml-2';
    priceValue.textContent = `$${sparePart.price}`;

    priceDiv.appendChild(priceLabel);
    priceDiv.appendChild(priceValue);

    const stockElement = document.createElement('p');
    stockElement.className = 'text-gray-700 dark:text-gray-300 mb-4';

    const stockSpan = document.createElement('span');
    stockSpan.className = 'font-semibold';
    stockSpan.id = 'SparePart-Stock';
    stockSpan.textContent = sparePart.stockItemQty;

    stockElement.textContent = 'Stock Available: ';
    stockElement.appendChild(stockSpan);

    const quantityDiv = document.createElement('div');
    quantityDiv.className = 'flex items-center mb-6 hidden';

    const quantityLabel = document.createElement('span');
    quantityLabel.className = 'text-gray-700 dark:text-gray-300 mr-4';
    quantityLabel.textContent = 'Quantity:';

    const quantityControlDiv = document.createElement('div');
    quantityControlDiv.className = 'flex items-center border border-gray-300 rounded';

    const decrementButton = document.createElement('button');
    decrementButton.className = 'px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-150 ease-in-out';
    decrementButton.textContent = '-';
    decrementButton.id = 'decrementBtn';
    decrementButton.setAttribute('aria-label', 'Decrease quantity');
    decrementButton.onclick = decrementQuantity;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.id = 'quantity';
    quantityInput.value = '0';
    quantityInput.min = '0';
    quantityInput.max = '99';
    quantityInput.className = 'w-16 text-center border-x border-gray-300 py-1 dark:bg-gray-700 dark:text-white';

    quantityInput.addEventListener('change', updateQuantity);

    const incrementButton = document.createElement('button');
    incrementButton.className = 'px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-150 ease-in-out hidden';
    incrementButton.textContent = '+';
    incrementButton.id = 'incrementBtn';
    incrementButton.setAttribute('aria-label', 'Increase quantity');
    incrementButton.onclick = incrementQuantity;

    quantityControlDiv.appendChild(decrementButton);
    quantityControlDiv.appendChild(quantityInput);
    quantityControlDiv.appendChild(incrementButton);

    quantityDiv.appendChild(quantityLabel);
    quantityDiv.appendChild(quantityControlDiv);

    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'flex space-x-4';

    const buyNowButton = document.createElement('button');
    buyNowButton.className = 'bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-150 ease-in-out hidden';
    buyNowButton.id = 'buyNowBtn';
    buyNowButton.textContent = 'Buy It Now';
    buyNowButton.onclick = buyNow;

    const addToCartButton = document.createElement('button');
    addToCartButton.className = 'bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition duration-150 ease-in-out hidden';
    addToCartButton.textContent = 'Add To Cart';
    addToCartButton.id = 'addToCartBtn';
    addToCartButton.onclick = addToCart;

    const removeFromCartButton = document.createElement('button');
    removeFromCartButton.className = 'bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition duration-150 ease-in-out hidden';
    removeFromCartButton.textContent = 'Remove From Cart';
    removeFromCartButton.id = 'removeFromCartBtn';
    removeFromCartButton.onclick = removeFromCart;
    buttonDiv.appendChild(buyNowButton);
    buttonDiv.appendChild(addToCartButton);
    buttonDiv.appendChild(removeFromCartButton);

    mdFlexDiv.appendChild(imgSection);
    mdFlexDiv.appendChild(infoSection);
    mainDiv.appendChild(mdFlexDiv);
    container.appendChild(mainDiv);

    infoSection.appendChild(nameElement);
    infoSection.appendChild(partNoElement);
    infoSection.appendChild(priceDiv);
    infoSection.appendChild(stockElement);
    infoSection.appendChild(quantityDiv);
    infoSection.appendChild(buttonDiv);

    mdFlexDiv.appendChild(imgSection);
    mdFlexDiv.appendChild(infoSection);
    mainDiv.appendChild(mdFlexDiv);

    container.appendChild(mainDiv);

    // Spare Part Details
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden';

    const detailsContentDiv = document.createElement('div');
    detailsContentDiv.className = 'p-6';

    const detailsTitle = document.createElement('h2');
    detailsTitle.className = 'text-xl font-bold text-gray-900 dark:text-white mb-4';
    detailsTitle.textContent = 'Spare Part Details';

    const detailsGrid = document.createElement('div');
    detailsGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

    const detailsLeft = document.createElement('div');
    const detailsLeftName = document.createElement('p');
    detailsLeftName.className = 'text-gray-700 dark:text-gray-300';
    detailsLeftName.innerHTML = '<span class="font-semibold">Name: </span>';
    const detailsLeftNameSpan = document.createElement('span');
    detailsLeftNameSpan.id = 'SparePart-Detail-Name';
    detailsLeftNameSpan.textContent = sparePart.name;
    detailsLeftName.appendChild(detailsLeftNameSpan);

    const detailsLeftNumber = document.createElement('p');
    detailsLeftNumber.className = 'text-gray-700 dark:text-gray-300';
    detailsLeftNumber.innerHTML = '<span class="font-semibold">Spare Part Number: </span>';
    const detailsLeftNumberSpan = document.createElement('span');
    detailsLeftNumberSpan.id = 'SparePart-Detail-No';
    detailsLeftNumberSpan.textContent = sparePart.id;
    detailsLeftNumber.appendChild(detailsLeftNumberSpan);

    const detailsLeftPrice = document.createElement('p');
    detailsLeftPrice.className = 'text-gray-700 dark:text-gray-300';
    detailsLeftPrice.innerHTML = '<span class="font-semibold">Unit Price: </span>';
    const detailsLeftPriceSpan = document.createElement('span');
    detailsLeftPriceSpan.id = 'SparePart-Detail-Price';
    detailsLeftPriceSpan.textContent = `$${sparePart.price}`;
    detailsLeftPrice.appendChild(detailsLeftPriceSpan);

    detailsLeft.appendChild(detailsLeftName);
    detailsLeft.appendChild(detailsLeftNumber);
    detailsLeft.appendChild(detailsLeftPrice);

    const detailsRight = document.createElement('div');
    const detailsRightWeight = document.createElement('p');
    detailsRightWeight.className = 'text-gray-700 dark:text-gray-300';
    detailsRightWeight.innerHTML = '<span class="font-semibold">Weight: </span>';
    const detailsRightWeightSpan = document.createElement('span');
    detailsRightWeightSpan.id = 'SparePart-Detail-Weight';
    detailsRightWeightSpan.textContent = sparePart.weight;
    detailsRightWeight.appendChild(detailsRightWeightSpan);

    const detailsRightCountry = document.createElement('p');
    detailsRightCountry.className = 'text-gray-700 dark:text-gray-300';
    detailsRightCountry.innerHTML = '<span class="font-semibold">Country of Origin: </span>';
    const detailsRightCountrySpan = document.createElement('span');
    detailsRightCountrySpan.id = 'SparePart-Detail-Country';
    detailsRightCountrySpan.textContent = sparePart.countryOfOrigin;
    detailsRightCountry.appendChild(detailsRightCountrySpan);

    const detailsRightBrand = document.createElement('p');
    detailsRightBrand.className = 'text-gray-700 dark:text-gray-300';
    detailsRightBrand.innerHTML = '<span class="font-semibold">Brand: </span>';
    const detailsRightBrandSpan = document.createElement('span');
    detailsRightBrandSpan.id = 'SparePart-Detail-Brand';
    detailsRightBrandSpan.textContent = sparePart.brand;
    detailsRightBrand.appendChild(detailsRightBrandSpan);

    detailsRight.appendChild(detailsRightWeight);
    detailsRight.appendChild(detailsRightCountry);
    detailsRight.appendChild(detailsRightBrand);

    detailsGrid.appendChild(detailsLeft);
    detailsGrid.appendChild(detailsRight);

    detailsContentDiv.appendChild(detailsTitle);
    detailsContentDiv.appendChild(detailsGrid);

    detailsDiv.appendChild(detailsContentDiv);
    container.appendChild(detailsDiv);
}

const API_URL = '../../resources/php/CartApi.php';
const TOKEN = localStorage.getItem('token');
const CSRF_TOKEN = "213213";
let CART_ID = localStorage.getItem('cartId');
let partId = getParameterByName('id');

function decrementQuantity() {
    const input = document.getElementById(`incrementBtn`);
    if (input.value > 0) {
        input.value = parseInt(input.value) - 1;
        updateQuantity(input.value);
    }
}

function incrementQuantity() {
    const input = document.getElementById(`incrementBtn`);
    input.value = parseInt(input.value) + 1;
    updateQuantity(input.value);
}

async function updateQuantity(newQuantity) {
    try {
        const cart = await getCart();
        const itemInCart = cart.cartItems.some(item => item.id === partId);

        if (newQuantity > 0) {
            const result = itemInCart
                ? await fetchApi('update', { partId, quantity: newQuantity })
                : await fetchApi('add', { partId, quantity: newQuantity });
            console.log("Cart updated", result);
            updateLocalCart(result.cartItems);
            updateUIAfterCartChange(partId, true);
            return result;
        } else if (itemInCart) {
            return await removeFromCart(partId);
        } else {
            updateUIAfterCartChange(partId, false);
        }
    } catch (error) {
        console.error(`Failed to update quantity for part ${partId}:`, error);
        alert(error.message);
    }
}

async function addToCart() {
    const quantity = parseInt(document.getElementById(`quantity-${partId}`).value);
    if (quantity > 0) {
        await updateQuantity(partId, quantity);
    } else {
        alert('Please select a quantity greater than 0');
    }
}

async function removeFromCart() {
    try {
        const result = await fetchApi('remove', { partId });
        console.log("Item removed from cart", result);
        updateLocalCart(result.cartItems);
        updateUIAfterCartChange(partId, false);
        document.getElementById(`quantity-${partId}`).value = '0';
        alert('Item removed successfully');
        return result;
    } catch (error) {
        console.error(`Failed to remove item ${partId} from cart:`, error);
        alert(error.message);
    }
}


function updateLocalCart(cartItems) {
    localStorage.setItem('cart', JSON.stringify({
        cartId: CART_ID,
        cartItems: cartItems,
    }));
}

async function fetchApi(action, data = {}) {
    try {
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': TOKEN,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                cartId: CART_ID,
                ...data
            }),
        });
        const result = await response.json();
        if (result.status === 'error') {
            throw new Error(result.message || 'An error occurred');
        }
        return result;
    } catch (error) {
        console.error(`Error in ${action} operation:`, error);
        throw error;
    }
}

function updateUIAfterCartChange(partId, isInCart) {
    const addBtn = document.getElementById(`addToCartBtn`);
    const removeBtn = document.getElementById(`removeFromCartBtn`);
    const quantityInput = document.getElementById(`quantity`);

    if (isInCart) {
        addBtn.classList.add('hidden');
        removeBtn.classList.remove('hidden');
        quantityInput.disabled = false;
    } else {
        addBtn.classList.remove('hidden');
        removeBtn.classList.add('hidden');
        quantityInput.disabled = true;
        quantityInput.value = '0';
    }
}

async function getCart() {
    try {
        const result = await fetchApi('get', { cartId: CART_ID });
        console.log("Retrieved cart", result);
        if (result.cartItems) {
            updateLocalCart(result.cartItems);
            result.cartItems.forEach(item => {
                updateUIAfterCartChange(item.id, true);
                document.getElementById(`quantity-${item.id}`).value = item.quantity;
            });
        } else {
            console.warn("Cart items not found in response");
        }
        return result;
    } catch (error) {
        console.error("Failed to retrieve cart:", error);
        return { cartItems: [] };
    }
}

async function createCart() {
    try {
        const result = await fetchApi('create', { userId: localStorage.getItem('username') });
        if (result.cartId) {
            CART_ID = result.cartId;
            localStorage.setItem('cartId', CART_ID);
            return CART_ID;
        } else {
            throw new Error('Cart ID not received from server');
        }
    } catch (error) {
        console.error("Failed to create cart:", error);
        throw error;
    }
}

async function initializeCart() {
    try {
        if (!CART_ID) {
            CART_ID = await createCart();
        }
        await getCart();
    } catch (error) {
        console.error("Failed to initialize cart:", error);
        showUserFriendlyError("Failed to initialize cart. Please refresh the page and try again.");
    }
}

function showUserFriendlyError(message) {
    alert(message);
}

document.addEventListener('DOMContentLoaded', async () => {
    await initializeCart();
});

function buyNow() {
    addToCart().then(r => {
        if (r.status === 'success') {
            showUserFriendlySuccess('Item added to cart successfully');
            // redirect to cart page
            //window.location.href = 'shoppingCart.php';
        } else {
            showUserFriendlyError('Failed to add item to cart. Please try again later.');
        }
    })
    alert('Buy It Now clicked!');
}
function showUserFriendlySuccess(message) {
    alert(message);
}

function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].trim().split("=");
        if (cookiePair[0] === name) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', async () => {
    await initializeCart();
});