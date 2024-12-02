// Checkout.js
import { DiscountController } from './modules/DiscountController.js';
import { OrderSummary } from './modules/OrderSummary.js';
import { DiscountManager } from './modules/DiscountManager.js';
import { LicensingManager } from './modules/LicensingManager.js';
import { TradeInManager } from './modules/TradeInManager.js';
import { FinancingManager } from './modules/FinancingManager.js';
import { AddressManager } from './modules/AddressManager.js';
import { NotificationManager } from './modules/NotificationManager.js';
import { TabManager } from './modules/TabManager.js';

class CheckoutManager {
    constructor() {
        this.initializeManagers();
        this.loadWishlistItems();
        this.initializeTabs();
        this.attachEventListeners();
    }

    initializeManagers() {
        // Initialize all module managers
        this.orderSummary = new OrderSummary(
            document.getElementById('orderSummaryContainer'),
            document.getElementById('orderSummary'),
            document.getElementById('subtotalAmount'),
            document.getElementById('totalAmount'),
            document.getElementById('DepositAmount'),
            document.getElementById('EstimatedDelivery')
        );

        this.discountManager = new DiscountManager(new DiscountController(), {
            input: document.getElementById('discountCode'),
            applyButton: document.getElementById('applyDiscount'),
            removeButton: document.getElementById('removeDiscount'),
            amountElement: document.getElementById('discountAmount'),
            percentageElement: document.getElementById('discountPercentage')
        });

        this.licensingManager = new LicensingManager({
            form: document.getElementById('licensingVerificationForm'),
            yesButton: document.getElementById('licensingVerificationYes'),
            noButton: document.getElementById('licensingVerificationNo'),
            feeElement: document.getElementById('licensingFee')
        });

        this.tradeInManager = new TradeInManager({
            form: document.getElementById('tradeInForm'),
            yesButton: document.getElementById('tradeInYes'),
            noButton: document.getElementById('tradeInNo'),
            yearInput: document.getElementById('tradeInYear'),
            mileageInput: document.getElementById('tradeInMileage'),
            conditionSelect: document.getElementById('tradeInCondition'),
            makeInput: document.getElementById('tradeInMake'),
            modelInput: document.getElementById('tradeInModel')
        });

        this.financingManager = new FinancingManager({
            methodSelect: document.getElementById('financingMethod'),
            paymentSelect: document.getElementById('Select-Loan-Deposit'),
            paymentForm: document.getElementById('payment-form'),
            creditCardFields: document.getElementById('payment-full-payment-credit-card'),
            paypalFields: document.getElementById('payment-full-payment-paypal'),
            cashFields: document.getElementById('payment-full-payment-cash'),
            checkFields: document.getElementById('payment-full-payment-check')
        });

        this.addressManager = new AddressManager(document.getElementById('checkoutForm'));

        this.notificationManager = new NotificationManager(document.getElementById('notification-container'));
    }

    initializeTabs() {
        const tabContainers = document.querySelectorAll('[data-tabs]');
        this.tabManagers = Array.from(tabContainers).map(container => {
            const tabManager = new TabManager(container);

            // Listen for tab changes
            container.addEventListener('tabChange', (e) => {
                this.handleTabChange(container.id, e.detail.tabId);
            });

            return tabManager;
        });
    }

    handleTabChange(containerId, tabId) {
        switch (containerId) {
            case 'licensingVerificationTabs':
                if (tabId === 'licensing-yes') {
                    this.licensingManager.handleOption(true);
                } else if (tabId === 'licensing-no') {
                    this.licensingManager.handleOption(false);
                }
                break;

            case 'tradeInTabs':
                if (tabId === 'tradeIn-yes') {
                    this.tradeInManager.handleOption(true);
                } else if (tabId === 'tradeIn-no') {
                    this.tradeInManager.handleOption(false);
                }
                break;

            case 'financingTabs':
                if (tabId === 'financing-loan-plans') {
                    this.financingManager.handleMethodChange({ target: { value: 'loan' } });
                } else if (tabId === 'financing-payment-methods') {
                    this.financingManager.handleMethodChange({ target: { value: 'cash' } });
                }
                break;

            case 'addressTabs':
                if (tabId === 'address-local') {
                    this.addressManager.showLocalForm();
                } else if (tabId === 'address-overseas') {
                    this.addressManager.showOverseasForm();
                }
                break;
        }

        // Update totals after any tab change
        this.updateTotals();
    }

    async loadWishlistItems() {
        try {
            const wishlistData = localStorage.getItem('LMC_WishList');
            this.wishlistItems = wishlistData ? JSON.parse(wishlistData) : [];
            this.orderSummary.render(this.wishlistItems);
            this.updateTotals();
        } catch (error) {
            console.error('Error loading wishlist items:', error);
            this.notificationManager.show('Error loading wishlist items. Please try again.', 'error');
        }
    }

    updateTotals() {
        const subtotal = this.wishlistItems.reduce((sum, item) => sum + Number(item.totalPrice), 0);
        const discount = Number(this.discountManager.getCurrentDiscount()?.discountAmount) || 0;
        const licensingFee = Number(this.licensingManager.getFee()) || 0;
        const tradeInValue = Number(this.tradeInManager.getValue()) || 0;

        this.orderSummary.updateTotals(subtotal, discount, licensingFee, tradeInValue);
    }

    validateCheckout() {
        // Validate all sections
        const validations = [
            {
                manager: this.financingManager,
                message: 'Please complete the financing information.'
            },
            {
                manager: this.licensingManager,
                message: 'Please complete the licensing information.'
            },
            {
                manager: this.addressManager,
                message: 'Please complete the address information.'
            }
        ];

        // for (const validation of validations) {
        //     if (!validation.manager.validate()) { /* ... */ }
        // }

        return true;
    }

    attachEventListeners() {
        // Handle Apply Discount
        document.getElementById('applyDiscount').addEventListener('click', async () => {
            try {
                const { discountAmount, finalTotal } = await this.discountManager.applyDiscount();
                this.updateDiscountDetails(discountAmount, finalTotal);
                this.notificationManager.show('Discount applied successfully!', 'success');
            } catch (error) {
                this.notificationManager.show(error.message, 'error');
            }
        });

        // Handle Remove Discount
        document.getElementById('removeDiscount').addEventListener('click', () => {
            const { discountAmount, finalTotal } = this.discountManager.removeDiscount();
            this.updateDiscountDetails(discountAmount, finalTotal);
            this.notificationManager.show('Discount removed.', 'success');
        });

        // Handle Form Submission abnd the submit button
        document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
            await this.handleCheckoutSubmit(e);
        });
        document.getElementById('checkoutFormbtn').addEventListener('click', async (e) => {
            await this.handleCheckoutSubmit(e);
        });

        // Handle Financing Method Change
        document.getElementById('financingMethod').addEventListener('change', (event) => {
            this.financingManager.handleMethodChange(event);
            this.calculateMonthlyPayment();
        });

    }

    calculateSubtotal() {
        return this.wishlistItems.reduce((total, item) => total + Number(item.price), 0);
    }

    updateDiscountDetails(amount, finalTotal) {
        const discountAmountEl = document.getElementById('discountAmount');
        const discountPercentageEl = document.getElementById('discountPercentage');

        if (amount > 0) {
            discountAmountEl.textContent = `-$${amount.toFixed(2)}`;
            discountAmountEl.classList.remove('hidden');
            discountPercentageEl.textContent = `${this.discountManager.getCurrentDiscount().discount.value}%`;
            discountPercentageEl.classList.remove('hidden');
            document.getElementById('removeDiscount').classList.remove('hidden');
        } else {
            discountAmountEl.textContent = '';
            discountAmountEl.classList.add('hidden');
            discountPercentageEl.textContent = '';
            discountPercentageEl.classList.add('hidden');
            document.getElementById('removeDiscount').classList.add('hidden');
        }

        console.log(`Final Total: ${finalTotal}`);

        // Remove the following line to prevent conflicting updates
        // document.getElementById('totalAmount').textContent = `$${finalTotal.toFixed(2)}`;
    }

    async handleCheckoutSubmit(e) {
        e.preventDefault();

        try {

            const userInfo = JSON.parse(localStorage.getItem('userInfo'));


            const orderData = {
                id: generateOrderNumber(),
                data: new Date().toISOString(),
                status: 'pending',
                customer: {
                    id: userInfo.id,
                    name: userInfo.firstName + " " + userInfo.lastName,
                    email: userInfo.email,
                    phone: userInfo.mobile,
                    address: userInfo.address,
                    faxNumber: userInfo.faxNumber
                },
                items: this.wishlistItems,
                discount: this.discountManager.getCurrentDiscount(),
                licensingFee: this.licensingManager.getFee(),
                tradeInValue: this.tradeInManager.getValue(),
                tradeInVehicle: this.tradeInManager.getVehicle(),
                financing: {
                    method: document.getElementById('financingMethod').value,
                    paymentMethod: document.getElementById('Select-Loan-Deposit').value
                },
                address: this.addressManager.getAddressData(),
                licensing: this.licensingManager.getLicenseData(),
            };
            // update LMC_Order to local storage
            localStorage.setItem('LMC_Order', JSON.stringify(orderData));
            console.log(orderData);
            await new Promise(resolve => setTimeout(resolve, 1500));
            // remove LMC_WishList from local storage
            localStorage.removeItem('LMC_WishList');
            this.notificationManager.show('Order placed successfully! Redirecting to confirmation page...', 'success');
            // set checkoutFormbtn to disabled
            document.getElementById('checkoutFormbtn').disabled = true;
            document.getElementById('checkoutFormbtn').classList.remove('bg-indigo-600');
            document.getElementById('checkoutFormbtn').classList.add('bg-red-600');
            document.getElementById('checkoutFormbtn').textContent = 'Order Placed';

            setTimeout(() => {
                window.location.href = './orderConfirmation.html';
            }, 2000);

        } catch (error) {
            this.notificationManager.show(error.message, 'error');
        }
    }

    calculateMonthlyPayment() {
        const selectedOption = document.getElementById('financingMethod').selectedOptions[0];
        if (!selectedOption || selectedOption.value === 'none') {
            document.getElementById('monthlyPaymentDisplay').classList.add('hidden');
            return;
        }

        const totalText = document.getElementById('totalAmount').textContent;
        const total = parseFloat(totalText.replace(/[^0-9.-]+/g, "")) || 0;
        const depositText = document.getElementById('DepositAmount').textContent;
        const deposit = parseFloat(depositText.replace(/[^0-9.-]+/g, "")) || 0;
        const principal = total - deposit;
        const interestRate = parseFloat(selectedOption.getAttribute('data-interest-rate')); // annual rate
        const termMonths = parseInt(selectedOption.getAttribute('data-term-months'));

        if (!principal || principal <= 0 || !interestRate || !termMonths) {
            document.getElementById('monthlyPaymentDisplay').classList.add('hidden');
            return;
        }

        const monthlyRate = interestRate / 12;
        const M = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths));

        document.getElementById('monthlyPayment').textContent = M.toFixed(2);
        document.getElementById('monthlyPaymentDisplay').classList.remove('hidden');
    }
}

// Initialize the checkout system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutManager();
    // set the fullName and address fields
    const user = localStorage.getItem('username');
    const UserInfo = JSON.parse(localStorage.getItem('userInfo'));
    const orders = JSON.parse(localStorage.getItem('orders'));
    // set fullName and address
    if (UserInfo) {
        document.getElementById('fullName').value = UserInfo.firstName + " " + UserInfo.lastName;
        document.getElementById('addressLine1').value = UserInfo.address;
        // Room 244, 2/F, 21 Yuen Wo Road, Sha Tin, NT, Hong Kong
        // split the address and set the fields
        const address = UserInfo.address.split(", ");
        document.getElementById('district').value = address[3];
        document.getElementById('licenseAddress').value = UserInfo.address;

    }
});

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateStaffNumber() {
    const prefix = 'STF';
    const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${number}`;
}

function generateOrderNumber() {
    const prefix = 'ORD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
}