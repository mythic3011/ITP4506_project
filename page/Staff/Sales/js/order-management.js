import { StaffOrderService } from './services/StaffOrderService.js';
import { StaffOrderModel } from './models/StaffOrderModel.js';
import { StaffOrderView } from './views/StaffOrderView.js';
import { TabManager } from './TabManager.js';
import { showMessage } from './ui.js';
import { InvoiceService } from './services/InvoiceService.js';
import { TradeInCalculatorService } from './services/TradeInCalculatorService.js';
import { LicensingService } from './services/LicensingService.js';
import { PaymentService } from './services/PaymentService.js';

class OrderManagementUI {
    constructor() {
        this.orderService = new StaffOrderService();
        this.invoiceService = new InvoiceService();
        this.tradeInService = new TradeInCalculatorService();
        this.licensingService = new LicensingService();
        this.paymentService = new PaymentService();

        this.initializeElements();
        this.view = new StaffOrderView({
            ordersTableBody: document.getElementById('ordersTableBody'),
            orderDetailsContent: document.getElementById('orderDetailsContent'),
            licensingStatus: document.getElementById('licensingStatus'),
            documentList: document.getElementById('documentList'),
            tradeinDetails: document.getElementById('tradeinDetails'),
            paymentSummary: document.getElementById('paymentSummary'),
            valueCalculatorForm: document.getElementById('valueCalculatorForm')
        });

        this.initializeTabs();
        this.attachEventListeners();
        this.loadOrders();
        this.attachStatusChangeListeners();
    }

    initializeElements() {
        // Filters
        this.searchInput = document.getElementById('searchOrder');
        this.statusFilter = document.getElementById('statusFilter');
        this.dateFilter = document.getElementById('dateFilter');

        // Buttons
        this.exportBtn = document.getElementById('exportOrders');
        this.refreshBtn = document.getElementById('refreshOrders');
        this.generateInvoiceBtn = document.getElementById('generateInvoice');
        this.recordPaymentBtn = document.getElementById('recordPayment');
        this.submitPaymentBtn = document.getElementById('submitPayment');
        this.cancelPaymentBtn = document.getElementById('cancelPayment');
        this.cancelChangesBtn = document.getElementById('cancelChanges');
        this.saveChangesBtn = document.getElementById('saveChanges');

        // Modals
        this.orderDetailsModal = document.getElementById('orderDetailsModal');
        this.recordPaymentModal = document.getElementById('recordPaymentModal');

        // Forms
        this.paymentForm = document.getElementById('paymentForm');
        this.valueCalculatorForm = document.getElementById('valueCalculatorForm');
        const closeButtons = document.querySelectorAll('.close-button');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.closeModal(button.closest('.modal')));
        });

    }

    initializeTabs() {
        const tabContainer = document.querySelector('.order-tabs');
        if (tabContainer) {
            this.tabManager = new TabManager(tabContainer);

            tabContainer.addEventListener('tabChange', (e) => {
                this.handleTabChange(e.detail.tabId);
            });
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            this.closeModal(modal);
        });
    }

    handleTabChange(tabId) {
        const orderId = this.orderDetailsModal.dataset.orderId;
        if (!orderId) return;

        switch (tabId) {
            case 'licensing':
                this.loadLicensingData(orderId);
                break;
            case 'tradein':
                this.loadTradeInData(orderId);
                break;
            case 'payment':
                this.loadPaymentData(orderId);
                break;
        }
    }

    attachEventListeners() {
        // Filter events
        this.searchInput.addEventListener('input', () => this.filterOrders());
        this.statusFilter.addEventListener('change', () => this.filterOrders());
        this.dateFilter.addEventListener('change', () => this.filterOrders());

        // Button events
        this.exportBtn.addEventListener('click', () => this.exportOrders());
        this.refreshBtn.addEventListener('click', () => this.loadOrders());
        this.generateInvoiceBtn.addEventListener('click', () => this.generateInvoice());
        this.recordPaymentBtn.addEventListener('click', () => this.showRecordPayment());

        // Payment Modal Events
        this.submitPaymentBtn.addEventListener('click', () => this.handlePaymentSubmit());
        this.cancelPaymentBtn.addEventListener('click', () => this.closeAllModals());

        // Order Details Modal Events
        this.cancelChangesBtn.addEventListener('click', () => this.handleCancelChanges());
        this.saveChangesBtn.addEventListener('click', () => this.handleSaveChanges());

        // Modal events
        document.querySelectorAll('.close-button').forEach(button => {
            button.addEventListener('click', () => this.closeAllModals());
        });

        // Payment form
        this.paymentForm.addEventListener('submit', (e) => this.handlePaymentSubmit(e));

        // Value calculator form
        this.valueCalculatorForm.addEventListener('submit', (e) => this.handleValueCalculation(e));

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
        this.attachStatusChangeListeners();
    }

    handleCancelChanges() {
        if (confirm('Are you sure you want to discard your changes?')) {
            this.closeAllModals();
            this.loadOrders(); // Reload the orders to reset any unsaved changes
        }
    }

    async loadOrders() {
        try {
            const orders = await this.orderService.getOrders();
            const orderModels = orders.map(order => new StaffOrderModel(order));
            this.view.renderOrders(orderModels);
            this.attachOrderEventListeners();
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
        }
    }

    attachOrderEventListeners() {
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', () => this.showOrderDetails(button.dataset.orderId));
        });
    }


    async showOrderDetails(orderId) {
        try {
            const order = await this.orderService.getOrder(orderId);
            const orderModel = new StaffOrderModel(order);

            this.view.renderOrderDetails(orderModel);
            this.orderDetailsModal.classList.add('active');

            // Load data for other tabs
            this.loadLicensingData(orderId);
            this.loadTradeInData(orderId);
            this.loadPaymentData(orderId);
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
        }
    }

    async loadLicensingData(orderId) {
        try {
            const data = await this.orderService.getLicensingData(orderId);
            this.view.renderLicensingStatus(data);
        } catch (error) {
            console.error('Error loading licensing data:', error);
        }
    }

    async loadTradeInData(orderId) {
        try {
            const data = await this.orderService.getTradeInData(orderId);
            this.view.renderTradeInDetails(data);
        } catch (error) {
            console.error('Error loading trade-in data:', error);
        }
    }

    async loadPaymentData(orderId) {
        try {
            const data = await this.orderService.getPaymentData(orderId);
            this.view.renderPaymentSummary(data);
        } catch (error) {
            console.error('Error loading payment data:', error);
        }
    }

    async handleTabChange(tabId) {
        const orderId = this.orderDetailsModal.dataset.orderId;
        if (!orderId) return;

        try {
            switch (tabId) {
                case 'licensing':
                    const licensingData = await this.orderService.getLicensingData(orderId);
                    this.view.renderLicensingStatus(licensingData);
                    break;

                case 'tradein':
                    const tradeInData = await this.orderService.getTradeInData(orderId);
                    this.view.renderTradeInDetails(tradeInData);
                    this.initializeValueCalculator();
                    break;

                case 'payment':
                    const paymentData = await this.orderService.getPaymentData(orderId);
                    this.view.renderPaymentSummary(paymentData);
                    break;
            }
        } catch (error) {
            console.error(`Error loading ${tabId} data:`, error);
            showMessage(document.getElementById('message'), `Failed to load ${tabId} data`, 'error');
        }
    }

    initializeValueCalculator() {
        if (!this.valueCalculatorForm) return;

        this.valueCalculatorForm.innerHTML = `
            <div class="form-group">
                <label for="vehicleYear">Year</label>
                <input type="number" id="vehicleYear" required min="1900" max="${new Date().getFullYear()}">
            </div>
            <div class="form-group">
                <label for="vehicleMileage">Mileage</label>
                <input type="number" id="vehicleMileage" required min="0">
            </div>
            <div class="form-group">
                <label for="vehicleCondition">Condition</label>
                <select id="vehicleCondition" required>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                </select>
            </div>
            <button type="submit" class="primary-button">Calculate Value</button>
        `;
    }

    async handleValueCalculation(e) {
        e.preventDefault();

        const vehicleData = {
            year: parseInt(document.getElementById('vehicleYear').value),
            mileage: parseInt(document.getElementById('vehicleMileage').value),
            condition: document.getElementById('vehicleCondition').value
        };

        try {
            const value = this.tradeInService.calculateValue(vehicleData);
            const orderId = this.orderDetailsModal.dataset.orderId;

            await this.orderService.updateTradeInValue(orderId, {
                ...vehicleData,
                value: value
            });

            const tradeInData = await this.orderService.getTradeInData(orderId);
            this.view.renderTradeInDetails(tradeInData);

            showMessage(document.getElementById('message'), 'Trade-in value updated successfully!', 'success');
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
        }
    }

    async generateInvoice() {
        const orderId = this.orderDetailsModal.dataset.orderId;
        if (!orderId) {
            showMessage(document.getElementById('message'), 'No order selected', 'error');
            return;
        }

        try {
            const order = await this.orderService.getOrder(orderId);
            const invoice = this.invoiceService.generateInvoice(order);
            // Handle invoice generation result (e.g., download PDF)
            console.log('Generated invoice:', invoice);
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
        }
    }

    showRecordPayment(orderId) {
        this.recordPaymentModal.classList.add('active');
    }

    async handlePaymentSubmit(e) {
        e.preventDefault();

        const orderId = this.paymentForm.dataset.orderId;
        if (!orderId) {
            showMessage(document.getElementById('message'), 'No order selected', 'error');
            return;
        }

        try {
            const paymentData = {
                amount: parseFloat(document.getElementById('paymentAmount').value),
                method: document.getElementById('paymentMethod').value,
                reference: document.getElementById('paymentReference').value,
                notes: document.getElementById('paymentNotes').value
            };

            await this.paymentService.recordPayment(orderId, paymentData);
            showMessage(document.getElementById('message'), 'Payment recorded successfully!', 'success');
            this.closeAllModals();
            this.loadOrders();
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
        }
    }

    attachStatusChangeListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('status-dropdown')) {
                const orderId = e.target.dataset.orderId;
                const newStatus = e.target.value;
                this.updateOrderStatus(orderId, newStatus);
            }
        });

        document.addEventListener('licensingStatusChange', async (e) => {
            const { orderId, status } = e.detail;
            try {
                await this.orderService.updateLicensingStatus(orderId, status);
                showMessage(document.getElementById('message'), 'Licensing status updated successfully!', 'success');
                this.loadOrders();
            } catch (error) {
                showMessage(document.getElementById('message'), error.message, 'error');
            }
        });
    }


    async updateOrderStatus(orderId, newStatus) {
        try {
            await this.orderService.updateStatus(orderId, newStatus);
            showMessage(document.getElementById('message'), 'Order status updated successfully!', 'success');
            this.loadOrders();
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
        }
    }

    async handleSaveChanges() {
        const orderId = this.orderDetailsModal.dataset.orderId;
        if (!orderId) return;

        try {
            const activeTabId = this.tabManager.getActiveTabId();
            switch (activeTabId) {
                case 'licensing':
                    await this.saveLicensingChanges(orderId);
                    break;
                case 'tradein':
                    await this.saveTradeInChanges(orderId);
                    break;
                case 'payment':
                    await this.savePaymentChanges(orderId);
                    break;
            }

            showMessage(document.getElementById('message'), 'Changes saved successfully!', 'success');
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
        }
    }

    async saveLicensingChanges(orderId) {
        const newStatus = document.querySelector('[name="licensingStatus"]:checked')?.value;
        if (newStatus) {
            await this.licensingService.updateLicensingStatus(orderId, newStatus);
        }
    }

    async saveTradeInChanges(orderId) {
        // Implementation for saving trade-in changes
        const tradeInData = {
            value: parseFloat(document.getElementById('tradeInValue').value),
            status: document.getElementById('tradeInStatus').value
        };
        await this.orderService.updateTradeInValue(orderId, tradeInData);
    }

    async savePaymentChanges(orderId) {
        const paymentPlan = document.getElementById('paymentPlan').value;
        const paymentSchedule = document.getElementById('paymentSchedule').value;

        if (paymentPlan && paymentSchedule) {
            await this.paymentService.updatePaymentPlan(orderId, {
                plan: paymentPlan,
                schedule: paymentSchedule
            });
        }
    }

    filterOrders() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const statusFilter = this.statusFilter.value;
        const dateFilter = this.dateFilter.value;

        const rows = document.querySelectorAll('#ordersTableBody tr');
        rows.forEach(row => {
            const orderId = row.querySelector('.order-id').textContent.toLowerCase();
            const customerName = row.querySelector('.customer-name').textContent.toLowerCase();
            const status = row.querySelector('.status-dropdown').value;
            const date = new Date(row.dataset.orderDate);

            const matchesSearch = orderId.includes(searchTerm) || customerName.includes(searchTerm);
            const matchesStatus = !statusFilter || status === statusFilter;
            const matchesDate = this.checkDateFilter(date, dateFilter);

            row.style.display = matchesSearch && matchesStatus && matchesDate ? '' : 'none';
        });
    }

    checkDateFilter(date, filter) {
        if (!filter) return true;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const orderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        switch (filter) {
            case 'today':
                return orderDate.getTime() === today.getTime();
            case 'this_week':
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                return orderDate >= weekStart;
            case 'this_month':
                return orderDate.getMonth() === today.getMonth() &&
                    orderDate.getFullYear() === today.getFullYear();
            default:
                return true;
        }
    }

    async exportOrders() {
        try {
            const startDate = null; // Implement date range picker if needed
            const endDate = null;
            const orders = await this.orderService.exportOrders(startDate, endDate);
            // Handle export result (e.g., download CSV)
            console.log('Exported orders:', orders);
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
        }
    }

    generateCsv(orders) {
        const headers = ['Order ID', 'Customer', 'Vehicle', 'Total', 'Status', 'Date'];
        const rows = orders.map(order => [
            order.id,
            order.customer.name,
            `${order.items[0].make} ${order.items[0].model}`,
            order.getTotalPrice(),
            order.status,
            new Date(order.date).toLocaleDateString()
        ]);

        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    downloadCsv(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Initialize the UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OrderManagementUI();
});