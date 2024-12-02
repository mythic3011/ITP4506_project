import { OrderService } from './services/OrderService.js';
import { OrderModel } from './models/OrderModel.js';
import { OrderDetailsView } from './views/OrderDetailsView.js';
import { showMessage } from './ui.js';

class OrderConfirmationUI {
    constructor() {
        this.orderService = new OrderService();
        this.view = new OrderDetailsView({
            orderId: document.getElementById('orderId'),
            orderDate: document.getElementById('orderDate'),
            orderStatus: document.getElementById('orderStatus'),
            vehicleDetails: document.getElementById('vehicleDetails'),
            tradeinDetails: document.getElementById('tradeinDetails'),
            customerInfo: document.getElementById('customerInfo'),
            paymentInfo: document.getElementById('paymentInfo'),
            deliveryInfo: document.getElementById('deliveryInfo')
        });

        this.loadOrderDetails();
    }

    async loadOrderDetails() {
        try {
            const orderData = await this.orderService.getOrder();
            const order = new OrderModel(orderData);
            this.renderOrderDetails(order);
        } catch (error) {
            showMessage(document.getElementById('message'), error.message, 'error');
        }
    }

    renderOrderDetails(order) {
        const vehicle = order.getFirstVehicle();
        this.view.renderOrderInfo(order);
        this.view.renderVehicleDetails(vehicle);
        this.view.renderCustomerInfo(order.customer);
        this.view.renderPaymentInfo(order.financing);
        this.view.renderDeliveryInfo(order.getFormattedAddress(), order.date);
        this.view.renderTradeInInfo(order.tradeInValue);
    }
}

// Initialize the UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OrderConfirmationUI();
});