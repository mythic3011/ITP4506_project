import { getElement } from '../utils/dom.js';
import { formatTime, calculateTimeRemaining } from '../utils/time.js';

export function initializeCountdown() {
    const countdownElement = getElement('#countdown');
    const targetDate = new Date().getTime() + 86400000; // 24 hours from now

    function updateCountdown() {
        const timeRemaining = calculateTimeRemaining(targetDate);
        
        if (timeRemaining.distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = "EXPIRED";
            return;
        }

        countdownElement.textContent = formatTime(
            timeRemaining.days,
            timeRemaining.hours,
            timeRemaining.minutes,
            timeRemaining.seconds
        );
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
}