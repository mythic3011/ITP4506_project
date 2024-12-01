export class StaffOrderModel {
    constructor(orderData) {
        this.id = orderData.id;
        this.date = new Date(orderData.data);
        this.status = orderData.status;
        this.customer = orderData.customer;
        this.items = orderData.items;
        this.discount = orderData.discount;
        this.licensingFee = orderData.licensingFee;
        this.tradeInValue = orderData.tradeInValue;
        this.financing = orderData.financing;
        this.address = orderData.address;
        this.payments = orderData.payments || [];
    }

    getFirstVehicle() {
        return this.items[0];
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.totalPrice, 0);
    }

    getFormattedAddress() {
        const addr = this.address;
        return `${addr.fullName}, ${addr.addressLine1}, ${addr.district}`;
    }

    getStatusClass() {
        const statusClasses = {
            pending: 'status-pending',
            confirmed: 'status-confirmed',
            processing: 'status-processing',
            completed: 'status-completed',
            cancelled: 'status-cancelled'
        };
        return statusClasses[this.status] || 'status-pending';
    }

    getTotalPaid() {
        return this.payments.reduce((total, payment) => total + payment.amount, 0);
    }

    getRemainingBalance() {
        return this.getTotalPrice() - this.getTotalPaid();
    }

    getPaymentStatus() {
        const total = this.getTotalPrice();
        const paid = this.getTotalPaid();

        if (paid >= total) return 'paid';
        if (paid > 0) return 'partial';
        return 'unpaid';
    }
}