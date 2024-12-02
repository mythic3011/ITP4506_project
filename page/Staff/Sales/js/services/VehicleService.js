export class VehicleService {
    constructor() {
        this.vehicles = [];
    }

    async getVehicles() {
        try {
            const response = await fetch('../../resources/json/vehicles.json');
            const data = await response.json();
            this.vehicles = data;
            return data;
        } catch (error) {
            console.error('Error loading vehicles:', error);
            throw new Error('Failed to load vehicles. Please try again later.');
        }
    }

    async getVehicle(id) {
        const vehicle = this.vehicles.find(v => v.id === parseInt(id));
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }
        return vehicle;
    }

    async addVehicle(vehicleData) {
        // In a real application, this would make an API call
        const newVehicle = {
            ...vehicleData,
            id: this.vehicles.length + 1,
            dateAdded: new Date().toISOString()
        };
        this.vehicles.push(newVehicle);
        return newVehicle;
    }

    async updateVehicle(vehicleData) {
        // In a real application, this would make an API call
        const index = this.vehicles.findIndex(v => v.id === parseInt(vehicleData.id));
        if (index === -1) {
            throw new Error('Vehicle not found');
        }
        this.vehicles[index] = { ...this.vehicles[index], ...vehicleData };
        return this.vehicles[index];
    }

    async deleteVehicle(id) {
        // In a real application, this would make an API call
        const index = this.vehicles.findIndex(v => v.id === parseInt(id));
        if (index === -1) {
            throw new Error('Vehicle not found');
        }
        this.vehicles.splice(index, 1);
    }
}