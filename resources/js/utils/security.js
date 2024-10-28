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