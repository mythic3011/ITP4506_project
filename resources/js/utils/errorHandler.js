import { handle404, handle403, handle500 } from '../pages/error.js';
import { showNotification } from './notifications.js';
import { isAuthenticated } from '../services/auth.js';

export function handleError(error) {
  console.error('Error:', error);

  if (error.name === 'AuthenticationError') {
    showNotification('Please sign in to continue', 'error');
    handle403();
    return;
  }

  if (error.name === 'NotFoundError') {
    handle404();
    return;
  }

  if (error.name === 'NetworkError') {
    showNotification('Network error. Please check your connection.', 'error');
    return;
  }

  handle500(error);
}

export function requireAuth(callback) {
  return (...args) => {
    if (!isAuthenticated()) {
      handle403();
      return;
    }
    return callback(...args);
  };
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error') {
    super(message);
    this.name = 'NetworkError';
  }
}