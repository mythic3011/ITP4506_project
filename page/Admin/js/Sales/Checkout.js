import { DiscountController } from '../controllers/DiscountController.js';
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

        this.discountManager = new DiscountManager(
            new DiscountController(),
            {
                input: document.getElementById('discountCode'),
                applyButton: document.getElementById('applyDiscount'),
                removeButton: document.getElementById('removeDiscount'),
                amountElement: document.getElementById('discountAmount'),
                percentageElement: document.getElementById('discountPercentage')
            }
        );

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
            conditionSelect: document.getElementById('tradeInCondition')
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

        this.addressManager = new AddressManager(
            document.getElementById('checkoutForm')
        );

        this.notificationManager = new NotificationManager(
            document.getElementById('notification-container')
        );
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
        switch(containerId) {
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

    updateTotals() {
        const subtotal = this.calculateSubtotal();
        const discount = this.discountManager.getCurrentDiscount()?.discountAmount || 0;
        const licensingFee = this.licensingManager.getFee();
        const tradeInValue = this.tradeInManager.getValue();

        this.orderSummary.updateTotals(subtotal, discount, licensingFee, tradeInValue);
    }

    calculateSubtotal() {
        return this.wishlistItems.reduce((total, item) => total + Number(item.price), 0);
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

    attachEventListeners() {
        // Handle form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleCheckoutSubmit(e));
        }

        // Handle discount code application
        const applyDiscountBtn = document.getElementById('applyDiscount');
        if (applyDiscountBtn) {
            applyDiscountBtn.addEventListener('click', () => this.handleDiscountApply());
        }
    }

    async handleDiscountApply() {
        try {
            const code = document.getElementById('discountCode').value;
            const subtotal = this.calculateSubtotal();
            const result = await this.discountManager.applyDiscount(code, subtotal);
            this.updateTotals();
            this.notificationManager.show('Discount applied successfully!', 'success');
        } catch (error) {
            this.notificationManager.show(error.message, 'error');
        }
    }

    async handleCheckoutSubmit(e) {
        e.preventDefault();
        
        try {
            if (!this.validateCheckout()) {
                throw new Error('Please complete all required fields');
            }

            const orderData = this.gatherOrderData();
            await this.submitOrder(orderData);
            
            this.notificationManager.show('Order submitted successfully!', 'success');
            window.location.href = '/confirmation';
        } catch (error) {
            this.notificationManager.show(error.message, 'error');
        }
    }

    validateCheckout() {
        return (
            this.licensingManager.validate() &&
            this.tradeInManager.validate() &&
            this.financingManager.validate() &&
            this.addressManager.validate()
        );
    }

    gatherOrderData() {
        return {
            items: this.wishlistItems,
            discount: this.discountManager.getCurrentDiscount(),
            licensingFee: this.licensingManager.getFee(),
            tradeInValue: this.tradeInManager.getValue(),
            financing: this.financingManager.getData(),
            address: this.addressManager.getAddressData()
        };
    }

    async submitOrder(orderData) {
        // Implementation for order submission
        console.log('Submitting order:', orderData);
    }
}

// Initialize the checkout system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutManager();
});