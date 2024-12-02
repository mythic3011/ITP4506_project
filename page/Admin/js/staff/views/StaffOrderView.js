import { formatDate, formatCurrency } from '../../utils/formatters.js';

export class StaffOrderView {
    constructor(elements) {
        this.elements = elements;
        this.orderStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
        this.licensingStatuses = ['pending', 'submitted', 'approved', 'rejected'];
    }

    createStatusDropdown(currentStatus, statuses, id) {
        return `
            <select id="${id}" class="status-dropdown px-3 py-2 border rounded-md">
                ${statuses.map(status => `
                    <option value="${status}" ${status === currentStatus ? 'selected' : ''}>
                        ${status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                `).join('')}
            </select>
        `;
    }

    renderOrders(orders) {
        if (!Array.isArray(orders) || !this.elements.ordersTableBody) {
            console.error('Invalid orders data or missing table body element');
            return;
        }

        this.elements.ordersTableBody.innerHTML = orders.map(order => this.createOrderRow(order)).join('');
    }

    createOrderRow(order) {
        try {
            const vehicle = order.getFirstVehicle();
            return `
                <tr data-order-date="${order.date}" class="border-b hover:bg-gray-50">
                    <td class="order-id p-4">${order.id}</td>
                    <td class="customer-name p-4">${order.customer.name}</td>
                    <td class="p-4">${vehicle.make} ${vehicle.model}</td>
                    <td class="p-4">${formatCurrency(order.getTotalPrice())}</td>
                    <td class="p-4">
                        ${this.createStatusDropdown(order.status, this.orderStatuses, `orderStatus-${order.id}`)}
                    </td>
                    <td class="p-4">${formatDate(order.date)}</td>
                    <td class="p-4 space-x-2">
                        <button class="primary-button view-details-btn" data-order-id="${order.id}">
                            View Details
                        </button>
                    </td>
                </tr>
            `;
        } catch (error) {
            console.error('Error rendering order row:', error);
            return '';
        }
    }

    renderOrderDetails(order) {
        if (!order || !this.elements.orderDetailsContent) return;

        const vehicle = order.getFirstVehicle();
        this.elements.orderDetailsContent.innerHTML = `
            <div class="space-y-6">
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-4">Order Information</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-gray-600">Order ID:</span>
                            <span class="font-medium">${order.id}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Date:</span>
                            <span class="font-medium">${formatDate(order.date)}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Status:</span>
                            <span class="font-medium">${order.status}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-4">Vehicle Information</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-gray-600">Make & Model:</span>
                            <span class="font-medium">${vehicle.make} ${vehicle.model}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Color:</span>
                            <span class="font-medium">${vehicle.color}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Price:</span>
                            <span class="font-medium">${formatCurrency(vehicle.price)}</span>
                        </div>
                    </div>
                    ${this.renderUpgrades(vehicle.upgrades)}
                    ${this.renderInsurancePlans(vehicle.insurancePlans)}
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-4">Customer Information</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-gray-600">Name:</span>
                            <span class="font-medium">${order.customer.name}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Email:</span>
                            <span class="font-medium">${order.customer.email}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Phone:</span>
                            <span class="font-medium">${order.customer.phone}</span>
                        </div>
                        <div>
                            <span class="text-gray-600">Address:</span>
                            <span class="font-medium">${order.getFormattedAddress()}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-4">Payment Summary</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Subtotal:</span>
                            <span class="font-medium">${formatCurrency(vehicle.price)}</span>
                        </div>
                        ${order.discount ? `
                            <div class="flex justify-between text-green-600">
                                <span>Discount:</span>
                                <span>-${formatCurrency(order.discount)}</span>
                            </div>
                        ` : ''}
                        ${order.licensingFee ? `
                            <div class="flex justify-between">
                                <span>Licensing Fee:</span>
                                <span>${formatCurrency(order.licensingFee)}</span>
                            </div>
                        ` : ''}
                        <div class="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total:</span>
                            <span>${formatCurrency(order.getTotalPrice())}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderUpgrades(upgrades) {
        if (!upgrades || upgrades.length === 0) return '';

        return `
            <div class="mt-4">
                <h4 class="font-medium text-gray-700 mb-2">Selected Upgrades</h4>
                <ul class="list-disc list-inside space-y-1">
                    ${upgrades.map(upgrade => `
                        <li class="text-gray-600">${upgrade}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    renderInsurancePlans(plans) {
        if (!plans || plans.length === 0) return '';

        return `
            <div class="mt-4">
                <h4 class="font-medium text-gray-700 mb-2">Insurance Plans</h4>
                <div class="space-y-2">
                    ${plans.map(plan => `
                        <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span class="text-gray-700">${plan.planName}</span>
                            <span class="font-medium">${formatCurrency(plan.annualPremium)}/year</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderLicensingStatus(data) {
        if (!data || !this.elements.licensingStatus) return;

        this.elements.licensingStatus.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow space-y-4">
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Current Status:</span>
                    ${this.createStatusDropdown(data.status, this.licensingStatuses, `licensingStatus-${data.orderId}`)}
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Licensing Fee:</span>
                    <span class="font-medium">${formatCurrency(data.fee)}</span>
                </div>
            </div>
        `;

        const licensingDropdown = document.getElementById(`licensingStatus-${data.orderId}`);
        if (licensingDropdown) {
            licensingDropdown.addEventListener('change', (e) => {
                const newStatus = e.target.value;
                const event = new CustomEvent('licensingStatusChange', {
                    detail: { orderId: data.orderId, status: newStatus }
                });
                document.dispatchEvent(event);
            });
        }

        if (this.elements.documentList) {
            this.elements.documentList.innerHTML = data.documents.length ? `
                <div class="bg-white p-6 rounded-lg shadow mt-4">
                    <h4 class="font-medium text-gray-700 mb-4">Uploaded Documents</h4>
                    <ul class="space-y-2">
                        ${data.documents.map(doc => `
                            <li class="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span class="text-gray-700">${doc.fileName}</span>
                                <span class="text-gray-500 text-sm">${formatDate(doc.uploadDate)}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : '<p class="text-gray-500 mt-4">No documents uploaded yet.</p>';
        }
    }

    renderTradeInDetails(data) {
        if (!data || !this.elements.tradeinDetails) return;

        if (!data.vehicle) {
            this.elements.tradeinDetails.innerHTML = '<p class="text-gray-500">No trade-in vehicle for this order.</p>';
            return;
        }

        this.elements.tradeinDetails.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <h4 class="font-medium text-gray-700 mb-4">Trade-in Vehicle Details</h4>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="text-gray-600">Make & Model:</span>
                        <span class="font-medium">${data.vehicle.make} ${data.vehicle.model}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">Year:</span>
                        <span class="font-medium">${data.vehicle.year}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">Mileage:</span>
                        <span class="font-medium">${data.vehicle.mileage} miles</span>
                    </div>
                    <div>
                        <span class="text-gray-600">Condition:</span>
                        <span class="font-medium">${data.vehicle.condition}</span>
                    </div>
                    <div class="col-span-2">
                        <span class="text-gray-600">Trade-in Value:</span>
                        <span class="font-medium text-green-600">${formatCurrency(data.value)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderPaymentSummary(data) {
        if (!data || !this.elements.paymentSummary) return;

        this.elements.paymentSummary.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow space-y-6">
                <div class="grid grid-cols-3 gap-4">
                    <div class="text-center p-4 bg-gray-50 rounded">
                        <span class="block text-gray-600">Total Amount</span>
                        <span class="block text-xl font-bold mt-1">${formatCurrency(data.total)}</span>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded">
                        <span class="block text-gray-600">Amount Paid</span>
                        <span class="block text-xl font-bold mt-1 text-green-600">
                            ${formatCurrency(data.total - data.remaining)}
                        </span>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded">
                        <span class="block text-gray-600">Remaining Balance</span>
                        <span class="block text-xl font-bold mt-1 text-red-600">
                            ${formatCurrency(data.remaining)}
                        </span>
                    </div>
                </div>

                <div class="mt-6">
                    <h4 class="font-medium text-gray-700 mb-4">Payment History</h4>
                    ${data.payments.length ? `
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    ${data.payments.map(payment => `
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ${formatDate(payment.date)}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ${formatCurrency(payment.amount)}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ${payment.method}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ${payment.reference || '-'}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : '<p class="text-gray-500">No payments recorded yet.</p>'}
                </div>
            </div>
        `;
    }
}