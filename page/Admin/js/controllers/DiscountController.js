import { DiscountService } from '../services/DiscountService.js';
import { validateDiscountCode, validateAmount } from '../utils/validation.js';

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