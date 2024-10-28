import { router } from '../../router.js';
import { renderNavigation } from '../../components/Navigation.js';
import { renderSearch, initSearch } from '../../components/Search.js';
import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from '../../services/vehicles.js';
import { showNotification } from '../../utils/notifications.js';

export function renderVehicleManagement() {
  const vehicles = getVehicles();

  const vehiclesHtml = `
    ${renderNavigation('Vehicle Management', true)}
    <main class="main-content">
      <div class="page-header">
        <div class="header-left">
          <h2 class="page-title">Vehicle Inventory</h2>
          <div class="inventory-stats">
            <span class="stat-item">Total Vehicles: ${vehicles.length}</span>
          </div>
        </div>
        <div class="header-controls">
          ${renderSearch({ placeholder: 'Search vehicles...' })}
          <select id="makeFilter" class="select-input">
            <option value="">All Makes</option>
            ${[...new Set(vehicles.map(v => v.make))].map(make => 
              `<option value="${make}">${make}</option>`
            ).join('')}
          </select>
          <select id="yearFilter" class="select-input">
            <option value="">All Years</option>
            ${[...new Set(vehicles.map(v => v.year))].sort().map(year => 
              `<option value="${year}">${year}</option>`
            ).join('')}
          </select>
          <button id="addVehicleBtn" class="btn btn-primary">Add Vehicle</button>
        </div>
      </div>

      <div class="vehicles-grid" id="vehiclesGrid">
        ${renderVehiclesList(vehicles)}
      </div>
    </main>
  `;

  $('#app').html(vehiclesHtml);

  // Initialize event handlers
  initEventHandlers(vehicles);
}

function initEventHandlers(vehicles) {
  let editingVehicleId = null;

  // Search functionality
  initSearch((query) => {
    const filtered = vehicles.filter(vehicle => 
      vehicle.make.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query) ||
      vehicle.specs.engine.toLowerCase().includes(query) ||
      vehicle.specs.transmission.toLowerCase().includes(query) ||
      vehicle.specs.color.toLowerCase().includes(query)
    );
    $('#vehiclesGrid').html(renderVehiclesList(filtered));
  });

  // Filter handlers
  $('#makeFilter, #yearFilter').on('change', function() {
    const make = $('#makeFilter').val();
    const year = $('#yearFilter').val();
    
    const filtered = vehicles.filter(vehicle => 
      (!make || vehicle.make === make) &&
      (!year || vehicle.year.toString() === year)
    );
    
    $('#vehiclesGrid').html(renderVehiclesList(filtered));
  });

  // Add vehicle button
  $('#addVehicleBtn').on('click', () => {
    editingVehicleId = null;
    showVehicleModal();
  });

  // Edit vehicle button
  $(document).on('click', '.edit-vehicle', function() {
    const vehicleId = $(this).data('vehicle-id');
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      editingVehicleId = vehicleId;
      showVehicleModal(vehicle);
    }
  });

  // Delete vehicle button
  $(document).on('click', '.delete-vehicle', function() {
    const vehicleId = $(this).data('vehicle-id');
    if (confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicle(vehicleId);
      showNotification('Vehicle deleted successfully');
      renderVehicleManagement();
    }
  });

  // Form submission
  $('#vehicleForm').on('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      make: $('#make').val(),
      model: $('#model').val(),
      year: parseInt($('#year').val()),
      price: parseFloat($('#price').val()),
      image: $('#image').val(),
      specs: {
        engine: $('#engine').val(),
        transmission: $('#transmission').val(),
        mileage: $('#mileage').val(),
        color: $('#color').val()
      }
    };

    if (editingVehicleId) {
      updateVehicle(editingVehicleId, formData);
      showNotification('Vehicle updated successfully');
    } else {
      addVehicle(formData);
      showNotification('Vehicle added successfully');
    }

    hideVehicleModal();
    renderVehicleManagement();
  });
}

function renderVehiclesList(vehicles) {
  return vehicles.length ? vehicles.map(vehicle => `
    <div class="vehicle-card">
      <div class="vehicle-image-container">
        <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}" class="vehicle-image">
        <div class="vehicle-actions">
          <button class="btn btn-icon edit-vehicle" data-vehicle-id="${vehicle.id}">Edit</button>
          <button class="btn btn-icon delete-vehicle" data-vehicle-id="${vehicle.id}">Delete</button>
        </div>
      </div>
      <div class="vehicle-details">
        <div class="vehicle-header">
          <h3>${vehicle.make} ${vehicle.model}</h3>
          <span class="vehicle-year">${vehicle.year}</span>
        </div>
        <div class="vehicle-price">$${vehicle.price.toLocaleString()}</div>
        <div class="vehicle-specs">
          <div class="spec-item">
            <span class="spec-label">Engine:</span>
            <span class="spec-value">${vehicle.specs.engine}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Transmission:</span>
            <span class="spec-value">${vehicle.specs.transmission}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Mileage:</span>
            <span class="spec-value">${vehicle.specs.mileage}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Color:</span>
            <span class="spec-value">${vehicle.specs.color}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('') : `
    <div class="no-vehicles">
      <p>No vehicles found</p>
    </div>
  `;
}

function showVehicleModal(vehicle = null) {
  const modalHtml = `
    <div id="vehicleModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>${vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <form id="vehicleForm">
          <div class="form-grid">
            <div class="form-group">
              <label for="make">Make</label>
              <input type="text" id="make" required value="${vehicle?.make || ''}">
            </div>
            <div class="form-group">
              <label for="model">Model</label>
              <input type="text" id="model" required value="${vehicle?.model || ''}">
            </div>
            <div class="form-group">
              <label for="year">Year</label>
              <input type="number" id="year" required value="${vehicle?.year || ''}">
            </div>
            <div class="form-group">
              <label for="price">Price</label>
              <input type="number" id="price" required value="${vehicle?.price || ''}">
            </div>
            <div class="form-group">
              <label for="image">Image URL</label>
              <input type="url" id="image" required value="${vehicle?.image || ''}">
            </div>
            <div class="form-group">
              <label for="engine">Engine</label>
              <input type="text" id="engine" required value="${vehicle?.specs?.engine || ''}">
            </div>
            <div class="form-group">
              <label for="transmission">Transmission</label>
              <input type="text" id="transmission" required value="${vehicle?.specs?.transmission || ''}">
            </div>
            <div class="form-group">
              <label for="mileage">Mileage</label>
              <input type="text" id="mileage" required value="${vehicle?.specs?.mileage || ''}">
            </div>
            <div class="form-group">
              <label for="color">Color</label>
              <input type="text" id="color" required value="${vehicle?.specs?.color || ''}">
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary modal-close">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Vehicle</button>
          </div>
        </form>
      </div>
    </div>
  `;

  $('body').append(modalHtml);
  $('#vehicleModal').addClass('show');

  $('.modal-close').on('click', hideVehicleModal);
  $(window).on('click', function(e) {
    if ($(e.target).is('#vehicleModal')) {
      hideVehicleModal();
    }
  });
}

function hideVehicleModal() {
  $('#vehicleModal').removeClass('show').remove();
}