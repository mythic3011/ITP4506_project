// DiscountCodeManager.js

export class DiscountCode {
    constructor({
        code,
        discountType,
        value,
        currency,
        expirationDate,
        status = 'active',
        usageCount = 0,
        description,
        minimumPurchase = 0,
        maxUses = null
    }) {
        this.code = code;
        this.discountType = discountType;
        this.value = value;
        this.currency = currency;
        this.expirationDate = expirationDate ? new Date(expirationDate) : null;
        this.status = status;
        this.usageCount = usageCount;
        this.description = description;
        this.minimumPurchase = minimumPurchase;
        this.maxUses = maxUses;
    }

    isValid() {
        const now = new Date();
        if (this.status !== 'active') return false;
        if (this.expirationDate && now > this.expirationDate) return false;
        if (this.maxUses !== null && this.usageCount >= this.maxUses) return false;
        return true;
    }

    calculateDiscount(subtotal) {
        if (!this.isValid() || subtotal < this.minimumPurchase) return 0;

        switch (this.discountType) {
            case 'percentage':
                return (this.value / 100) * subtotal;
            case 'fixed_amount':
                return Math.min(this.value, subtotal);
            default:
                return 0;
        }
    }
}

export class DiscountService {
    constructor(api) {
        this.discounts = new Map();
        this.api = api;
    }

    async loadDiscounts() {
        try {
            const data = await this.api.fetchDiscounts();
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
            // Optionally, persist usage count
            this.api.updateDiscountUsage(discount.code, discount.usageCount);
        }

        return {
            discountAmount,
            finalTotal: subtotal - discountAmount,
            discount
        };
    }

    removeDiscountCode(currentDiscount) {
        if (currentDiscount && currentDiscount.usageCount > 0) {
            currentDiscount.usageCount--;
            this.api.updateDiscountUsage(currentDiscount.code, currentDiscount.usageCount);
        }
    }
}