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