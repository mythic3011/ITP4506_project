export class OrderRecordView {
    constructor(elements) {
        this.elements = elements;
    }

    renderOrders(orders) {
        this.elements.recordsContainer.innerHTML = orders.map(order => this.createOrderCard(order)).join('');
    }

    createOrderCard(order) {
        const vehicle = order.getFirstVehicle();
        return `
            <div class="order-card shadow-md rounded-lg bg-white" data-order-date="${order.date}">
                <div class="order-header">
                    <span class="order-id">${order.id}</span>
                    <span class="order-status ${order.getStatusClass()}">${order.status}</span>
                </div>
                <div class="order-content">
                    <div class="vehicle-info">
                        <h3 class="vehicle-name">${vehicle.make} ${vehicle.model}</h3>
                        <div class="order-details">
                            <p>Order Date: ${formatDate(order.date)}</p>
                            <p>Total: ${formatCurrency(order.getTotalPrice())}</p>
                        </div>
                    </div>
                    <div class="order-actions">
                        <button class="primary-button view-details-btn" data-order-id="${order.id}">
                            View Details
                        </button>
                        <button class="secondary-button upload-document-btn" data-order-id="${order.id}">
                            Upload Documents
                        </button>
                        ${order.status === 'pending' ? `
                            <button class="primary-button confirm-pickup-btn" data-order-id="${order.id}">
                                Confirm Pickup
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderOrderDetails(order) {
        const vehicle = order.getFirstVehicle();
        this.elements.orderDetailsContent.innerHTML = `
            <div class="order-detail-section">
                <h3 class="text-xl font-semibold mb-4">Vehicle Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="label font-semibold">Make & Model</span>
                        <span class="value">${vehicle.make} ${vehicle.model}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label font-semibold">Color</span>
                        <span class="value">${vehicle.color}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label font-semibold">Price</span>
                        <span class="value">${formatCurrency(vehicle.price)}</span>
                    </div>
                </div>
            </div>

            ${this.renderUpgrades(vehicle.upgrades)}
            ${this.renderInsurancePlans(vehicle.insurancePlans)}
            
            <div class="order-detail-section">
                <h3 class="text-xl font-semibold mb-4">Order Summary</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="label">Subtotal</span>
                        <span class="value">${formatCurrency(vehicle.price)}</span>
                    </div>
                    ${order.discount ? `
                        <div class="summary-item discount">
                            <span class="label">Discount</span>
                            <span class="value">-${formatCurrency(order.discount)}</span>
                        </div>
                    ` : ''}
                    ${order.licensingFee ? `
                        <div class="summary-item">
                            <span class="label">Licensing Fee</span>
                            <span class="value">${formatCurrency(order.licensingFee)}</span>
                        </div>
                    ` : ''}
                    <div class="summary-item total">
                        <span class="label">Total</span>
                        <span class="value">${formatCurrency(order.getTotalPrice())}</span>
                    </div>
                </div>
            </div>

            <div class="order-detail-section">
                <h3>Delivery Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="label">Delivery Address</span>
                        <span class="value">${order.getFormattedAddress()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Estimated Delivery</span>
                        <span class="value">${formatDate(new Date(order.date.getTime() + 30 * 24 * 60 * 60 * 1000))}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderUpgrades(upgrades) {
        if (!upgrades || upgrades.length === 0) return '';

        return `
            <div class="order-detail-section">
                <h3>Selected Upgrades</h3>
                <ul class="upgrade-list">
                    ${upgrades.map(upgrade => `
                        <li>${upgrade}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    renderInsurancePlans(plans) {
        if (!plans || plans.length === 0) return '';

        return `
            <div class="order-detail-section">
                <h3>Insurance Plans</h3>
                <div class="insurance-grid">
                    ${plans.map(plan => `
                        <div class="insurance-item">
                            <span class="plan-name">${plan.planName}</span>
                            <span class="plan-premium">${formatCurrency(plan.annualPremium)}/year</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

export function formatCurrency(amount, currency = 'HKD') {
    return new Intl.NumberFormat('en-HK', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

export function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    return new Date(date).toLocaleString('en-US', { ...defaultOptions, ...options });
}

export function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

export function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}