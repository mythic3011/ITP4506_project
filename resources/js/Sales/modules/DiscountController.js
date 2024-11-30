export class DiscountController {
    constructor() {
        this.discountService = new DiscountService();
        this.initialize();
    }

    async initialize() {
        try {
            await this.discountService.loadDiscounts();
        } catch (error) {
            console.error('Failed to initialize discount system:', error);
        }
    }

    applyDiscount(code, subtotal) {
        try {
            const validatedCode = validateDiscountCode(code);
            const validatedAmount = validateAmount(subtotal);
            
            return this.discountService.applyDiscount(validatedCode, validatedAmount);
        } catch (error) {
            throw new Error(`Failed to apply discount: ${error.message}`);
        }
    }
}

export function validateDiscountCode(code) {
    if (!code || typeof code !== 'string') {
        throw new Error('Invalid discount code format');
    }

    // Remove whitespace and convert to uppercase
    code = code.trim().toUpperCase();

    // Check if code matches pattern (letters, numbers, and hyphens only)
    if (!/^[A-Z0-9-]+$/.test(code)) {
        throw new Error('Discount code can only contain letters, numbers, and hyphens');
    }

    return code;
}

export function validateAmount(amount) {
    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount) || parsedAmount < 0) {
        throw new Error('Invalid amount');
    }

    return parsedAmount;
}


export class DiscountService {
    constructor() {
        this.discounts = new Map();
    }

    async loadDiscounts() {
        try {
            const response = await fetch('../../../resources/json/discounts.json');
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
        if (this.status !== 'active') return false;
        if (this.expirationDate && new Date() > this.expirationDate) return false;
        if (this.maxUses && this.usageCount >= this.maxUses) return false;
        return true;
    }

    calculateDiscount(subtotal) {
        if (!this.isValid() || subtotal < this.minimumPurchase) return 0;

        switch (this.discountType) {
            case 'percentage':
                return (subtotal * this.value) / 100;
            case 'fixed_amount':
                return Math.min(this.value, subtotal);
            default:
                return 0;
        }
    }
}