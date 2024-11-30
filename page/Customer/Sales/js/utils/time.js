// Time utility functions
export function formatTime(days, hours, minutes, seconds) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function calculateTimeRemaining(targetDate) {
    const now = new Date().getTime();
    const distance = targetDate - now;

    return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        distance
    };
}