import { router } from '../router.js';
import { renderNavigation } from '../components/Navigation.js';
import { insuranceTypes, calculateQuote, saveQuote } from '../services/insurance.js';
import { getVehicleById } from '../services/vehicles.js';
import { logout } from '../services/auth.js';
import { showNotification } from '../utils/notifications.js';

export function renderInsurance(vehicleId) {
  const vehicle = getVehicleById(vehicleId);
  
  if (!vehicle) {
    showNotification('Vehicle not found', 'error');
    router.navigate('/vehicles');
    return;
  }

  const insuranceHtml = `
    ${renderNavigation('Insurance Quote', true)}
    <main class="main-content">
      <div class="insurance-container">
        <div class="vehicle-summary">
          <h2>Selected Vehicle</h2>
          <p>${vehicle.make} ${vehicle.model} ${vehicle.year}</p>
          <p>Price: $${vehicle.price.toLocaleString()}</p>
        </div>

        <div class="insurance-options">
          <h2>Insurance Options</h2>
          ${Object.entries(insuranceTypes).map(([type, details]) => `
            <div class="insurance-card">
              <h3>${details.name}</h3>
              <p>${details.description}</p>
              <p class="quote-amount">
                $${calculateQuote(vehicle.price, type).toLocaleString()}/year
              </p>
              <button class="btn btn-primary select-insurance" data-type="${type}">
                Select Plan
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </main>
  `;

  $('#app').html(insuranceHtml);

  $('#backBtn').on('click', () => {
    router.navigate('/vehicles');
  });

  $('#logoutBtn').on('click', () => {
    logout();
    showNotification('You have been logged out');
    router.navigate('/login');
  });

  $('.select-insurance').on('click', function() {
    const type = $(this).data('type');
    const quote = {
      userId: JSON.parse(localStorage.getItem('lml_current_user')).id,
      vehicleId: vehicle.id,
      insuranceType: type,
      amount: calculateQuote(vehicle.price, type),
      date: new Date().toISOString()
    };
    
    saveQuote(quote);
    showNotification('Insurance quote saved successfully! You can view it in your purchase history.');
    router.navigate('/dashboard');
  });
}