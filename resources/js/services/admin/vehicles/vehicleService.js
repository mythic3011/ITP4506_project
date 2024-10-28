import { 
  getVehicles, 
  getVehicleById, 
  addVehicle, 
  updateVehicle, 
  deleteVehicle,
  searchVehicles,
  filterVehicles 
} from '../../vehicles.js';

// Admin-specific vehicle operations
export function getVehicleInventoryStats() {
  const vehicles = getVehicles();
  return {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    reserved: vehicles.filter(v => v.status === 'reserved').length,
    sold: vehicles.filter(v => v.status === 'sold').length
  };
}

export function updateVehicleStatus(id, status) {
  return updateVehicle(id, { status });
}

export {
  getVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
  filterVehicles
};