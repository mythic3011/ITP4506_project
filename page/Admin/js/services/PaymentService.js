export class PaymentService {
    constructor() {
        this.validPaymentMethods = ['cash', 'credit_card', 'bank_transfer'];
    }

    async recordPayment(orderId, paymentData) {
        if (!this.validatePaymentData(paymentData)) {
            throw new Error('Invalid payment data');
        }

        try {
            const orders = JSON.parse(localStorage.getItem('LMC_Orders')) || [];
            const orderIndex = orders.findIndex(o => o.id === orderId);
            
            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            const payment = {
                id: this.generatePaymentId(),
                amount: paymentData.amount,
                method: paymentData.method,
                reference: paymentData.reference || null,
                notes: paymentData.notes || null,
                date: new Date().toISOString()
            };

            if (!orders[orderIndex].payments) {
                orders[orderIndex].payments = [];
            }

            orders[orderIndex].payments.push(payment);

            // Update order status based on payment
            this.updateOrderStatus(orders[orderIndex]);

            localStorage.setItem('LMC_Orders', JSON.stringify(orders));
            return payment;
        } catch (error) {
            console.error('Error recording payment:', error);
            throw new Error('Failed to record payment');
        }
    }

    validatePaymentData(paymentData) {
        if (!paymentData.amount || paymentData.amount <= 0) {
            throw new Error('Invalid payment amount');
        }

        if (!this.validPaymentMethods.includes(paymentData.method)) {
            throw new Error('Invalid payment method');
        }

        return true;
    }

    generatePaymentId() {
        return 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    updateOrderStatus(order) {
        const totalPaid = order.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalDue = order.items.reduce((sum, item) => sum + item.totalPrice, 0);

        if (totalPaid >= totalDue) {
            order.status = 'completed';
        } else if (totalPaid > 0) {
            order.status = 'processing';
        }
    }

    getPaymentSummary(order) {
        const totalDue = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalPaid = order.payments.reduce((sum, payment) => sum + payment.amount, 0);

        return {
            totalDue,
            totalPaid,
            remaining: totalDue - totalPaid,
            paymentStatus: this.getPaymentStatus(totalPaid, totalDue),
            payments: order.payments || []
        };
    }

    getPaymentStatus(paid, total) {
        if (paid >= total) return 'paid';
        if (paid > 0) return 'partial';
        return 'unpaid';
    }
}