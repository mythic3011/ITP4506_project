export class DiscountManager {
    constructor(discountController, elements) {
        this.discountController = discountController;
        this.elements = elements;
        this.currentDiscount = null;
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.elements.applyButton.addEventListener('click', () => this.applyDiscount());
        this.elements.removeButton.addEventListener('click', () => this.removeDiscount());
    }

    async applyDiscount(subtotal) {
        const code = this.elements.input.value.trim();
        if (!code) {
            throw new Error('Please enter a discount code.');
        }

        const result = await this.discountController.applyDiscount(code, subtotal);
        this.currentDiscount = result;
        
        this.elements.amountElement.textContent = `Discount: -$${result.discountAmount.toLocaleString()}`;
        this.elements.percentageElement.textContent = result.discount.discountType === 'percentage' 
            ? `(${result.discount.value}%)` 
            : '';

        this.elements.amountElement.classList.remove('hidden');
        this.elements.percentageElement.classList.remove('hidden');
        this.elements.removeButton.classList.remove('hidden');
        this.elements.applyButton.classList.add('hidden');

        return result.discountAmount;
    }

    removeDiscount() {
        this.currentDiscount = null;
        this.elements.input.value = '';
        this.elements.amountElement.classList.add('hidden');
        this.elements.percentageElement.classList.add('hidden');
        this.elements.removeButton.classList.add('hidden');
        this.elements.applyButton.classList.remove('hidden');
        return 0;
    }

    getCurrentDiscount() {
        return this.currentDiscount;
    }
}