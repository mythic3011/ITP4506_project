document.addEventListener('DOMContentLoaded', function () {
    getSparePartList();
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', function () {
        document.documentElement.classList.toggle('dark');
    });

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navbarDefault = document.getElementById('navbar-default');
    mobileMenuButton.addEventListener('click', function () {
        navbarDefault.classList.toggle('hidden');
    });
});

tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    "50": "#eff6ff",
                    "100": "#dbeafe",
                    "200": "#bfdbfe",
                    "300": "#93c5fd",
                    "400": "#60a5fa",
                    "500": "#3b82f6",
                    "600": "#2563eb",
                    "700": "#1d4ed8",
                    "800": "#1e40af",
                    "900": "#1e3a8a",
                    "950": "#172554"
                }
            }
        },
        fontFamily: {
            'body': [
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ],
            'sans': [
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ]
        }
    }
};

function getSparePartList() {
    
    // const spareParts = [
    //     {
    //         id: '1',
    //         partNumber: 'SL00001',
    //         partCategory: 'Category A',
    //         partName: 'Left front door',
    //         partImage: '../../resources/image/spare/A/100002.png',
    //         description: 'The front for Toyota',
    //         weight: 20,
    //         stockQuantity: 37,
    //         price: '597 HKD'
    //     }
    // ];

    const spareParts = [];

    fetch('../../resources/php/ManageItem.php')
        .then(response => response.json())
        .then(data => {
            spareParts.push(...data);
            renderSparePartsTable(spareParts);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    const tableBody = document.getElementById('table-body');
    tableBody.replaceChildren();

    spareParts.forEach(part => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <label for="checkbox-item-${part.id}">
                    <input id="checkbox-item-${part.id}" type="checkbox" class="checkbox">
                </label>
            </td>
            <td id="item-${part.id}-spare-part-no">${part.partNumber}</td>
            <td id="item-${part.id}-spare-part-category">${getCategory(part.partCategory)}</td>
            <td id="item-${part.id}-spare-part-name">${part.partName}</td>
            <td><img alt="Part Image" src="${part.partImage}"></td>
            <td id="item-${part.id}-spare-part-description">${part.description}</td>
            <td id="item-${part.id}-weight">${part.weight}</td>
            <td id="item-${part.id}-stock-quantity">${part.stockQuantity}</td>
            <td id="item-${part.id}-price">${part.price}</td>
        `;
        tableBody.appendChild(row);
    });
}

function itemAction(action) {
    if (action === 'add') {
        console.log('Add item');
        window.location.href = 'AddItem.html';
    } else if (action === 'edit') {
        const checkboxes = document.querySelectorAll('#sparePartsTableBody input[type="checkbox"]:checked');
        
        if (checkboxes.length === 0) {
            alert('Please select an item to edit');
            return;
        }
        
        if (checkboxes.length > 1) {
            alert('Please select only one item to edit');
            return;
        }
        
        const selectedRow = checkboxes[0].closest('tr');
        const partNumber = selectedRow.querySelector('td:nth-child(2)').textContent;
        
        window.location.href = `editItem.html?id=${encodeURIComponent(partNumber)}`;
        
    } else if (action === 'delete') {
        const checkboxes = document.querySelectorAll('#sparePartsTableBody input[type="checkbox"]:checked');
        if (checkboxes.length === 0) {
            alert('No items selected for deletion');
            return;
        }

        const selectedIds = Array.from(checkboxes).map(checkbox => {
            const row = checkbox.closest('tr');
            return row.querySelector('td:nth-child(2)').textContent; 
        });

        if (confirm(`Are you sure you want to delete ${selectedIds.length} item(s)?`)) {
            fetchAPIForItemList('BatchDelete', 'POST', { ids: selectedIds })
                .then(result => {
                    console.log('Items deleted:', result);
                    alert('Items deleted successfully');
                    loadAndRenderSpareParts(); // Refresh the table
                })
                .catch(error => {
                    console.error('Error deleting items:', error);
                    alert('Error deleting items: ' + error.message);
                });
        }

        console.log('Delete items with Part Numbers:', selectedIds);
    }
}


//item list
function renderSparePartsTable(spareParts) {
    const tableBody = document.getElementById('sparePartsTableBody');

    const totalItems = document.getElementById('total-items');
        if (totalItems) {
            totalItems.textContent = `Total: ${spareParts.length} Items`;
        }

    tableBody.replaceChildren(); // Clear the table body

    spareParts.forEach((part, index) => {
        const row = document.createElement('tr');
        row.className = index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700';
        category = "N/A";
        switch (part.sparePartCategory) {
            case 1:
                category = "A";
                break;
            case 2:
                category = "B";
                break;
            case 3:
                category = "C";
                break;
            case 4:
                category = "D";
                break;
            default:
                category = "N/A";
                break;
        }
        row.innerHTML = `
         <td class="w-4 p-4">
            <div class="flex items-center">
                <input id="checkbox-table-${part.sparePartNum}" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                       data-part-number="${part.sparePartNum}">
                <label for="checkbox-table-${part.sparePartNum}" class="sr-only">checkbox</label>
            </div>
        </td>
        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${part.sparePartNum}</td>
        <td class="px-6 py-4">${category}</td>
        <td class="px-6 py-4">${part.sparePartName}</td>
        <td class="px-6 py-4"><img src="../../resources/image/spare/${part.sparePartImage}" alt="${part.name}" class="w-10 h-10 rounded-full" onerror="this.src='../../resources/image/spare/NoImage.jpg'"></td>
        <td class="px-6 py-4">${part.sparePartDescription}</td>
        <td class="px-6 py-4">${part.weight}</td>
        <td class="px-6 py-4">${part.stockItemQty}</td>
        <td class="px-6 py-4">${part.price} HKD</td>
    `;
        tableBody.appendChild(row);
    });
}

function fetchAPIForItemList(action = 'list', method = 'GET', data = null) {
    const apiUrl = `../../resources/php/ManageItem.php?action=${action}`;
    const AuthToken = localStorage.getItem('userToken');

    console.log('Fetching from URL:', apiUrl);
    console.log('Action:', action);
    console.log('Method:', method);

    const fetchOptions = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AuthToken}`
        },
        credentials: 'include'
    };

    if (method === 'POST' && data) {
        fetchOptions.body = JSON.stringify(data);
    }

    return fetch(apiUrl, fetchOptions)
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
                });
            }
            return response.json();
        })
        .then(result => {
            console.log('Received data:', result);
            if (result.status === 'success') {
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to fetch spare parts data');
            }
        })
        .catch(error => {
            console.error('Error fetching spare parts data:', error);
            throw error;
        });
}

function loadAndRenderSpareParts() {
    console.log("loadAndRenderSpareParts called");
    fetchAPIForItemList('list', 'GET')
        .then(spareParts => {
            if (spareParts && spareParts.length > 0) {
                console.log("Received spare parts:", spareParts);
                renderSparePartsTable(spareParts);
            } else {
                console.log("No spare parts data received");
                document.getElementById('sparePartsTableBody').innerHTML = '<tr><td colspan="9">No spare parts data available</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error loading spare parts:', error);
            document.getElementById('sparePartsTableBody').innerHTML = `<tr><td colspan="9">Error: ${error.message}</td></tr>`;
        });
}

function initSpareParts() {
    loadAndRenderSpareParts();
}


//edit item
function fetchAPIForEdit(id) {
    const apiUrl = `../../resources/php/ManageItem.php?action=get&id=${encodeURIComponent(id)}`;
    const AuthToken = localStorage.getItem('userToken');

    console.log('Fetching from URL:', apiUrl);

    return fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AuthToken}`
        },
        credentials: 'include'
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
            });
        }
        return response.json();
    })
    .then(result => {
        console.log('Received data:', result);
        if (result.status === 'success') {
            return result.data;
        } else {
            throw new Error(result.message || 'Failed to fetch spare part data');
        }
    });
}

function fetchItemData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        alert('No item ID provided');
        return;
    }

    console.log('Fetching item with ID:', id);

    fetchAPIForEdit(id)
        .then(itemData => {
            console.log('Item data received:', itemData);
            
            if (!itemData || typeof itemData !== 'object') {
                throw new Error('Invalid item data received');
            }

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

            // Update the DOM with the fetched data, using optional chaining and nullish coalescing
            document.getElementById("sparePartNumber").textContent = itemData.sparePartNum ?? '';
            document.getElementById("sparePartCategory").textContent = getCategory(itemData.sparePartCategory) ?? '';
            document.getElementById("sparePartName").textContent = itemData.sparePartName ?? '';
            document.getElementById("sparePartWeight").textContent = itemData.weight ?? '';
            document.getElementById("input-stock-quantity").value = itemData.stockItemQty ?? '';
            document.getElementById("input-price").value = itemData.price ?? '';
            document.getElementById("description").value = itemData.sparePartDescription ?? '';
            
            const currentImageElement = document.getElementById("currentImage");
            if (currentImageElement) {
                if (itemData.sparePartImage) {
                    currentImageElement.src = `../../resources/image/spare/${itemData.sparePartImage}`;
                    currentImageElement.alt = 'Spare Part Image';
                } else {
                    currentImageElement.src = ''; // Set to empty or a default image path
                    currentImageElement.alt = 'No image available';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching item data:', error);
            alert('Error fetching item data: ' + error.message);
        });
}


function updateItem() {
    const id = document.getElementById("sparePartNumber").textContent;
    const updateData = {
        id: id,
        stockItemQty: document.getElementById("input-stock-quantity").value,
        price: document.getElementById("input-price").value,
        sparePartDescription: document.getElementById("description").value
    };

    const fileInput = document.getElementById("file");
    if (fileInput.files.length > 0) {
        // If a new image is selected, we need to handle file upload differently
        // This might require a separate API call or a different approach
        console.warn('File upload not implemented in this example');
    }

    fetchAPI('update', 'POST', updateData)
        .then(result => {
            console.log('Item updated:', result);
            alert('Item updated successfully!');
            // Redirect back to the main page
            window.location.href = 'Item.html';
        })
        .catch(error => {
            console.error('Error updating item:', error);
            alert('Error updating item: ' + error.message);
        });
}