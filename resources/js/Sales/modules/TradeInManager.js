export class TradeInManager {
    constructor(elements) {
        this.elements = elements;
        this.value = 0;
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.elements.yesButton.addEventListener('click', () => this.handleOption(true));
        this.elements.noButton.addEventListener('click', () => this.handleOption(false));
        this.elements.form.addEventListener('change', () => this.calculateValue());
    }

    handleOption(isYes) {
        this.elements.form.style.display = isYes ? 'block' : 'none';
        if (!isYes) {
            this.value = 0;
        }
        return this.value;
    }

    calculateValue() {
        const year = parseInt(this.elements.yearInput.value);
        const mileage = parseInt(this.elements.mileageInput.value);
        const condition = this.elements.conditionSelect.value;

        let baseValue = 5000;
        const currentYear = new Date().getFullYear();
        const age = currentYear - year;

        baseValue -= age * 500;
        baseValue -= Math.floor(mileage / 10000) * 200;

        const conditionMultipliers = {
            excellent: 1.2,
            good: 1,
            fair: 0.8,
            poor: 0.6
        };

        this.value = Math.max(baseValue * (conditionMultipliers[condition] || 1), 0);
        return this.value;
    }

    getValue() {
        return this.value;
    }

    getVehicle() {
        const formData = new FormData(this.elements.form);
        const vehicle = {};

        for (const [key, value] of formData.entries()) {
            vehicle[key] = value;
        }

        vehicle.year = parseInt(vehicle.tradeInYear, 10);
        vehicle.mileage = parseInt(vehicle.tradeInMileage, 10);

        // Basic validation
        if (!vehicle.tradeInMake || !vehicle.tradeInModel || isNaN(vehicle.year) || isNaN(vehicle.mileage) || !vehicle.tradeInCondition) {
            throw new Error('Please fill in all required fields with valid data.');
        }

        return vehicle;
    }
}