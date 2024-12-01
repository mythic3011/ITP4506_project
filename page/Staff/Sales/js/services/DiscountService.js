import { DiscountCode } from '../models/DiscountCode.js';

export class DiscountService {
    constructor() {
        this.discounts = new Map();
    }

    async loadDiscounts() {
        try {
            const response = await fetch('./resources/json/discounts.json');
            const data = await response.json();
            
            data.discount_codes.forEach(discount => {
                const discountCode = new DiscountCode(discount);
                this.discounts.set(discountCode.code, discountCode);
            });
        } catch (error) {
            console.error('Error loading discount codes:', error);
            throw new Error('Failed to load discount codes');
        }
    }

    validateCode(code, subtotal) {
        const discount = this.discounts.get(code);
        
        if (!discount) {
            throw new Error('Invalid discount code');
        }

        if (!discount.isValid()) {
            throw new Error('This discount code has expired or is no longer valid');
        }

        if (subtotal < discount.minimumPurchase) {
            throw new Error(`Minimum purchase amount of ${discount.currency} ${discount.minimumPurchase} required`);
        }

        return discount;
    }

    applyDiscount(code, subtotal) {
        const discount = this.validateCode(code, subtotal);
        const discountAmount = discount.calculateDiscount(subtotal);
        
        if (discountAmount > 0) {
            discount.usageCount++;
        }

        return {
            discountAmount,
            finalTotal: subtotal - discountAmount,
            discount
        };
    }
}