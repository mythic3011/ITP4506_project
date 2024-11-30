// ui.js
export class UIManager {
    constructor({
        discountManager,
        renderOrderSummary,
        showNotification
    }) {
        this.discountManager = discountManager;
        this.renderOrderSummary = renderOrderSummary;
        this.showNotification = showNotification;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.createDiscountBtn = document.getElementById('createDiscountBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.logoutBtn = document.getElementById('logoutBtn');

        this.modal = document.getElementById('discountModal');
        this.discountForm = document.getElementById('discountForm');
        this.modalTitle = document.getElementById('modalTitle');

        this.searchInput = document.getElementById('searchDiscount');
        this.statusFilter = document.getElementById('statusFilter');
        this.typeFilter = document.getElementById('typeFilter');

        this.tableBody = document.getElementById('discountTableBody');

        this.messageDiv = document.getElementById('message');

        // Discount application elements
        this.applyDiscountBtn = document.getElementById('applyDiscount');
        this.removeDiscountBtn = document.getElementById('removeDiscount');
        this.discountCodeInput = document.getElementById('discountCodeInput');

        // Additional UI elements can be initialized here
    }

    attachEventListeners() {
        // Modal events
        this.createDiscountBtn.addEventListener('click', () => this.openModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.discountForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Filter events
        this.searchInput.addEventListener('input', () => this.filterDiscounts());
        this.statusFilter.addEventListener('change', () => this.filterDiscounts());
        this.typeFilter.addEventListener('change', () => this.filterDiscounts());

        // Logout
        this.logoutBtn.addEventListener('click', () => this.handleLogout());

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Discount application events
        this.applyDiscountBtn.addEventListener('click', () => this.applyDiscount());
        this.removeDiscountBtn.addEventListener('click', () => this.removeDiscount());
    }

    showMessage(text, type) {
        this.messageDiv.textContent = text;
        this.messageDiv.className = 'message';
        this.messageDiv.classList.add(`${type}`);
        this.messageDiv.style.display = 'block';
        setTimeout(() => {
            this.clearMessage();
        }, 3000);
    }

    clearMessage() {
        this.messageDiv.style.display = 'none';
        this.messageDiv.className = 'message';
        this.messageDiv.textContent = '';
    }

    renderDiscountTable(discounts) {
        this.tableBody.innerHTML = '';

        discounts.forEach(discount => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${discount.code}</td>
                <td>${this.formatDiscountType(discount.discountType)}</td>
                <td>${this.formatValue(discount.value, discount.discountType, discount.currency)}</td>
                <td><span class="status-badge status-${discount.status.toLowerCase()}">${discount.status}</span></td>
                <td>${this.formatDate(discount.expirationDate)}</td>
                <td>${discount.usageCount}${discount.maxUses !== null ? ` / ${discount.maxUses}` : ''}</td>
                <td>
                    <button class="edit-btn" data-code="${discount.code}">Edit</button>
                    <button class="delete-btn" data-code="${discount.code}">Delete</button>
                </td>
            `;

            // Add event listeners to buttons
            row.querySelector('.edit-btn').addEventListener('click', () => this.editDiscount(discount));
            row.querySelector('.delete-btn').addEventListener('click', () => this.deleteDiscount(discount.code));

            this.tableBody.appendChild(row);
        });
    }

    formatDiscountType(type) {
        return type === 'percentage' ? 'Percentage' : 'Fixed Amount';
    }

    formatValue(value, type, currency) {
        return type === 'percentage' ? `${value}%` : `${currency} ${value.toFixed(2)}`;
    }

    formatDate(date) {
        if (!date) return 'No expiration';
        return new Date(date).toLocaleDateString();
    }

    openModal(discount = null) {
        this.modalTitle.textContent = discount ? 'Edit Discount' : 'Create New Discount';
        this.modal.style.display = 'block';

        if (discount) {
            // Populate form with discount data
            this.discountForm.dataset.editing = discount.code;
            document.getElementById('discountCode').value = discount.code;
            document.getElementById('discountType').value = discount.discountType;
            document.getElementById('discountValue').value = discount.value;
            document.getElementById('minimumPurchase').value = discount.minimumPurchase;
            document.getElementById('maxUses').value = discount.maxUses !== null ? discount.maxUses : '';
            document.getElementById('description').value = discount.description;

            document.getElementById('expirationDate').value = discount.expirationDate ? discount.expirationDate.toISOString().split('T')[0] : '';
        } else {
            // Reset form for new discount
            this.discountForm.reset();
            delete this.discountForm.dataset.editing;
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.discountForm.reset();
        delete this.discountForm.dataset.editing;
    }

    async handleFormSubmit(event) {
        event.preventDefault();

        try {
            const formData = this.getFormData();
            this.validateFormData(formData);

            if (this.discountForm.dataset.editing) {
                // Edit existing discount
                await this.discountManager.updateDiscount(formData.code, formData);
                this.showMessage('Discount updated successfully!', 'success');
            } else {
                // Create new discount
                await this.discountManager.createDiscount(formData);
                this.showMessage('Discount created successfully!', 'success');
            }

            this.closeModal();
            this.renderDiscountTable(Array.from(this.discountManager.discounts.values()));
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    getFormData() {
        return {
            code: document.getElementById('discountCode').value,
            discountType: document.getElementById('discountType').value,
            value: parseFloat(document.getElementById('discountValue').value),
            minimumPurchase: parseFloat(document.getElementById('minimumPurchase').value),
            expirationDate: document.getElementById('expirationDate').value || null,
            maxUses: document.getElementById('maxUses').value ? parseInt(document.getElementById('maxUses').value) : null,
            description: document.getElementById('description').value,
            currency: 'HKD',
            status: 'active',
            usageCount: 0
        };
    }

    validateFormData(data) {
        if (!data.code || typeof data.code !== 'string') {
            throw new Error('Invalid discount code format');
        }

        // Remove whitespace and convert to uppercase
        data.code = data.code.trim().toUpperCase();

        // Check if code matches pattern (letters, numbers, and hyphens only)
        if (!/^[A-Z0-9-]+$/.test(data.code)) {
            throw new Error('Discount code can only contain letters, numbers, and hyphens');
        }

        if (isNaN(data.value) || data.value <= 0) {
            throw new Error('Invalid discount value');
        }

        if (isNaN(data.minimumPurchase) || data.minimumPurchase < 0) {
            throw new Error('Invalid minimum purchase amount');
        }

        if (data.maxUses !== null && (isNaN(data.maxUses) || data.maxUses <= 0)) {
            throw new Error('Invalid maximum uses');
        }

        // Additional validations can be added here
    }

    editDiscount(discount) {
        this.openModal(discount);
    }

    async deleteDiscount(code) {
        if (confirm('Are you sure you want to delete this discount code?')) {
            try {
                await this.discountManager.deleteDiscount(code);
                this.showMessage('Discount deleted successfully!', 'success');
                this.renderDiscountTable(Array.from(this.discountManager.discounts.values()));
            } catch (error) {
                this.showMessage('Failed to delete discount.', 'error');
            }
        }
    }

    filterDiscounts() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const statusFilter = this.statusFilter.value;
        const typeFilter = this.typeFilter.value;

        const filteredDiscounts = Array.from(this.discountManager.discounts.values()).filter(discount => {
            const matchesSearch = discount.code.toLowerCase().includes(searchTerm) ||
                (discount.description && discount.description.toLowerCase().includes(searchTerm));
            const matchesStatus = !statusFilter || discount.status.toLowerCase() === statusFilter;
            const matchesType = !typeFilter || discount.discountType === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });

        this.renderDiscountTable(filteredDiscounts);
    }

    applyDiscount() {
        // This method will be implemented in the main checkout script
        // It can emit an event or call a callback
    }

    removeDiscount() {
        // This method will be implemented in the main checkout script
        // It can emit an event or call a callback
    }

    handleLogout() {
        window.location.href = '../../index.html';
    }

    renderOrderSummary(state = null) {
        const orderSummary = $('#orderSummary');
        const subtotalAmount = $('#subtotalAmount');
        const totalAmount = $('#totalAmount');
        const depositAmount = $('#DepositAmount');
        const estimatedDelivery = $('#EstimatedDelivery');

        // Calculate total price and populate item list
        let totalPrice = 0;

        // Create a table for the order summary
        let summaryHTML = `
                <tr>
                    <td class="px-6 py-4">Make</td>
                    <td class="px-6 py-4">Model</td>
                    <td class="px-6 py-4">Color</td>
                    <td class="px-6 py-4">Upgrades</td>
                    <td class="px-6 py-4">Insurance Plans</td>
                    <td class="px-6 py-4">Price</td>
                </tr>`;

        wishlist.forEach(item => {
            totalPrice += item.price;

            const upgradesList = item.upgrades.length > 0 ? item.upgrades.join(', ') : 'None';
            const insuranceList = item.insurancePlans.length > 0 ? item.insurancePlans.map(plan => `${plan.planName} ($${plan.annualPremium.toLocaleString()} annual premium)`).join('<br>') : 'None';

            summaryHTML += `
                    <tr>
                        <td class="px-6 py-4">${item.make}</td>
                        <td class="px-6 py-4">${item.model}</td>
                        <td class="px-6 py-4">${item.color}</td>
                        <td class="px-6 py-4">${upgradesList}</td>
                        <td class="px-6 py-4">${insuranceList}</td>
                        <td class="px-6 py-4">$${item.price.toLocaleString()}</td>
                    </tr>`;
        });

        summaryHTML += `
                    </tbody>
                </table>`;

        // Calculate deposit amount (1% of total price)
        const depositAmountValue = totalPrice * 0.01;

        // Set estimated delivery date (today + 14 days)
        const estimatedDeliveryDate = new Date();
        estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 14);

        let currentState;
        if (state) {
            currentState = state;
        } else {
            currentState = {
                subtotal: totalPrice,
                deposit: depositAmountValue,
                total: totalPrice,
                estimatedDelivery: estimatedDeliveryDate.toLocaleDateString(),
                discountPercentage: 0,
                discountAmount: 0,
                licensingFee: 0,
                tradeInValue: 0
            };
        }

        // If state is provided, use its values
        if (state) {
            currentState = state;
        }

        // Update amounts in the summary
        estimatedDelivery.text(`Estimated Delivery Date: ${currentState.estimatedDelivery}`);

        subtotalAmount.text(`Subtotal: $${currentState.subtotal.toLocaleString()}`);
        totalAmount.text(`Total Amount Due: $${currentState.total.toLocaleString()}`);
        depositAmount.text(`Deposit Amount (1%): $${currentState.deposit.toLocaleString()}`);

        // Show the order summary section
        orderSummary.html(summaryHTML).show();

        // Store the order summary in local storage for future reference
        localStorage.setItem('LMC_OrderSummary', JSON.stringify(currentState));
    }

    showNotification(message, type) {
        const notificationContainer = $('#notification-container');
        notificationContainer.empty();
        const notification = $('<div>').addClass(`notification ${type}`).text(message);
        notificationContainer.append(notification);
        setTimeout(() => {
            notification.fadeOut(400, function () {
                $(this).remove();
            });
        }, 3000);
    }

    // Calculate and display monthly payment based on selected financing option
    calculateMonthlyPayment() {
        const selectedOption = $('#financingMethod option:selected');

        if (selectedOption.val() === 'none') {
            $('#monthlyPaymentDisplay').addClass('hidden');
            return;
        }
        const principal = parseFloat($('#totalAmount').text().replace(/[^0-9.-]+/g, "")) - parseFloat($('#DepositAmount').text().replace(/[^0-9.-]+/g, "")); // Total minus deposit
        const interestRate = parseFloat(selectedOption.data('interest-rate')); // Get interest rate from selected option
        const termMonths = parseInt(selectedOption.data('term-months')); // Get term in months from selected option
        if (!principal || principal <= 0) {
            $('#monthlyPaymentDisplay').addClass('hidden');
            return;
        }

        // Monthly interest rate
        const r = interestRate / 12;

        // Monthly payment formula
        const M = principal * r * Math.pow(1 + r, termMonths) / (Math.pow(1 + r, termMonths) - 1);

        $('#monthlyPayment').text(M.toFixed(2)); // Display formatted monthly payment
        $('#monthlyPaymentDisplay').removeClass('hidden'); // Show the payment display
    }

    ApplyDiscount() {
        const discountCode = $('#DiscountCode').val().trim();
        if (discountCode) {
            const discountPercentage = parseFloat(discountCode);
            if (isNaN(discountPercentage) || discountPercentage <= 0 || discountPercentage > 100) {
                showNotification('Invalid discount code.', 'error');
                return;
            }

            const currentSummary = getCurrentDiscount();
            currentSummary.discountPercentage = discountPercentage;
            currentSummary.discountAmount = (currentSummary.total * (discountPercentage / 100)).toFixed(2);
            currentSummary.total = (currentSummary.total - currentSummary.discountAmount).toFixed(2);

            // Update display
            $('#DiscountCodeAmount').text(`-$${currentSummary.discountAmount}`).removeClass('hidden');
            $('#DiscountCodePercentage').text(`${currentSummary.discountPercentage}%`).removeClass('hidden');
            $('#discountMessage').text(`Discount of ${discountPercentage}% applied.`).removeClass('hidden');

            // Update order summary
            renderOrderSummary(currentSummary);
            showNotification('Discount applied successfully.', 'success');

            // Show Remove Discount button
            $('#removeDiscount').removeClass('hidden');
        } else {
            showNotification('Please enter a discount code.', 'error');
        }
    }
}