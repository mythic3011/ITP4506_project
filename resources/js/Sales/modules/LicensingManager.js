export class LicensingManager {
    constructor(elements) {
        this.elements = elements;
        this.fee = 0;
        this.attachEventListeners();
        this.isYes = false;
    }

    attachEventListeners() {
        this.elements.yesButton.addEventListener('click', () => this.handleOption(true));
        this.elements.noButton.addEventListener('click', () => this.handleOption(false));
    }

    handleOption(isYes) {
        this.fee = isYes ? 1000 : 0;
        this.elements.feeElement.textContent = `Licensing Fee: $${this.fee}`;
        this.elements.form.style.display = isYes ? 'block' : 'none';
        return this.fee;
    }

    getFee() {
        return this.fee;
    }

    validate() {
        if (this.fee > 0) {
            // Add validation logic for licensing form
            const required = ['licensePlate', 'licenseState', 'licenseNumber', 'licenseExpiry', 'licenseIssued'];
            return required.every(field => this.elements.form.querySelector(`#${field}`).value.trim() !== '');
        }
        return true;
    }

    getLicenseData() {
        if (this.isYes) {
            validate();
            return {
                licensePlate: this.elements.licensePlate.value,
                licenseState: this.elements.licenseState.value,
                licenseNumber: this.elements.licenseNumber.value,
                licenseExpiry: this.elements.licenseExpiry.value,
                licenseIssued: this.elements.licenseIssued.value,
                licenseAddress: this.getlicenseAddress()
            };
        }
        return null;
    }

    getlicenseAddress() {
        if (!this.elements.licenseAddressSame.checked) {
            return "";
        }
        return this.elements.licenseAddress.value;
    }
}