import { initializeVehicles } from './features/vehicles.js';
import { initializeCountdown } from './features/countdown.js';

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeVehicles();
    initializeCountdown();
});