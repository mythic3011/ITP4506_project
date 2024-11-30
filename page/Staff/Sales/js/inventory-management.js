import { VehicleService } from './services/VehicleService.js';
import { ModalManager } from './utils/ModalManager.js';
import { ImagePreviewManager } from './utils/ImagePreviewManager.js';
import { FilterManager } from './utils/FilterManager.js';
import { showMessage } from './ui.js';

class InventoryManagementUI {
    constructor() {
        this.vehicleService = new VehicleService();
        this.modalManager = new ModalManager('vehicleModal');
        this.imagePreviewManager = new ImagePreviewManager('images', 'imagePreview');
        this.filterManager = new FilterManager();
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadVehicles();
    }

    initializeElements() {
        // Buttons
        this.addVehicleBtn = document.getElementById('addVehicleBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.logoutBtn = document.getElementById('logoutBtn');

        // Form
        this.vehicleForm = document.getElementById('vehicleForm');

        // Grid
        this.vehicleGrid = document.getElementById('vehicleGrid');

        // Message
        this.messageDiv = document.getElementById('message');
    }

    attachEventListeners() {
        this.addVehicleBtn.addEventListener('click', () => this.openAddVehicleModal());
        this.cancelBtn.addEventListener('click', () => this.modalManager.close());
        this.vehicleForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    async loadVehicles() {
        try {
            const vehicles = await this.vehicleService.getVehicles();
            this.renderVehicleGrid(vehicles);
            this.filterManager.initializeFilters(vehicles);
        } catch (error) {
            showMessage(this.messageDiv, error.message, 'error');
        }
    }

    renderVehicleGrid(vehicles) {
        this.vehicleGrid.innerHTML = vehicles.map(vehicle => `
            <div class="vehicle-card" data-id="${vehicle.id}">
                <img src="${vehicle.images[0].url}" alt="${vehicle.make} ${vehicle.model}" class="vehicle-image">
                <div class="vehicle-info">
                    <h3 class="vehicle-title">${vehicle.make} ${vehicle.model}</h3>
                    <div class="vehicle-specs">
                        <p>${vehicle.year} · ${vehicle.specifications.mileage.value} ${vehicle.specifications.mileage.unit}</p>
                        <p>${vehicle.specifications.engine.type} · ${vehicle.specifications.transmission.type}</p>
                    </div>
                    <div class="vehicle-price">$${vehicle.price.toLocaleString()}</div>
                    <div class="vehicle-actions">
                        <button class="primary-button edit-btn" data-id="${vehicle.id}">Edit</button>
                        <button class="secondary-button delete-btn" data-id="${vehicle.id}">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to edit and delete buttons
        this.vehicleGrid.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => this.editVehicle(btn.dataset.id));
        });

        this.vehicleGrid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => this.deleteVehicle(btn.dataset.id));
        });
    }

    openAddVehicleModal() {
        this.vehicleForm.reset();
        this.imagePreviewManager.clearPreview();
        this.modalManager.open();
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = this.getFormData();
            const images = await this.imagePreviewManager.getUploadedImages();
            formData.images = images;

            if (formData.id) {
                await this.vehicleService.updateVehicle(formData);
                showMessage(this.messageDiv, 'Vehicle updated successfully!', 'success');
            } else {
                await this.vehicleService.addVehicle(formData);
                showMessage(this.messageDiv, 'Vehicle added successfully!', 'success');
            }

            this.modalManager.close();
            this.loadVehicles();
        } catch (error) {
            showMessage(this.messageDiv, error.message, 'error');
        }
    }

    getFormData() {
        return {
            id: this.vehicleForm.dataset.vehicleId,
            make: document.getElementById('make').value,
            model: document.getElementById('model').value,
            modelCode: document.getElementById('modelCode').value,
            manufacturingYear: parseInt(document.getElementById('manufacturingYear').value),
            carType: document.getElementById('carType').value,
            fuelType: document.getElementById('fuelType').value,
            specifications: {
                engine: {
                    type: document.getElementById('engineType').value,
                    cylinderCount: parseInt(document.getElementById('cylinderCount').value),
                    horsepower: parseInt(document.getElementById('horsepower').value),
                    torque: parseInt(document.getElementById('torque').value),
                    drivetrain: document.getElementById('drivetrain').value
                },
                transmission: {
                    type: document.getElementById('transmission').value,
                    gears: parseInt(document.getElementById('gears').value)
                },
                mileage: {
                    value: parseInt(document.getElementById('mileage').value),
                    unit: 'miles'
                },
                safetyRating: parseInt(document.getElementById('safetyRating').value),
                warrantyYears: parseInt(document.getElementById('warrantyYears').value)
            },
            price: parseFloat(document.getElementById('price').value)
        };
    }

    async editVehicle(id) {
        try {
            const vehicle = await this.vehicleService.getVehicle(id);
            this.populateForm(vehicle);
            this.modalManager.open();
        } catch (error) {
            showMessage(this.messageDiv, error.message, 'error');
        }
    }

    populateForm(vehicle) {
        this.vehicleForm.dataset.vehicleId = vehicle.id;
        
        // Basic Information
        document.getElementById('make').value = vehicle.make;
        document.getElementById('model').value = vehicle.model;
        document.getElementById('modelCode').value = vehicle.modelCode;
        document.getElementById('manufacturingYear').value = vehicle.manufacturingYear;
        document.getElementById('carType').value = vehicle.carType;
        document.getElementById('fuelType').value = vehicle.fuelType;

        // Specifications
        document.getElementById('engineType').value = vehicle.specifications.engine.type;
        document.getElementById('cylinderCount').value = vehicle.specifications.engine.cylinderCount;
        document.getElementById('horsepower').value = vehicle.specifications.engine.horsepower;
        document.getElementById('torque').value = vehicle.specifications.engine.torque;
        document.getElementById('drivetrain').value = vehicle.specifications.engine.drivetrain;
        document.getElementById('transmission').value = vehicle.specifications.transmission.type;
        document.getElementById('gears').value = vehicle.specifications.transmission.gears;
        document.getElementById('mileage').value = vehicle.specifications.mileage.value;
        document.getElementById('safetyRating').value = vehicle.specifications.safetyRating;
        document.getElementById('warrantyYears').value = vehicle.specifications.warrantyYears;

        // Price
        document.getElementById('price').value = vehicle.price;

        // Images
        this.imagePreviewManager.showExistingImages(vehicle.images);
    }

    async deleteVehicle(id) {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await this.vehicleService.deleteVehicle(id);
                showMessage(this.messageDiv, 'Vehicle deleted successfully!', 'success');
                this.loadVehicles();
            } catch (error) {
                showMessage(this.messageDiv, error.message, 'error');
            }
        }
    }
}

// Initialize the UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InventoryManagementUI();
});