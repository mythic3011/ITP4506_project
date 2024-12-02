import { MockOrderService } from './MockOrderService.js';

export class StaffOrderService {
    constructor() {
        this.storageKey = 'LMC_Orders';
        this.initializeMockData();
    }

    initializeMockData() {
        const existingOrders = localStorage.getItem(this.storageKey);
        const latestOrder = localStorage.getItem('LMC_Order');

        if (!existingOrders) {
            // Initialize with mock data and add latest order if exists
            const mockOrders = MockOrderService.getMockOrders();
            if (latestOrder) {
                mockOrders.unshift(JSON.parse(latestOrder));
            }
            localStorage.setItem(this.storageKey, JSON.stringify(mockOrders));
        } else if (latestOrder) {
            // Add latest order to existing orders if not already present
            const orders = JSON.parse(existingOrders);
            const latestOrderData = JSON.parse(latestOrder);
            if (!orders.some(order => order.id === latestOrderData.id)) {
                orders.unshift(latestOrderData);
                localStorage.setItem(this.storageKey, JSON.stringify(orders));
            }
        }
    }

    async getOrders() {
        try {
            const ordersData = localStorage.getItem(this.storageKey);
            if (!ordersData) {
                throw new Error('No orders found');
            }
            const orders = JSON.parse(ordersData);
            return Array.isArray(orders) ? orders : [orders];
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Failed to fetch orders');
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

    async updateStatus(orderId, newStatus) {
        try {
            const validStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
            if (!validStatuses.includes(newStatus)) {
                throw new Error('Invalid status');
            }

            const orders = await this.getOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);
            
            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            orders[orderIndex].status = newStatus;
            localStorage.setItem(this.storageKey, JSON.stringify(orders));
            
            return orders[orderIndex];
        } catch (error) {
            console.error('Error updating status:', error);
            throw new Error('Failed to update order status');
        }
    }

    async recordPayment(orderId, paymentData) {
        try {
            const orders = await this.getOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);
            
            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            if (!orders[orderIndex].payments) {
                orders[orderIndex].payments = [];
            }

            const payment = {
                id: this.generatePaymentId(),
                amount: paymentData.amount,
                method: paymentData.method,
                reference: paymentData.reference || null,
                notes: paymentData.notes || null,
                date: new Date().toISOString()
            };

            orders[orderIndex].payments.push(payment);
            localStorage.setItem(this.storageKey, JSON.stringify(orders));
            
            return orders[orderIndex];
        } catch (error) {
            console.error('Error recording payment:', error);
            throw new Error('Failed to record payment');
        }
    }

    async getLicensingData(orderId) {
        try {
            const order = await this.getOrder(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            return {
                status: order.licensingStatus || 'pending',
                documents: order.licensingDocuments || [],
                fee: order.licensingFee || 0,
                data: order.licensing || null
            };
        } catch (error) {
            console.error('Error fetching licensing data:', error);
            throw new Error('Failed to fetch licensing data');
        }
    }

    async updateLicensingStatus(orderId, newStatus, documents = []) {
        try {
            const orders = await this.getOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);
            
            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            orders[orderIndex].licensingStatus = newStatus;
            if (documents.length > 0) {
                if (!orders[orderIndex].licensingDocuments) {
                    orders[orderIndex].licensingDocuments = [];
                }
                orders[orderIndex].licensingDocuments.push(...documents);
            }

            localStorage.setItem(this.storageKey, JSON.stringify(orders));
            return orders[orderIndex];
        } catch (error) {
            console.error('Error updating licensing status:', error);
            throw new Error('Failed to update licensing status');
        }
    }

    async getTradeInData(orderId) {
        try {
            const order = await this.getOrder(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            return {
                vehicle: order.tradeInVehicle || null,
                value: order.tradeInValue || 0,
                status: order.tradeInStatus || 'pending'
            };
        } catch (error) {
            console.error('Error fetching trade-in data:', error);
            throw new Error('Failed to fetch trade-in data');
        }
    }

    async updateTradeInValue(orderId, tradeInData) {
        try {
            const orders = await this.getOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);
            
            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            orders[orderIndex].tradeInVehicle = tradeInData.vehicle;
            orders[orderIndex].tradeInValue = tradeInData.value;
            orders[orderIndex].tradeInStatus = tradeInData.status || 'pending';

            localStorage.setItem(this.storageKey, JSON.stringify(orders));
            return orders[orderIndex];
        } catch (error) {
            console.error('Error updating trade-in value:', error);
            throw new Error('Failed to update trade-in value');
        }
    }

    async getPaymentData(orderId) {
        try {
            const order = await this.getOrder(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            const totalPaid = (order.payments || []).reduce((sum, payment) => sum + payment.amount, 0);
            const total = order.items[0].totalPrice;

            return {
                total: total,
                payments: order.payments || [],
                remaining: total - totalPaid
            };
        } catch (error) {
            console.error('Error fetching payment data:', error);
            throw new Error('Failed to fetch payment data');
        }
    }

    generatePaymentId() {
        return 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    async exportOrders(startDate, endDate) {
        try {
            const orders = await this.getOrders();
            return orders.filter(order => {
                const orderDate = new Date(order.date);
                return (!startDate || orderDate >= startDate) && 
                       (!endDate || orderDate <= endDate);
            });
        } catch (error) {
            console.error('Error exporting orders:', error);
            throw new Error('Failed to export orders');
        }
    }
}