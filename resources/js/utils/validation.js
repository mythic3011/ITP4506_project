export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone) {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
}

export function validatePassword(password) {
  return password.length >= 8;
}

export function validateVehicleData(vehicle) {
  return {
    isValid: !!(vehicle.make && vehicle.model && vehicle.year && vehicle.price),
    errors: {
      make: !vehicle.make ? 'Make is required' : '',
      model: !vehicle.model ? 'Model is required' : '',
      year: !vehicle.year ? 'Year is required' : '',
      price: !vehicle.price ? 'Price is required' : ''
    }
  };
}