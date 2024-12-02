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
        if (selectedPlan === 'none') {
            this.elements.paymentForm.style.display = 'none';
            this.clearMonthlyPayment();
            return;
        }

        this.elements.paymentForm.style.display = 'block';
        this.calculateAndDisplayMonthlyPayment();
    }

    calculateAndDisplayMonthlyPayment() {
        const principal = this.calculatePrincipal();
        const { interestRate, termMonths } = this.getFinancingDetails();
        const payment = this.calculateMonthlyPayment(principal, interestRate, termMonths);
        if (payment !== null) {
            this.displayMonthlyPayment(payment);
        }
    }

    calculatePrincipal() {
        const total = parseFloat(document.getElementById('totalAmount').textContent.replace(/[^0-9.-]+/g, "")) || 0;
        const deposit = parseFloat(document.getElementById('DepositAmount').textContent.replace(/[^0-9.-]+/g, "")) || 0;
        return total - deposit;
    }

    getFinancingDetails() {
        const selectedOption = this.elements.methodSelect.selectedOptions[0];
        return {
            interestRate: parseFloat(selectedOption.getAttribute('data-interest-rate')),
            termMonths: parseInt(selectedOption.getAttribute('data-term-months'), 10),
        };
    }

    calculateMonthlyPayment(principal, interestRate, termMonths) {
        if (!principal || principal <= 0 || !interestRate || !termMonths) {
            return null;
        }
        const monthlyRate = interestRate / 12 / 100;
        return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths));
    }

    displayMonthlyPayment(payment) {
        this.elements.paymentForm.querySelector('.payment-info')?.remove();
        const paymentInfo = document.createElement('p');
        paymentInfo.textContent = `Monthly Payment: $${payment.toFixed(2)}`;
        paymentInfo.classList.add('text-lg', 'font-bold', 'mt-4', 'payment-info');
        this.elements.paymentForm.appendChild(paymentInfo);
    }

    clearMonthlyPayment() {
        this.elements.paymentForm.querySelector('.payment-info')?.remove();
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
        const fieldsContainer = this.elements[`${paymentMethod}Fields`];

        return Array.from(fieldsContainer.querySelectorAll('input[required]'))
            .every(input => input.value.trim() !== '');
    }
}