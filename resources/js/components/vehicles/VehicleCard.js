export function renderVehicleCard(vehicle) {
  return `
    <div class="vehicle-card">
      <div class="vehicle-image">
        <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
        <div class="vehicle-badge ${vehicle.status}">${vehicle.status}</div>
      </div>
      
      <div class="vehicle-content">
        <div class="vehicle-header">
          <h3>${vehicle.make} ${vehicle.model}</h3>
          <span class="vehicle-year">${vehicle.year}</span>
        </div>
        
        <div class="vehicle-price">
          <span class="currency">$</span>
          <span class="amount">${vehicle.price.toLocaleString()}</span>
        </div>
        
        <div class="vehicle-specs">
          <div class="spec">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            <span>${vehicle.specs.engine}</span>
          </div>
          <div class="spec">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span>${vehicle.specs.transmission}</span>
          </div>
          <div class="spec">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2v10l4.5 4.5"/>
            </svg>
            <span>${vehicle.specs.mileage}</span>
          </div>
        </div>
        
        <button class="btn btn-primary purchase-btn" data-vehicle-id="${vehicle.id}">
          Request Purchase
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}