// path: resources/json/order_api.php
// This file is used to update the order status and update the order json file via JQuery

function displayError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.id = "errorDiv";
    errorDiv.style.display = "margin-top: 1rem, text-align: center, color: #EF4444";
    errorDiv.textContent = message;
    document
        .getElementById("orderSummaryDiv")
        .insertAdjacentElement("beforebegin", errorDiv);
}

document.addEventListener("DOMContentLoaded", function () {
    // if (getURLParameter('id') == null || localStorage.getItem('userToken') == null) {
    //     window.location.href = "../../error/403.html";
    // }

    showLoading();
    fetchOrderData()
        .then((orderData) => {
            console.log(orderData);
            renderOrderSummary(orderData.summary);
            renderOrderItems(orderData.items);
            renderOrderActions(orderData.summary);
            setupEventListeners();
        })
        .catch((error) => {
            console.error("Error fetching order data:", error);
            displayError(error.message);
        })
        .finally(() => {
            hideLoading();
        });
});

function getURLParameter(name) {
    return new URLSearchParams(window.location.search).get(name);
}

// Since the order store is in a json file, get the order data from the json file and display it
function fetchOrderData() {
    // orderID is for filtering the order data
    const orderID = getURLParameter("OrderId");
    const apiUrl = `../../resources/json/order.json`;

    return fetch(apiUrl, {
        method: "GET",})
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // filter the order id from the json file and return the filtered data
            const jsonData = JSON.parse(response.data);
            console.log(jsonData);
            return jsonData.filter((order) => order.orderID === orderID);
        })
        .then((data) => {
            if (data.status === "success" && data.data) {
                return data.data;
            } else {
                throw new Error(data.message || "Failed to fetch order details");
            }
        })
        .catch((error) => {
            console.error("Error fetching order data:", error);
            window.location.href = "./viewOrderRecord.html"
            throw error; // Re-throw the error for further handling if needed
        });
}

function formatDate(dateString) {
    // DD/MM/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split("/");
        return `${day}/${month}/${year}`;
    }
    // YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    }
    console.error("Invalid date string:", dateString);
    return "Invalid Date";
}

function formatTime(timeString) {
    if (!timeString || !/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
        console.error("Invalid time string:", timeString);
        return "Invalid Time";
    }
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
}

function renderOrderSummary(order) {
    const summaryContainer = document.getElementById("orderSummary");
    summaryContainer.innerHTML = `
        <p><strong>Order Date:</strong> ${formatDate(order.orderDate)}</p>
        <p><strong>Order Time:</strong> ${order.orderTime}</p>
        <p><strong>Order Status:</strong> ${order.orderStatus}</p>
        <p><strong>Sales Manager ID:</strong> ${order.salesManagerId}</p>
        <p><strong>Sales Manager:</strong> ${order.salesManager}</p>
        <p><strong>Contact:</strong> ${order.salesManagerContact}</p>
        <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
        <p><strong>Delivery Date:</strong> ${formatDate(order.deliveryDate)}</p>
        <p><strong>Contact Person:</strong> ${order.contactPerson}</p>
        <p><strong>Contact Phone:</strong> ${order.contactPhone}</p>
        <p><strong>Total Amount:</strong> $${order.totalAmount.toLocaleString()}</p>
        <p><strong>Total Cost:</strong> $${order.totalCost.toLocaleString()}</p>
    `;
    document.getElementById(
        "OrderDetails-title"
    ).textContent = `Order Details - ${order.id}`;
}

function renderOrderItems(items) {
    const itemsContainer = document.getElementById("order-Details-Product");
    itemsContainer.innerHTML = items
        .map(
            (item) => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">${item.name} (${
                item.id
            })</td>
            <td class="px-6 py-4 whitespace-nowrap">${item.quantity}</td>
            <td class="px-6 py-4 whitespace-nowrap">$${item.price.toLocaleString()}</td>
            <td class="px-6 py-4 whitespace-nowrap">$${(
                item.quantity * item.price
            ).toLocaleString()}</td>
        </tr>
    `
        )
        .join("");
}

function renderOrderActions(order) {
    const actionButtons = getActionButtons();

    switch (order.orderStatus) {
        case "Wait for confirmation":
            setActionVisibility(actionButtons, false, false);
            break;
        case "Shipping":
            setActionVisibility(actionButtons, true, false);
            break;
        case "Preparing":
            setActionVisibility(actionButtons, true, true);
            break;
        case "Shipped":
            setActionVisibility(actionButtons, true, true);
            break;
        case "Cancelled":
        default:
            setActionVisibility(actionButtons, false, false);
            break;
    }
}

function setActionVisibility(actions, print, download) {
    actions.confirmBtn.style.display = print ? "block" : "none";
    actions.processingBtn.style.display = download ? "block" : "none";
    actions.shippingBtn.style.display = download ? "block" : "none";
    actions.shippedBtn.style.display = download ? "block" : "none";
    actions.cancelBtn.style.display = download ? "block" : "none";
}

function initializeOrderActionButtons() {
    const actionButtons = getActionButtons();
    actionButtons.confirmBtn.addEventListener("click", () =>
        updateOrderStatus("Confirmed")
    );
    actionButtons.processingBtn.addEventListener("click", () =>
        updateOrderStatus("Processing")
    );
    actionButtons.shippingBtn.addEventListener("click", () =>
        updateOrderStatus("Shipping")
    );
    actionButtons.shippedBtn.addEventListener("click", () =>
        updateOrderStatus("Shipped")
    );
    actionButtons.cancelBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to cancel the order?")) {
            updateOrderStatus("Cancelled");
        }
    });
}

function getActionButtons() {
    return {
        confirmBtn: document.getElementById("confirmBtn"),
        processingBtn: document.getElementById("processingBtn"),
        shippingBtn: document.getElementById("shippingBtn"),
        shippedBtn: document.getElementById("shippedBtn"),
        cancelBtn: document.getElementById("cancelBtn"),
    };
}

function updateOrderStatus(status) {
    // update the order json file
    const orderId = getUrlParameter("orderId");
    (
        "POST",
        `../../resources/json/order.json`)
        // get
        .then((response) => {
            // search for the order id on the json file and modify the json file if found
            if (response.status === 200) {
                jsonData = JSON.parse(response.data);
                jsonData.orderStatus = status;
                console.log(jsonData);
                // update the json file
                fetch(`../../resources/json/order.json`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(jsonData),
                })
                    .then((response) => {
                        if (response.status === 200) {
                            alert(`Order ${status.toLowerCase()}ed successfully`);
                            loadOrderData();
                        } else {
                            alert(`Failed to ${status.toLowerCase()} order`);
                        }
                    })
                    .catch((error) => {
                        console.error(`Error ${status.toLowerCase()}ing order:`, error);
                        alert(`Failed to ${status.toLowerCase()} order`);
                    });
            }

        })
        .catch((error) => {
            console.error(`Error ${status.toLowerCase()}ing order:`, error);
            alert(`Failed to ${status.toLowerCase()} order`);
        });
}

function setupEventListeners() {
    document
        .getElementById("mobileMenuButton")
        .addEventListener("click", toggleMobileMenu);
    document
        .getElementById("darkModeToggle")
        .addEventListener("click", toggleDarkMode);
    initializeOrderActionButtons();
}

function getUrlParameter(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById("mobileMenu");
    mobileMenu.style.display =
        mobileMenu.style.display === "none" ? "flex" : "none";
}

function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
}

function showLoading() {
    document.getElementById("loadingSpinner").classList.remove("hidden");
    document.getElementById("orderSummaryDiv").classList.add("hidden");
    document.getElementById("orderActionsDiv").classList.add("hidden");
    document.getElementById("orderItemsDiv").classList.add("hidden");
    document.getElementById("OrderDetails-title").textContent =
        "Order Details - Loading...";
    document.title = "Order Details - Loading...";
}

function hideLoading() {
    document.getElementById("loadingSpinner").classList.add("hidden");
    document.getElementById("orderSummaryDiv").classList.remove("hidden");
    document.getElementById("orderActionsDiv").classList.remove("hidden");
    document.getElementById("orderItemsDiv").classList.remove("hidden");
    document.title = "Order Details";
}
