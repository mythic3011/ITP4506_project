import { formatCurrency } from '../../../utils/formatters.js';

export function renderVehicleInfo(vehicle) {
  if (!vehicle) return '';

  return `
    <div class="vehicle-info info-section">
      <h4>Vehicle Details</h4>
      <p><strong>Make:</strong> ${vehicle.make}</p>
      <p><strong>Model:</strong> ${vehicle.model}</p>
      <p><strong>Year:</strong> ${vehicle.year}</p>
      <p><strong>Price:</strong> ${formatCurrency(vehicle.price)}</p>
    </div>
  `;
}