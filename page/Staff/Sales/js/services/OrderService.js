export class OrderService {
    constructor() {
        this.storageKey = 'LMC_Order';
    }

    async getOrder() {
        try {
            const orderData = localStorage.getItem(this.storageKey);
            if (!orderData) {
                throw new Error('Order not found');
            }

            const parsedOrder = JSON.parse(orderData);
            return this.mapOrderData(parsedOrder);
        } catch (error) {
            console.error('Error fetching order:', error);
            throw new Error('Failed to fetch order details');
        }
    }

    mapOrderData(data) {
        if (!data || !data.id || !data.items || !data.items.length) {
            throw new Error('Invalid order data structure');
        }

        return {
            id: data.id,
            date: data.data, // Original field name is 'data'
            status: this.mapOrderStatus(data.status),
            customer: this.mapCustomerData(data.customer),
            items: this.mapOrderItems(data.items),
            discount: data.discount || '',
            licensingFee: data.licensingFee || 0,
            tradeInValue: data.tradeInValue || 0,
            financing: this.mapFinancingData(data.financing),
            address: this.mapAddressData(data.address),
            licensingStatus: data.licensingStatus || 'pending',
            licensingDocuments: data.licensingDocuments || [],
            tradeInVehicle: data.tradeInVehicle || null,
            payments: data.payments || []
        };
    }

    mapOrderStatus(status) {
        const validStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
        return validStatuses.includes(status) ? status : 'pending';
    }

    mapCustomerData(customer) {
        if (!customer) {
            throw new Error('Customer data is required');
        }

        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            faxNumber: customer.faxNumber
        };
    }

    mapOrderItems(items) {
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('Order must contain at least one item');
        }

        return items.map(item => ({
            id: item.id,
            make: item.make,
            model: item.model,
            color: item.color,
            upgrades: item.upgrades || [],
            insurancePlans: this.mapInsurancePlans(item.insurancePlans),
            price: parseFloat(item.price) || 0,
            totalPrice: parseFloat(item.totalPrice) || 0,
            dateAdded: item.dateAdded,
            images: item.images || []
        }));
    }

    mapInsurancePlans(plans) {
        if (!Array.isArray(plans)) {
            return [];
        }

        return plans.map(plan => ({
            planName: plan.planName,
            annualPremium: parseFloat(plan.annualPremium) || 0,
            coverageLimit: parseFloat(plan.coverageLimit) || 0,
            deductible: parseFloat(plan.deductible) || 0
        }));
    }

    mapFinancingData(financing) {
        const defaultFinancing = {
            method: 'loan_plan_a',
            paymentMethod: 'cash'
        };

        if (!financing) {
            return defaultFinancing;
        }

        return {
            method: financing.method || defaultFinancing.method,
            paymentMethod: financing.paymentMethod || defaultFinancing.paymentMethod,
            ...this.getFinancingDetails(financing)
        };
    }

    mapAddressData(address) {
        if (!address) {
            throw new Error('Delivery address is required');
        }

        return {
            fullName: address.fullName,
            addressLine1: address.addressLine1,
            district: address.district
        };
    }

    getFinancingDetails(financing) {
        const plans = {
            loan_plan_a: {
                name: '36-Month Loan',
                interestRate: 3.9,
                termMonths: 36
            },
            loan_plan_b: {
                name: '48-Month Loan',
                interestRate: 4.2,
                termMonths: 48
            },
            loan_plan_c: {
                name: '60-Month Loan',
                interestRate: 4.5,
                termMonths: 60
            }
        };

        const plan = plans[financing.method] || plans.loan_plan_a;
        return {
            plan: plan.name,
            method: financing.paymentMethod,
            termMonths: plan.termMonths,
            interestRate: plan.interestRate
        };
    }

    saveOrder(orderData) {
        try {
            const mappedOrder = this.mapOrderData(orderData);
            localStorage.setItem(this.storageKey, JSON.stringify(mappedOrder));
            return mappedOrder;
        } catch (error) {
            console.error('Error saving order:', error);
            throw new Error('Failed to save order details');
        }
    }

    clearOrder() {
        localStorage.removeItem(this.storageKey);
    }

    async updatePayment(orderId, paymentData) {
        try {
            const orders = await this.getOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);

            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            orders[orderIndex].payments.push(paymentData);
            localStorage.setItem(this.storageKey, JSON.stringify(orders));
            return orders[orderIndex];
        } catch (error) {
            console.error('Error updating payment:', error);
            throw new Error('Failed to update payment');
        }
    }
}