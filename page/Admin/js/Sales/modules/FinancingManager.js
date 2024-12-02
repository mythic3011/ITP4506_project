export class FinancingManager {
    constructor(elements) {
        this.elements = elements;
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.elements.methodSelect.addEventListener('change', (e) => this.handleMethodChange(e));
        this.elements.paymentSelect.addEventListener('change', (e) => this.togglePaymentFields(e.target.value));
    }

    handleMethodChange(event) {
        const selectedPlan = event.target.value;
        const depositSection = this.elements.paymentForm;
        
        if (selectedPlan === 'none') {
            depositSection.style.display = 'none';
            return null;
        }

        depositSection.style.display = 'block';
        const option = event.target.options[event.target.selectedIndex];
        const interestRate = parseFloat(option.dataset.interestRate);
        const termMonths = parseInt(option.dataset.termMonths);
        
        return this.calculateMonthlyPayment(interestRate, termMonths);
    }

    calculateMonthlyPayment(interestRate, termMonths, principal) {
        const monthlyRate = interestRate / 12;
        const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / 
                       (Math.pow(1 + monthlyRate, termMonths) - 1);
                       
        const paymentInfo = document.createElement('p');
        paymentInfo.textContent = `Monthly Payment: $${payment.toFixed(2)}`;
        paymentInfo.classList.add('text-lg', 'font-bold', 'mt-4', 'payment-info');
        
        const existingInfo = this.elements.paymentForm.querySelector('.payment-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        this.elements.paymentForm.appendChild(paymentInfo);
        return payment;
    }

    togglePaymentFields(method) {
        const fields = {
            credit_card: this.elements.creditCardFields,
            paypal: this.elements.paypalFields,
            cash: this.elements.cashFields,
            check: this.elements.checkFields
        };

        Object.values(fields).forEach(field => field.classList.add('hidden'));
        if (fields[method]) {
            fields[method].classList.remove('hidden');
        }
    }

    validate() {
        const selectedMethod = this.elements.methodSelect.value;
        if (selectedMethod === 'none') return false;

        const paymentMethod = this.elements.paymentSelect.value;
        const fields = this.elements[`${paymentMethod}Fields`];
        
        return Array.from(fields.querySelectorAll('input')).every(input => input.value.trim() !== '');
    }
}