import { DiscountService } from '../services/DiscountService.js';
import { validateDiscountCode, validateAmount } from '../utils/validation.js';
import { showMessage, clearMessage } from '../ui.js';

class DiscountManagementUI {
    constructor() {
        this.discountService = new DiscountService();
        this.initializeElements();
        this.attachEventListeners();
        this.loadDiscounts();
    }

    initializeElements() {
        // Buttons
        this.createDiscountBtn = document.getElementById('createDiscountBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.logoutBtn = document.getElementById('logoutBtn');

        // Modal
        this.modal = document.getElementById('discountModal');
        this.discountForm = document.getElementById('discountForm');
        this.modalTitle = document.getElementById('modalTitle');

        // Filters
        this.searchInput = document.getElementById('searchDiscount');
        this.statusFilter = document.getElementById('statusFilter');
        this.typeFilter = document.getElementById('typeFilter');

        // Table
        this.tableBody = document.getElementById('discountTableBody');

        // Message
        this.messageDiv = document.getElementById('message');
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
    }

    async loadDiscounts() {
        try {
            await this.discountService.loadDiscounts();
            this.renderDiscountTable();
        } catch (error) {
            showMessage(this.messageDiv, error.message, 'error');
        }
    }

    renderDiscountTable() {
        this.tableBody.innerHTML = '';
        
        this.discountService.discounts.forEach((discount, code) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${discount.code}</td>
                <td>${this.formatDiscountType(discount.discountType)}</td>
                <td>${this.formatValue(discount.value, discount.discountType, discount.currency)}</td>
                <td><span class="status-badge status-${discount.status.toLowerCase()}">${discount.status}</span></td>
                <td>${this.formatDate(discount.expirationDate)}</td>
                <td>${discount.usageCount}${discount.maxUses ? ` / ${discount.maxUses}` : ''}</td>
                <td>
                    <button class="edit-btn" data-code="${code}">Edit</button>
                    <button class="delete-btn" data-code="${code}">Delete</button>
                </td>
            `;

            // Add event listeners to buttons
            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');

            editBtn.addEventListener('click', () => this.editDiscount(code));
            deleteBtn.addEventListener('click', () => this.deleteDiscount(code));

            this.tableBody.appendChild(row);
        });
    }

    formatDiscountType(type) {
        return type === 'percentage' ? 'Percentage' : 'Fixed Amount';
    }

    formatValue(value, type, currency) {
        return type === 'percentage' ? `${value}%` : `${currency} ${value}`;
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
            document.getElementById('discountCode').value = discount.code;
            document.getElementById('discountType').value = discount.discountType;
            document.getElementById('discountValue').value = discount.value;
            document.getElementById('minimumPurchase').value = discount.minimumPurchase;
            document.getElementById('maxUses').value = discount.maxUses || '';
            document.getElementById('description').value = discount.description;
            
            if (discount.expirationDate) {
                const date = new Date(discount.expirationDate);
                document.getElementById('expirationDate').value = date.toISOString().split('T')[0];
            } else {
                document.getElementById('expirationDate').value = '';
            }
        } else {
            // Reset form for new discount
            this.discountForm.reset();
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.discountForm.reset();
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = {
                code: document.getElementById('discountCode').value,
                discountType: document.getElementById('discountType').value,
                value: parseFloat(document.getElementById('discountValue').value),
                minimumPurchase: parseFloat(document.getElementById('minimumPurchase').value),
                expirationDate: document.getElementById('expirationDate').value || null,
                maxUses: document.getElementById('maxUses').value ? parseInt(document.getElementById('maxUses').value) : null,
                description: document.getElementById('description').value,
                currency: 'USD', // Default currency
                status: 'active',
                usageCount: 0
            };

            // Validate form data
            validateDiscountCode(formData.code);
            validateAmount(formData.value);
            validateAmount(formData.minimumPurchase);

            // Save discount
            // In a real application, this would make an API call
            this.discountService.discounts.set(formData.code, formData);
            
            showMessage(this.messageDiv, 'Discount saved successfully!', 'success');
            this.closeModal();
            this.renderDiscountTable();
        } catch (error) {
            showMessage(this.messageDiv, error.message, 'error');
        }
    }

    editDiscount(code) {
        const discount = this.discountService.discounts.get(code);
        if (discount) {
            this.openModal(discount);
        }
    }

    async deleteDiscount(code) {
        if (confirm('Are you sure you want to delete this discount code?')) {
            try {
                // In a real application, this would make an API call
                this.discountService.discounts.delete(code);
                showMessage(this.messageDiv, 'Discount deleted successfully!', 'success');
                this.renderDiscountTable();
            } catch (error) {
                showMessage(this.messageDiv, error.message, 'error');
            }
        }
    }

    filterDiscounts() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const statusFilter = this.statusFilter.value;
        const typeFilter = this.typeFilter.value;

        const filteredDiscounts = Array.from(this.discountService.discounts.values()).filter(discount => {
            const matchesSearch = discount.code.toLowerCase().includes(searchTerm) ||
                                discount.description.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || discount.status.toLowerCase() === statusFilter;
            const matchesType = !typeFilter || discount.discountType === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });

        this.renderFilteredDiscounts(filteredDiscounts);
    }

    renderFilteredDiscounts(filteredDiscounts) {
        this.tableBody.innerHTML = '';
        filteredDiscounts.forEach(discount => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${discount.code}</td>
                <td>${this.formatDiscountType(discount.discountType)}</td>
                <td>${this.formatValue(discount.value, discount.discountType, discount.currency)}</td>
                <td><span class="status-badge status-${discount.status.toLowerCase()}">${discount.status}</span></td>
                <td>${this.formatDate(discount.expirationDate)}</td>
                <td>${discount.usageCount}${discount.maxUses ? ` / ${discount.maxUses}` : ''}</td>
                <td>
                    <button class="edit-btn" data-code="${discount.code}">Edit</button>
                    <button class="delete-btn" data-code="${discount.code}">Delete</button>
                </td>
            `;

            const editBtn = row.querySelector('.edit-btn');
            const deleteBtn = row.querySelector('.delete-btn');

            editBtn.addEventListener('click', () => this.editDiscount(discount.code));
            deleteBtn.addEventListener('click', () => this.deleteDiscount(discount.code));

            this.tableBody.appendChild(row);
        });
    }

    handleLogout() {
        window.location.href = '../../index.html';
    }
}

// Initialize the UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DiscountManagementUI();
});