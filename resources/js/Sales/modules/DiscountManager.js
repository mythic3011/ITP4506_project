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

    async applyDiscount() {
        const code = this.elements.input.value.trim();
        if (!code) {
            throw new Error('Please enter a discount code.');
        }

        const subtotalText = document.getElementById('subtotalAmount').textContent;
        const subtotal = parseFloat(subtotalText.replace(/[^0-9.-]+/g, "")) || 0;

        try {
            const result = await this.discountController.applyDiscount(code, subtotal);
            this.currentDiscount = result;

            this.elements.amountElement.textContent = `Discount: -$${Number(result.discountAmount).toFixed(2)}`;
            this.elements.percentageElement.textContent = result.discount.discountType === 'percentage' 
                ? `(${result.discount.value}%)` 
                : '';

            this.elements.amountElement.classList.remove('hidden');
            this.elements.percentageElement.classList.remove('hidden');
            this.elements.removeButton.classList.remove('hidden');
            this.elements.applyButton.classList.add('hidden');
        } catch (error) {
            throw new Error('Invalid discount code.');
        }
    }

    removeDiscount() {
        this.currentDiscount = null;
        this.elements.input.value = '';
        this.elements.amountElement.classList.add('hidden');
        this.elements.percentageElement.classList.add('hidden');
        this.elements.removeButton.classList.add('hidden');
        this.elements.applyButton.classList.remove('hidden');
    }

    getCurrentDiscount() {
        return this.currentDiscount;
    }
}