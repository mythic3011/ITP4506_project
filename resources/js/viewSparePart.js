document.addEventListener('DOMContentLoaded', function () {
    let spareParts = [];
    const csrfToken = getCookie('csrf_token');
    const Token = getCookie('token');
    let cart = [];
    let categoryHashMap = {
        'A': 'Sheet Metal',
        'B': 'Major Asssemblies',
        'C': 'Light Components',
        'D': 'Accessories',
    };

    function getCategory(category) {
        if (Number.isInteger(category) && category >= 1 && category <= 26) {
            return String.fromCharCode(64 + category);
        } else {
            console.log(category);
            return 'N/A';
        }
    }

    // if it in return categoryHashMap[category]; not return N/A
    function getCategoryName(category) {
        if (categoryHashMap[category]) {
            return categoryHashMap[category];
        } else {
            return 'N/A';
        }
    }

    // Fetch spare parts data
    fetch('../../resources/json/Product.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('token'),
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
            Token: Token,
            csrf_token: csrfToken,
        }),
    })
        .then(response => response.json())
        .then(data => {
            let MappedData = [];
            console.log(data.data);
            for (let i = 0; i < data.data.length; i++) {
                MappedData.push({
                    id: data.data[i].sparePartNum,
                    name: data.data[i].sparePartName,
                    category: getCategory(data.data[i].sparePartCategory),
                    price: data.data[i].price,
                    imageUrl: data.data[i].sparePartImage,
                    stockItemQty: data.data[i].stockItemQty,
                });
            }
            spareParts = MappedData;
            console.log(spareParts);
            renderSpareParts(spareParts);
        })
        .catch(error => console.error('Error fetching spare parts:', error));

    // Sorting event listener
    document.getElementById('SparePartSorting').addEventListener('change', function () {
        if (this.value === 'Category') {
            document.getElementById('CategoryFilterContainer').style.display = 'block';
        } else {
            document.getElementById('CategoryFilterContainer').style.display = 'none';
        }
        applyFiltersAndSort();
    });

    // Category filter event listener
    document.getElementById('CategoryFilter').addEventListener('change', function () {
        applyFiltersAndSort();
    });

    // Search functionality
    document.getElementById('sparePartSearch').addEventListener('input', function () {
        applyFiltersAndSort();
    });

    function replace(nun) {
        return nun.replace(':', '');
    }

    function applyFiltersAndSort() {
        const searchTerm = document.getElementById('sparePartSearch').value.toLowerCase();
        const sortBy = document.getElementById('SparePartSorting').value;
        const categoryFilter = document.getElementById('CategoryFilter').value;

        let filteredParts = spareParts.filter(part =>
            (part.name.toLowerCase().includes(searchTerm) ||
                part.id.toLowerCase().includes(searchTerm)) &&
            (categoryFilter === 'All' || part.category === categoryFilter)
        );

        // Apply sorting
        switch (sortBy) {
            case 'Price-Low-to-High':
                filteredParts.sort((a, b) => a.price - b.price);
                break;
            case 'Price-High-to-Low':
                filteredParts.sort((a, b) => b.price - a.price);
                break;
            case 'Category':
                filteredParts.sort((a, b) => a.category.localeCompare(b.category));
                break;
        }

        console.log(filteredParts);
        renderSpareParts(filteredParts);
    }


    function renderSpareParts(parts) {
        const container = document.getElementById('SparePartList');
        container.replaceChildren(); // Clear the container

        // Get all unique categories from the parts
        const categories = [...new Set(parts.map(part => part.category))];

        // Populate category filter
        const categoryFilter = document.getElementById('CategoryFilter');
        const currentSelection = categoryFilter.value; // Store current selection

        // Clear the dropdown menu
        while (categoryFilter.firstChild) {
            categoryFilter.removeChild(categoryFilter.firstChild);
        }

        // Add "All Categories" option
        const defaultOption = document.createElement('option');
        defaultOption.value = "All";
        defaultOption.textContent = "All Categories";
        categoryFilter.appendChild(defaultOption);

        // Add other category options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = `Category ${category}`;
            categoryFilter.appendChild(option);
        });

        // Restore previous selection if it exists in the new options, otherwise select "All"
        const availableOptions = ["All", ...categories];
        if (availableOptions.includes(currentSelection)) {
            categoryFilter.value = currentSelection;
        } else {
            categoryFilter.value = "All";
        }

        // Filter parts based on selected category
        const selectedCategory = categoryFilter.value;
        const filteredParts = selectedCategory === "All"
            ? parts
            : parts.filter(part => part.category === selectedCategory);

        // Populate the spare parts list
        const filteredCategories = [...new Set(filteredParts.map(part => part.category))];
        filteredCategories.forEach(category => {
            const categoryParts = filteredParts.filter(part => part.category === category);
            if (categoryParts.length === 0) return; // Skip empty categories

            const categoryElement = document.createElement('div');
            categoryElement.className = 'mb-8';
            categoryElement.id = `SparePartList-${category}`;

            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'text-2xl font-semibold mb-4 text-gray-900 dark:text-white';
            categoryTitle.textContent = `${category} - ${getCategoryName(category)}`;
            categoryElement.appendChild(categoryTitle);

            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

            categoryParts.forEach(part => {
                const card = createSparePartCard(part);
                grid.appendChild(card);
            });

            categoryElement.appendChild(grid);
            container.appendChild(categoryElement);
        });
    }

    // Event listener to handle category change
    document.getElementById('CategoryFilter').addEventListener('change', function () {
        renderSpareParts(spareParts); // Assuming 'parts' is available in the scope
    });

    function createSparePartCard(part) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';

        const img = document.createElement('img');
        img.className = 'w-full h-48 object-cover';
        img.src = "../../resources/image/spare/" + part.imageUrl;
        img.alt = part.name;
        card.appendChild(img);

        const content = document.createElement('div');
        content.className = 'p-4';

        const title = document.createElement('h3');
        title.className = 'text-lg font-semibold mb-2 text-gray-900 dark:text-white';
        title.textContent = part.name;
        content.appendChild(title);

        const partNo = document.createElement('p');
        partNo.className = 'text-gray-600 dark:text-gray-300 mb-2';
        partNo.textContent = `Spare Part No. ${part.id}`;
        content.appendChild(partNo);

        const price = document.createElement('p');
        price.className = 'text-gray-600 dark:text-gray-300 mb-4';
        price.textContent = `Unit Price: $${part.price}`;
        content.appendChild(price);

        const actions = document.createElement('div');
        actions.className = 'flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 sm:space-x-2';

        const viewDetails = document.createElement('a');
        viewDetails.href = `sparePart-template.html?id=${part.id}`;
        viewDetails.className = 'inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 text-center text-sm';
        viewDetails.textContent = 'View Details';
        actions.appendChild(viewDetails);

        const quantityControl = createQuantityControl(part.id);
        actions.appendChild(quantityControl);

        content.appendChild(actions);
        card.appendChild(content);

        return card;
    }



    function createQuantityControl(partId) {
        const container = document.createElement('div');
        container.className = 'flex items-center space-x-2';

        const quantityWrapper = document.createElement('div');
        quantityWrapper.className = 'flex items-center border border-gray-300 rounded';

        const decrementBtn = document.createElement('button');
        decrementBtn.className = 'bg-gray-200 text-gray-800 w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition duration-300';
        decrementBtn.onclick = () => decrementQuantity(partId);
        decrementBtn.innerHTML = '<span class="text-lg font-bold">-</span>';
        quantityWrapper.appendChild(decrementBtn);

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `quantity-${partId}`;
        input.value = '0';
        input.min = '0';
        input.className = 'w-12 h-8 text-center text-sm border-x border-gray-300 dark:bg-gray-700 dark:text-white appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none moz-appearance:textfield';
        input.onchange = (e) => updateQuantity(partId, e.target.value);
        quantityWrapper.appendChild(input);

        const incrementBtn = document.createElement('button');
        incrementBtn.className = 'bg-gray-200 text-gray-800 w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition duration-300';
        incrementBtn.onclick = () => incrementQuantity(partId);
        incrementBtn.innerHTML = '<span class="text-lg font-bold">+</span>';
        quantityWrapper.appendChild(incrementBtn);

        container.appendChild(quantityWrapper);

        const addToCartBtn = document.createElement('button');
        addToCartBtn.onclick = () => addToCart(partId);
        addToCartBtn.id = `addToCartBtn-${partId}`;
        addToCartBtn.className = 'bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 text-sm';
        addToCartBtn.textContent = 'Add to Cart';
        container.appendChild(addToCartBtn);

        const removeFromCartBtn = document.createElement('button');
        removeFromCartBtn.onclick = () => removeFromCart(partId);
        removeFromCartBtn.id = `removeFromCartBtn-${partId}`;
        removeFromCartBtn.className = 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 text-sm hidden';
        removeFromCartBtn.textContent = 'Remove from Cart';
        container.appendChild(removeFromCartBtn);

        return container;
    }

    const API_URL = '../../resources/php/CartApi.php';
    const TOKEN = localStorage.getItem('token');
    const CSRF_TOKEN = "213213";
    let CART_ID = localStorage.getItem('cartId');
    const userId = localStorage.getItem('username');

    function decrementQuantity(partId) {
        const input = document.getElementById(`quantity-${partId}`);
        if (input.value > 0) {
            input.value = parseInt(input.value) - 1;
            updateQuantity(partId, input.value);
        }
    }

    function incrementQuantity(partId) {
        const input = document.getElementById(`quantity-${partId}`);
        input.value = parseInt(input.value) + 1;
        updateQuantity(partId, input.value);
    }

    async function fetchApi(action, data = {}) {
        try {
            const response = await fetch(`${API_URL}?action=${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': TOKEN,
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': CSRF_TOKEN,
                },
                body: JSON.stringify({
                    cartId: CART_ID,
                    ...data
                }),
            });
            const result = await response.json();
            if (result.status !== 'success') {
                throw new Error(result.message || 'An error occurred');
            }
            return result;
        } catch (error) {
            console.error(`Error in ${action} operation:`, error);
            throw error;
        }
    }



    async function addToCart(partId) {
        const quantity = parseInt(document.getElementById(`quantity-${partId}`).value);
        if (quantity > 0) {
            await updateQuantity(partId, quantity);
        } else {
            alert('Please select a quantity greater than 0');
        }
    }

    async function removeFromCart(partId) {
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

    function updateUIAfterCartChange(partId, isInCart) {
        const addBtn = document.getElementById(`addToCartBtn-${partId}`);
        const removeBtn = document.getElementById(`removeFromCartBtn-${partId}`);
        const quantityInput = document.getElementById(`quantity-${partId}`);

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

    async function updateQuantity(partId, newQuantity) {
        if (!CART_ID || !partId) {
            console.error("Cart ID and Item ID are required");
            return;
        }

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


    async function getCart() {
        try {
            const result = await fetchApiGET('get', { cartId: CART_ID }, 'GET');
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

    async function fetchApiGET(action, data = {}, method = 'POST') {
        try {
            const url = new URL('../../resources/php/CartApi.php', window.location.href);
            url.searchParams.append('action', action);

            const options = {
                method: method,
                headers: {
                    'Authorization': TOKEN,
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': CSRF_TOKEN,
                },
            };

            if (method === 'GET') {
                // For GET requests, append data to URL
                Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
            } else {
                // For POST requests, add data to body
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify({
                    cartId: CART_ID,
                    ...data
                });
            }

            const response = await fetch(url.href, options);
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



    async function createCart() {
        try {
            const result = await fetchApi('create', { userId: userId });
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
        if (!CART_ID) {
            try {
                const result = await createCart();
                if (result && result.cartId) {
                    CART_ID = result.cartId;
                    localStorage.setItem('cartId', CART_ID);
                } else {
                    throw new Error('Failed to create cart');
                }
            } catch (error) {
                console.error("Failed to initialize cart:", error);
                alert("Failed to initialize cart. Please refresh the page and try again.");
                return;
            }
        }

        try {
            await getCart();
        } catch (error) {
            console.error("Failed to retrieve cart:", error);
        }
    }



    function initializeQuantityControls() {
        const productElements = document.querySelectorAll('[data-part-id]');
        productElements.forEach(element => {
            const partId = element.dataset.partId;
            const quantityControl = createQuantityControl(partId);
            element.appendChild(quantityControl);
        });
    }

    document.addEventListener('DOMContentLoaded', async () => {
        await initializeCart();

        function isValidCartId(cartId) {
            return cartId && typeof cartId === 'string' && cartId.trim() !== '';
        }

        if (!isValidCartId(CART_ID)) {
            await initializeCart();
        }
        initializeQuantityControls();
    });

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
});