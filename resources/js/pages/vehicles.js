import { router } from '../router.js';
import { getVehicles } from '../services/vehicles.js';
import { renderPageLayout, renderEmptyState } from '../components/layout/PageLayout.js';
import { renderVehicleCard } from '../components/vehicles/VehicleCard.js';
import { renderVehicleFilters } from '../components/vehicles/VehicleFilters.js';

export function renderVehicles() {
  const vehicles = getVehicles();
  
  const vehiclesHtml = renderPageLayout({
    title: 'Vehicle Catalog',
    subtitle: 'Browse our premium selection of vehicles',
    showBackButton: true,
    showSearch: true,
    showFilters: true,
    filters: renderVehicleFilters(),
    children: `
      <div class="vehicles-grid" id="vehiclesGrid">
        ${vehicles.map(vehicle => renderVehicleCard(vehicle)).join('')}
      </div>

      <div id="noResults" class="no-results hidden">
        ${renderEmptyState({
          icon: 'empty',
          title: 'No Vehicles Found',
          message: 'Try adjusting your search or filters'
        })}
      </div>
    `
  });

  $('#app').html(vehiclesHtml);
  initVehicleHandlers();
}

function initVehicleHandlers() {
  $('#searchInput').on('input', debounceSearch);
  $('.filter-select').on('change', applyFilters);
  $('.purchase-btn').on('click', function() {
    const vehicleId = $(this).data('vehicle-id');
    router.navigate(`/purchase-request/${vehicleId}`);
  });
}

function debounceSearch() {
  const searchTerm = $('#searchInput').val().toLowerCase();
  const vehicles = getVehicles();
  
  const filtered = vehicles.filter(vehicle => 
    vehicle.make.toLowerCase().includes(searchTerm) ||
    vehicle.model.toLowerCase().includes(searchTerm) ||
    vehicle.year.toString().includes(searchTerm)
  );
  
  updateVehicleDisplay(filtered);
}

function applyFilters() {
  const make = $('#makeFilter').val();
  const priceRange = $('#priceFilter').val();
  const year = $('#yearFilter').val();
  
  const vehicles = getVehicles();
  let filtered = vehicles;

  if (make) {
    filtered = filtered.filter(v => v.make === make);
  }

  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    filtered = filtered.filter(v => v.price >= min && v.price <= max);
  }

  if (year) {
    filtered = filtered.filter(v => v.year.toString() === year);
  }

  updateVehicleDisplay(filtered);
}

function updateVehicleDisplay(vehicles) {
  const noResults = $('#noResults');
  const vehiclesGrid = $('#vehiclesGrid');

  if (vehicles.length === 0) {
    vehiclesGrid.hide();
    noResults.removeClass('hidden');
  } else {
    noResults.addClass('hidden');
    vehiclesGrid.show();
    vehiclesGrid.html(vehicles.map(vehicle => renderVehicleCard(vehicle)).join(''));
  }
}