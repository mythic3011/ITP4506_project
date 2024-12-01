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
        this.isYes = isYes;
        this.fee = isYes ? 1000 : 0;
        this.elements.feeElement.textContent = `Licensing Fee: $${this.fee}`;
        this.elements.form.style.display = isYes ? 'block' : 'none';
        return this.fee;
    }

    getFee() {
        return this.fee;
    }

    validate() {
        return true;
    }

    getLicenseData() {
        if (this.isYes) {
            return {
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