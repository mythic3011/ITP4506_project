export class InvoiceService {
    generateInvoice(order) {
        const invoice = {
            id: this.generateInvoiceId(),
            orderId: order.id,
            date: new Date().toISOString(),
            customer: order.customer,
            items: order.items,
            subtotal: order.getTotalPrice(),
            discount: order.discount || 0,
            licensingFee: order.licensingFee || 0,
            tradeInValue: order.tradeInValue || 0,
            total: this.calculateTotal(order),
            payments: order.payments || []
        };

        return this.formatInvoice(invoice);
    }

    generateInvoiceId() {
        return 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    calculateTotal(order) {
        const subtotal = order.getTotalPrice();
        const discount = order.discount || 0;
        const licensingFee = order.licensingFee || 0;
        const tradeInValue = order.tradeInValue || 0;
        return subtotal - discount + licensingFee - tradeInValue;
    }

    formatInvoice(invoice) {
        // In a real application, this would generate a PDF or HTML invoice
        // For now, we'll return a formatted object that can be used to display the invoice
        return {
            ...invoice,
            formattedDate: new Date(invoice.date).toLocaleDateString(),
            formattedTotal: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(invoice.total)
        };
    }
}