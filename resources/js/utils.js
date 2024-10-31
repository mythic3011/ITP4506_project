export function filterByStatus(items, status) {
    return items.filter(item => item.status === status);
}

export function filterByDateRange(items, startDate, endDate, dateKey = 'date') {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return items.filter(item => {
        const itemDate = new Date(item[dateKey]);
        return itemDate >= start && itemDate <= end;
    });
}

export function filterByPrice(items, minPrice, maxPrice, priceKey = 'price') {
    return items.filter(item => {
        const price = Number(item[priceKey]);
        return price >= minPrice && price <= maxPrice;
    });
}

export function searchItems(items, query, keys) {
    const searchTerm = query.toLowerCase();

    return items.filter(item => keys.some(key => {
        const value = item[key];
        return value && value.toString().toLowerCase().includes(searchTerm);
    }));
}

export function formatCurrency(amount, currency = 'HKD') {
    return new Intl.NumberFormat('en-HK', {
        style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(amount);
}

export function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    };

    return new Date(date).toLocaleString('en-US', {...defaultOptions, ...options});
}

export function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

export function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function generateStaffNumber() {
    const prefix = 'STF';
    const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${number}`;
}

export function generateOrderNumber() {
    const prefix = 'ORD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
}

export function generateResetToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function verifyResetToken(token, tokenData) {
    if (!tokenData || !tokenData.expires) {
        return false;
    }

    return Date.now() < tokenData.expires;
}

export function hashPassword(password) {
    // In a real application, use proper password hashing
    // This is a simplified version for demo purposes
    return btoa(password);
}

export function sortByDate(array, key, ascending = false) {
    return [...array].sort((a, b) => {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return ascending ? dateA - dateB : dateB - dateA;
    });
}

export function sortByString(array, key, ascending = true) {
    return [...array].sort((a, b) => {
        const valueA = a[key].toLowerCase();
        const valueB = b[key].toLowerCase();
        return ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
}

export function sortByNumber(array, key, ascending = true) {
    return [...array].sort((a, b) => {
        return ascending ? a[key] - b[key] : b[key] - a[key];
    });
}

export function getItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
}

export function setItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
        return false;
    }
}

export function removeItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
        return false;
    }
}

export function clearStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

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
        isValid: !!(vehicle.make && vehicle.model && vehicle.year && vehicle.price), errors: {
            make: !vehicle.make ? 'Make is required' : '',
            model: !vehicle.model ? 'Model is required' : '',
            year: !vehicle.year ? 'Year is required' : '',
            price: !vehicle.price ? 'Price is required' : ''
        }
    };
}