export function validateDiscountCode(code) {
    if (!code || typeof code !== 'string') {
        throw new Error('Invalid discount code format');
    }

    // Remove whitespace and convert to uppercase
    code = code.trim().toUpperCase();

    // Check if code matches pattern (letters, numbers, and hyphens only)
    if (!/^[A-Z0-9-]+$/.test(code)) {
        throw new Error('Discount code can only contain letters, numbers, and hyphens');
    }

    return code;
}

export function validateAmount(amount) {
    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount) || parsedAmount < 0) {
        throw new Error('Invalid amount');
    }

    return parsedAmount;
}