export class OrderRecordModel {
    constructor(orderData) {
        console.log("Order Data:", orderData);
        this.id = orderData.id;
        this.date = new Date(orderData.data);
        this.status = orderData.status;
        this.customer = orderData.customer;
        this.items = orderData.items || []; // Default to an empty array if undefined
        this.discount = orderData.discount || ""; // Default to an empty string if undefined
        this.licensingFee = orderData.licensingFee || 0; // Default to 0 if undefined
        this.tradeInValue = orderData.tradeInValue || 0; // Default to 0 if undefined
        this.financing = orderData.financing || {}; // Default to an empty object if undefined
        this.address = orderData.address || {}; // Default to an empty object if undefined
        this.licensing = orderData.licensing; // Check if necessary, as it's not used in methods
        this.tradeInVehicle = orderData.tradeInVehicle || null; // Explicitly set to null if undefined

        console.log("Initialized Order Record Model:", this);
    }

    getFirstVehicle() {
        const firstVehicle = this.items[0];
        if (firstVehicle) {
            return firstVehicle; // Return the vehicle if it exists
        } else if (this.tradeInVehicle) {
            return this.tradeInVehicle; // Return trade-in vehicle if items are empty
        } else {
            console.warn("No vehicles found in items or trade-in.");
            return null; // Return null if no vehicle exists
        }
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => {
            return total + (item.totalPrice || 0); // Safeguard against undefined totalPrice
        }, 0);
    }

    getFormattedAddress() {
        const addr = this.address;
        return `${addr.fullName || ''}, ${addr.addressLine1 || ''}, ${addr.district || ''}`.trim(); // Safeguard against undefined fields
    }

    getStatusClass() {
        const statusClasses = {
            pending: 'status-pending',
            confirmed: 'status-confirmed',
            processing: 'status-processing',
            completed: 'status-completed'
        };
        return statusClasses[this.status] || 'status-pending';
    }
}