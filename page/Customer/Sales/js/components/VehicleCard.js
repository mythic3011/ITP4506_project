import { createElement } from '../utils/dom.js';

export function createVehicleCard(vehicle) {
    const card = createElement('div', 'vehicle-card');
    card.innerHTML = `
        <img src="${vehicle.image}" alt="${vehicle.name}" class="vehicle-image">
        <div class="vehicle-content bg-white rounded-lg shadow-md p-6">
            <h3 class="vehicle-title">${vehicle.name}</h3>
            <p class="vehicle-description">${vehicle.description}</p>
            <a href="TestDrive.html?id=${vehicle.id}" class="button button-primary bg-blue-500 text-white px-4 py-2 rounded-lg">Book a Test Drive</a>
        </div>
    `;
    return card;
}