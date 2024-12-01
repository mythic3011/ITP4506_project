export class OrderRecordService {
    constructor() {
        this.storageKey = 'LMC_Orders';
    }

    async getOrders() {
        try {
            const ordersData = localStorage.getItem(this.storageKey);
            if (!ordersData) {
                return [this.getLatestOrder()]; // Return latest order if no order history
            }
            const orders = JSON.parse(ordersData);
            return Array.isArray(orders) ? orders : [orders];
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Failed to fetch order records');
        }
    }

    async getOrder(orderId) {
        try {
            const orders = await this.getOrders();
            const order = orders.find(o => o.id === orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw new Error('Failed to fetch order details');
        }
    }

    getLatestOrder() {
        const orderData = localStorage.getItem('LMC_Order');
        if (!orderData) {
            throw new Error('No orders found');
        }
        return JSON.parse(orderData);
    }

    async confirmPickup(orderId) {
        try {
            const orders = await this.getOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);
            
            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            orders[orderIndex].status = 'confirmed';
            localStorage.setItem(this.storageKey, JSON.stringify(orders));
            
            return orders[orderIndex];
        } catch (error) {
            console.error('Error confirming pickup:', error);
            throw new Error('Failed to confirm pickup');
        }
    }
}