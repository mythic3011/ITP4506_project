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