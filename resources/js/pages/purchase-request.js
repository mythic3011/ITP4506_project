import { router } from '../router.js';
import { getVehicleById } from '../services/vehicles.js';
import { getCurrentUser } from '../services/auth.js';
import { createPurchaseRequest } from '../services/purchases.js';
import { formatCurrency } from '../utils/formatters.js';
import { showNotification } from '../utils/notifications.js';
import { renderPageLayout, renderEmptyState } from '../components/layout/PageLayout.js';

export function renderPurchaseRequest(vehicleId) {
  const vehicle = getVehicleById(vehicleId);
  
  if (!vehicle) {
    router.navigate('/vehicles');
    showNotification('Vehicle not found', 'error');
    return;
  }

  const purchaseHtml = renderPageLayout({
    title: 'Purchase Request',
    showBackButton: true,
    children: `
      <div class="purchase-container">
        <div class="vehicle-summary">
          <div class="vehicle-image">
            <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
          </div>
          <div class="vehicle-info">
            <h2>${vehicle.make} ${vehicle.model} ${vehicle.year}</h2>
            <div class="price">${formatCurrency(vehicle.price)}</div>
            <div class="specs">
              <div class="spec-item">
                <span class="label">Engine:</span>
                <span class="value">${vehicle.specs.engine}</span>
              </div>
              <div class="spec-item">
                <span class="label">Transmission:</span>
                <span class="value">${vehicle.specs.transmission}</span>
              </div>
              <div class="spec-item">
                <span class="label">Color:</span>
                <span class="value">${vehicle.specs.color}</span>
              </div>
            </div>
          </div>
        </div>

        <form id="purchaseForm" class="purchase-form">
          <h3>Purchase Options</h3>
          
          <div class="form-group">
            <label for="paymentType">Payment Method</label>
            <select id="paymentType" required>
              <option value="">Select payment method</option>
              <option value="cash">Cash</option>
              <option value="financing">Financing</option>
              <option value="lease">Lease</option>
            </select>
          </div>

          <div id="financingOptions" class="form-group hidden">
            <label for="downPayment">Down Payment</label>
            <input type="number" id="downPayment" min="0" max="${vehicle.price}">
            <div class="help-text">Minimum 20% down payment required for financing</div>
          </div>

          <div class="form-group">
            <label for="preferredDelivery">Preferred Delivery Date</label>
            <input type="date" id="preferredDelivery" required min="${new Date().toISOString().split('T')[0]}">
          </div>

          <div class="form-group">
            <label for="comments">Additional Comments</label>
            <textarea id="comments" rows="4" placeholder="Any special requests or questions?"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="window.history.back()">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Submit Purchase Request
            </button>
          </div>
        </form>
      </div>
    `
  });

  $('#app').html(purchaseHtml);
  initPurchaseHandlers(vehicle);
}

function initPurchaseHandlers(vehicle) {
  const form = $('#purchaseForm');
  const financingOptions = $('#financingOptions');
  
  $('#paymentType').on('change', function() {
    const showFinancing = $(this).val() === 'financing';
    financingOptions.toggleClass('hidden', !showFinancing);
    
    if (showFinancing) {
      const minDownPayment = vehicle.price * 0.2;
      $('#downPayment').attr('min', minDownPayment);
      $('#downPayment').attr('placeholder', `Minimum ${formatCurrency(minDownPayment)}`);
    }
  });

  form.on('submit', async function(e) {
    e.preventDefault();
    
    const purchaseData = {
      vehicleId: vehicle.id,
      userId: getCurrentUser().id,
      paymentType: $('#paymentType').val(),
      downPayment: $('#downPayment').val() || null,
      preferredDelivery: $('#preferredDelivery').val(),
      comments: $('#comments').val(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await createPurchaseRequest(purchaseData);
      showNotification('Purchase request submitted successfully!', 'success');
      router.navigate('/dashboard');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });
}