// api.js

export class ApiService {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async fetchDiscounts() {
        const response = await fetch(`${this.baseURL}/resources/json/discounts.json`);
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    }

    async updateDiscountUsage(code, usageCount) {
        // Implement API call to update usage count
        // This is a placeholder; actual implementation depends on your backend
        try {
            const response = await fetch(`${this.baseURL}/updateDiscount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code, usageCount })
            });
            if (!response.ok) throw new Error('Failed to update discount usage');
            return response.json();
        } catch (error) {
            console.error('Error updating discount usage:', error);
            throw error;
        }
    }

    async fetchUserInfo() {
        const response = await fetch(`${this.baseURL}/resources/json/user.json`);
        if (!response.ok) throw new Error('Failed to fetch user information');
        return response.json();
    }

    async placeOrder(order) {
        const response = await fetch(`${this.baseURL}/resources/json/orders.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });
        if (!response.ok) throw new Error('Failed to place order');
        return response.json();
    }

    async updateUserOrders(userData) {
        const response = await fetch(`${this.baseURL}/resources/json/user.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Failed to update user orders');
        return response.json();
    }
}