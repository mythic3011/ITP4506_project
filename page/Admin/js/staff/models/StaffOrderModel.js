export class StaffOrderModel {
    constructor(orderData) {
        if (!orderData) {
            throw new Error('Order data is required');
        }

        this.id = orderData.id || '';
        this.date = orderData.data ? new Date(orderData.data) : new Date();
        this.status = orderData.status || 'pending';
        this.customer = this.initializeCustomer(orderData.customer);
        this.items = this.initializeItems(orderData.items);
        this.discount = orderData.discount || '';
        this.licensingFee = orderData.licensingFee || 0;
        this.tradeInValue = orderData.tradeInValue || 0;
        this.financing = this.initializeFinancing(orderData.financing);
        this.address = this.initializeAddress(orderData.address);
        this.payments = orderData.payments || [];
        this.licensingStatus = orderData.licensingStatus || 'pending';
        this.licensingDocuments = orderData.licensingDocuments || [];
        this.tradeInVehicle = orderData.tradeInVehicle || null;
    }

    initializeCustomer(customer) {
        return {
            id: customer?.id || 0,
            name: customer?.name || 'Unknown Customer',
            email: customer?.email || '',
            phone: customer?.phone || '',
            address: customer?.address || '',
            faxNumber: customer?.faxNumber || ''
        };
    }

    initializeItems(items) {
        if (!Array.isArray(items) || items.length === 0) {
            return [{
                id: 0,
                make: 'Unknown',
                model: 'Unknown',
                color: 'Unknown',
                price: 0,
                totalPrice: 0,
                upgrades: [],
                insurancePlans: [],
                images: []
            }];
        }
        return items;
    }

    initializeFinancing(financing) {
        return {
            method: financing?.method || 'cash',
            paymentMethod: financing?.paymentMethod || 'cash'
        };
    }

    initializeAddress(address) {
        return {
            fullName: address?.fullName || '',
            addressLine1: address?.addressLine1 || '',
            district: address?.district || ''
        };
    }

    getFirstVehicle() {
        return this.items[0];
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.totalPrice || 0), 0);
    }

    getFormattedAddress() {
        const addr = this.address;
        return addr.addressLine1 ? 
            `${addr.fullName}, ${addr.addressLine1}, ${addr.district}` : 
            'No address provided';
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
        return this.payments.reduce((total, payment) => total + (payment.amount || 0), 0);
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