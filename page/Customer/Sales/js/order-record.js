import {OrderRecordService} from './services/OrderRecordService.js';
import {OrderRecordModel} from './models/OrderRecordModel.js';
import {OrderRecordView} from './views/OrderRecordView.js';
import {DocumentUploadService} from './services/DocumentUploadService.js';
import {showMessage} from './ui.js';

class OrderRecordUI {
    constructor() {
        this.orderService = new OrderRecordService();
        this.documentService = new DocumentUploadService();
        this.initializeElements();
        this.view = new OrderRecordView({
            recordsContainer: document.getElementById('orderRecords'),
            orderDetailsContent: document.getElementById('orderDetailsContent')
        });
        this.attachEventListeners();
        this.loadOrders();
    }

    initializeElements() {
        this.searchInput = document.getElementById('searchOrder');
        this.statusFilter = document.getElementById('statusFilter');
        this.dateFilter = document.getElementById('dateFilter');
        this.orderDetailsModal = document.getElementById('orderDetailsModal');
        this.documentUploadModal = document.getElementById('documentUploadModal');
        this.pickupConfirmModal = document.getElementById('pickupConfirmModal');
        this.documentUploadForm = document.getElementById('documentUploadForm');
    }

    attachEventListeners() {
        // Filter events
        this.searchInput.addEventListener('input', () => this.filterOrders());
        this.statusFilter.addEventListener('change', () => this.filterOrders());
        this.dateFilter.addEventListener('change', () => this.filterOrders());

        // Modal events
        document.querySelectorAll('.close-button').forEach(button => {
            button.addEventListener('click', () => this.closeAllModals());
        });

        // Document upload form
        this.documentUploadForm.addEventListener('submit', (e) => this.handleDocumentUpload(e));
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
    }

    async loadOrders() {
        try {
            const orders = await this.orderService.getOrders();
            console.log("Orders:", orders);

            const orderModels = orders.map(order => {
                try {
                    return new OrderRecordModel(order);
                } catch (mappingError) {
                    console.error('Mapping error for order:', order, mappingError);
                    throw mappingError; // Re-throw to be caught by outer catch
                }
            });
            console.log("Order Models:", orderModels);
            this.view.renderOrders(orderModels);
            this.attachOrderEventListeners();
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
            console.error('Error loadOrders :', error);
        }
    }


    attachOrderEventListeners() {
        // View Details buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', () => this.showOrderDetails(button.dataset.orderId));
        });

        // Upload Document buttons
        document.querySelectorAll('.upload-document-btn').forEach(button => {
            button.addEventListener('click', () => this.showDocumentUpload(button.dataset.orderId));
        });

        // Confirm Pickup buttons
        document.querySelectorAll('.confirm-pickup-btn').forEach(button => {
            button.addEventListener('click', () => this.showPickupConfirmation(button.dataset.orderId));
        });
    }

    async showOrderDetails(orderId) {
        try {
            const order = await this.orderService.getOrder(orderId);
            const orderModel = new OrderRecordModel(order);
            this.view.renderOrderDetails(orderModel);
            this.orderDetailsModal.style.display = 'block';
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
            console.error('Error confirming pickup:', error);
        }
    }

    showDocumentUpload(orderId) {
        this.documentUploadForm.dataset.orderId = orderId;
        this.documentUploadModal.style.display = 'block';
    }

    showPickupConfirmation(orderId) {
        const confirmButton = this.pickupConfirmModal.querySelector('.confirm-pickup');
        confirmButton.dataset.orderId = orderId;
        confirmButton.addEventListener('click', () => this.handlePickupConfirmation(orderId));
        this.pickupConfirmModal.style.display = 'block';
    }

    async handleDocumentUpload(e) {
        e.preventDefault();
        const orderId = this.documentUploadForm.dataset.orderId;
        const formData = new FormData(this.documentUploadForm);

        try {
            await this.documentService.uploadDocument(orderId, formData);
            showMessage(document.getElementById('message'), 'Document uploaded successfully!', 'success');
            this.closeAllModals();
            this.loadOrders(); // Refresh the order list
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
            console.error('Error confirming pickup:', error);
        }
    }

    async handlePickupConfirmation(orderId) {
        try {
            await this.orderService.confirmPickup(orderId);
            showMessage(document.getElementById('message'), 'Pickup confirmed successfully!', 'success');
            this.closeAllModals();
            this.loadOrders(); // Refresh the order list
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
            console.error('Error confirming pickup:', error);
        }
    }

    filterOrders() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const statusFilter = this.statusFilter.value;
        const dateFilter = this.dateFilter.value;

        const orderCards = document.querySelectorAll('.order-card');
        orderCards.forEach(card => {
            const orderId = card.querySelector('.order-id').textContent.toLowerCase();
            const status = card.querySelector('.order-status').textContent.toLowerCase();
            const date = new Date(card.dataset.orderDate);

            const matchesSearch = orderId.includes(searchTerm);
            const matchesStatus = !statusFilter || status === statusFilter;
            const matchesDate = this.checkDateFilter(date, dateFilter);

            card.style.display = matchesSearch && matchesStatus && matchesDate ? 'block' : 'none';
        });
    }

    checkDateFilter(date, filter) {
        if (!filter) return true;

        const now = new Date();
        const diff = now - date;
        const dayInMs = 24 * 60 * 60 * 1000;

        switch (filter) {
            case 'last_week':
                return diff <= 7 * dayInMs;
            case 'last_month':
                return diff <= 30 * dayInMs;
            case 'last_year':
                return diff <= 365 * dayInMs;
            default:
                return true;
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
}

// Initialize the UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OrderRecordUI();
});