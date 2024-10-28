import { fetchJson } from '../utils/fetchJson.js';

const VEHICLES_KEY = 'lml_vehicles';

// Initialize vehicles from JSON file
export async function initVehicles() {
  if (!localStorage.getItem(VEHICLES_KEY)) {
    try {
      const data = await fetchJson('/resources/json/vehicles.json');
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(data.vehicles));
    } catch (error) {
      console.error('Failed to load vehicles data:', error);
      localStorage.setItem(VEHICLES_KEY, JSON.stringify([]));
    }
  }
}

// Get all vehicles
export function getVehicles() {
  return JSON.parse(localStorage.getItem(VEHICLES_KEY) || '[]');
}

// Get vehicle by ID
export function getVehicleById(id) {
  const vehicles = getVehicles();
  return vehicles.find(vehicle => vehicle.id === parseInt(id));
}

// Add new vehicle
export function addVehicle(vehicle) {
  const vehicles = getVehicles();
  const newVehicle = {
    ...vehicle,
    id: Date.now(),
    status: 'available'
  };
  vehicles.push(newVehicle);
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
  return newVehicle;
}

// Update vehicle
export function updateVehicle(id, updates) {
  const vehicles = getVehicles();
  const index = vehicles.findIndex(v => v.id === parseInt(id));
  
  if (index !== -1) {
    vehicles[index] = { ...vehicles[index], ...updates };
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
    return vehicles[index];
  }
  return null;
}

// Delete vehicle
export function deleteVehicle(id) {
  const vehicles = getVehicles();
  const filtered = vehicles.filter(v => v.id !== parseInt(id));
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(filtered));
}

// Search vehicles
export function searchVehicles(query) {
  const vehicles = getVehicles();
  const searchTerm = query.toLowerCase();
  
  return vehicles.filter(vehicle => 
    vehicle.make.toLowerCase().includes(searchTerm) ||
    vehicle.model.toLowerCase().includes(searchTerm) ||
    vehicle.year.toString().includes(searchTerm) ||
    vehicle.specs.engine.toLowerCase().includes(searchTerm) ||
    vehicle.specs.transmission.toLowerCase().includes(searchTerm) ||
    vehicle.specs.color.toLowerCase().includes(searchTerm)
  );
}

// Filter vehicles
export function filterVehicles({ make, minPrice, maxPrice, year, status }) {
  let vehicles = getVehicles();
  
  if (make) {
    vehicles = vehicles.filter(v => v.make === make);
  }
  
  if (minPrice) {
    vehicles = vehicles.filter(v => v.price >= minPrice);
  }
  
  if (maxPrice) {
    vehicles = vehicles.filter(v => v.price <= maxPrice);
  }
  
  if (year) {
    vehicles = vehicles.filter(v => v.year === parseInt(year));
  }
  
  if (status) {
    vehicles = vehicles.filter(v => v.status === status);
  }
  
  return vehicles;
}

// Get unique makes for filtering
export function getUniqueMakes() {
  const vehicles = getVehicles();
  return [...new Set(vehicles.map(v => v.make))].sort();
}

// Get unique years for filtering
export function getUniqueYears() {
  const vehicles = getVehicles();
  return [...new Set(vehicles.map(v => v.year))].sort((a, b) => b - a);
}

// Get price ranges for filtering
export function getPriceRanges() {
  const vehicles = getVehicles();
  const prices = vehicles.map(v => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  
  return {
    min,
    max,
    ranges: [
      { label: 'Under $25,000', min: 0, max: 25000 },
      { label: '$25,000 - $50,000', min: 25000, max: 50000 },
      { label: '$50,000 - $75,000', min: 50000, max: 75000 },
      { label: '$75,000 - $100,000', min: 75000, max: 100000 },
      { label: '$100,000+', min: 100000, max: Infinity }
    ]
  };
}