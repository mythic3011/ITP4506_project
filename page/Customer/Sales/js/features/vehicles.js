import { getElement } from '../utils/dom.js';
import { vehicles } from '../data/vehicles.js';
import { createVehicleCard } from '../components/VehicleCard.js';

export function initializeVehicles() {
    const vehiclesGrid = getElement('#vehicles-grid');
    vehicles.forEach(vehicle => {
        const card = createVehicleCard(vehicle);
        vehiclesGrid.appendChild(card);
    });
}