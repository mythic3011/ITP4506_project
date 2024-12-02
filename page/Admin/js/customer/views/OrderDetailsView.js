import { formatDate, formatCurrency } from '../../utils/formatters.js';

export class OrderDetailsView {
    constructor(elements) {
        this.elements = elements;
    }

    renderOrderInfo(order) {
        this.elements.orderId.textContent = order.id;
        this.elements.orderDate.textContent = formatDate(order.date);
        this.elements.orderStatus.textContent = order.status;
        this.elements.orderStatus.className = `value status-badge status-${order.status}`;
    }

    renderVehicleDetails(vehicle) {
        this.elements.vehicleDetails.innerHTML = `
            <img src="${vehicle.images[0].url}" alt="${vehicle.make} ${vehicle.model}" class="vehicle-image">
            <h3>${vehicle.make} ${vehicle.model}</h3>
            <div class="vehicle-specs">
                <div class="spec-item">
                    <span class="label">Color</span>
                    <span class="value">${vehicle.color}</span>
                </div>
                <div class="spec-item">
                    <span class="label">Price</span>
                    <span class="value">${formatCurrency(vehicle.price)}</span>
                </div>
            </div>
            ${this.renderUpgrades(vehicle.upgrades)}
            ${this.renderInsurancePlans(vehicle.insurancePlans)}
            ${this.renderPricing(vehicle)}
        `;
    }

    renderUpgrades(upgrades) {
        if (!upgrades || upgrades.length === 0) return '';

        return `
            <div class="upgrades-section">
                <h4>Selected Upgrades</h4>
                <ul class="upgrades-list">
                    ${upgrades.map(upgrade => `
                        <li><span>${upgrade}</span></li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    renderInsurancePlans(plans) {
        if (!plans || plans.length === 0) return '';

        return `
            <div class="insurance-section">
                <h4>Insurance Plans</h4>
                <ul class="insurance-list">
                    ${plans.map(plan => `
                        <li>
                            <span>${plan.planName}</span>
                            <span>${formatCurrency(plan.annualPremium)}/year</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    renderPricing(vehicle) {
        return `
            <div class="pricing-section">
                <div class="price-item">
                    <span>Base Price</span>
                    <span>${formatCurrency(vehicle.price)}</span>
                </div>
                <div class="price-item total">
                    <span>Total Price</span>
                    <span>${formatCurrency(vehicle.totalPrice)}</span>
                </div>
            </div>
        `;
    }

    renderCustomerInfo(customer) {
        this.elements.customerInfo.innerHTML = `
            <div class="info-item">
                <span class="label">Name</span>
                <span class="value">${customer.name}</span>
            </div>
            <div class="info-item">
                <span class="label">Email</span>
                <span class="value">${customer.email}</span>
            </div>
            <div class="info-item">
                <span class="label">Phone</span>
                <span class="value">${customer.phone}</span>
            </div>
        `;
    }

    renderPaymentInfo(financing) {
        const paymentMethods = {
            cash: 'Cash',
            credit_card: 'Credit Card',
            bank_transfer: 'Bank Transfer'
        };

        this.elements.paymentInfo.innerHTML = `
            <div class="info-item">
                <span class="label">Financing Method</span>
                <span class="value">${financing.method.replace(/_/g, ' ').toUpperCase()}</span>
            </div>
            <div class="info-item">
                <span class="label">Payment Method</span>
                <span class="value">${paymentMethods[financing.paymentMethod] || financing.paymentMethod}</span>
            </div>
        `;
    }

    renderDeliveryInfo(address, orderDate) {
        const estimatedDelivery = new Date(orderDate);
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 30);

        this.elements.deliveryInfo.innerHTML = `
            <div class="info-item">
                <span class="label">Delivery Address</span>
                <span class="value">${address}</span>
            </div>
            <div class="info-item">
                <span class="label">Estimated Delivery</span>
                <span class="value">${formatDate(estimatedDelivery)}</span>
            </div>
        `;
    }
}