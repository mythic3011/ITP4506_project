import { getUserByUsername, getUserByEmail, addUser, updateLastLogin, initUsers } from './users.js';
import { validateEmail, validatePassword } from '../utils/validation.js';
import { generateId } from '../utils/generators.js';
import { showNotification } from '../utils/notifications.js';

const CURRENT_USER_KEY = 'lml_current_user';

export async function initAuth() {
  try {
    await initUsers();
  } catch (error) {
    console.error('Error initializing auth:', error);
    showNotification('Error initializing authentication', 'error');
  }
}

export function login(username, password) {
  const user = getUserByUsername(username);
  
  if (user && user.password === password) {
    // Update last login time
    updateLastLogin(user.id);
    
    // Store minimal user info in session
    const sessionUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      preferences: user.preferences
    };
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isAuthenticated() {
  return !!localStorage.getItem(CURRENT_USER_KEY);
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

export function registerUser({ 
  username, 
  password, 
  email, 
  firstName, 
  lastName, 
  phone, 
  role = 'customer',
  staffNumber = null,
  termsAccepted = false 
}) {
  // Validate required fields
  if (!username || !password || !email || !firstName || !lastName) {
    throw new Error('All required fields must be filled');
  }

  // Validate email format
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Validate password strength
  if (!validatePassword(password)) {
    throw new Error('Password must be at least 8 characters long');
  }

  // Check if username exists
  if (getUserByUsername(username)) {
    throw new Error('Username already exists');
  }

  // Check if email exists
  if (getUserByEmail(email)) {
    throw new Error('Email already registered');
  }

  // Validate staff registration
  if (role === 'staff' && !staffNumber) {
    throw new Error('Staff number is required for staff registration');
  }

  // Validate terms acceptance
  if (!termsAccepted) {
    throw new Error('You must accept the terms and conditions');
  }

  // Create new user
  const newUser = {
    id: generateId(),
    username,
    password,
    email,
    firstName,
    lastName,
    phone,
    role,
    staffNumber,
    createdAt: new Date().toISOString(),
    lastLogin: null,
    preferences: {
      theme: 'system',
      notifications: true
    },
    termsAccepted: true,
    termsAcceptedAt: new Date().toISOString()
  };

  // Add user to storage
  addUser(newUser);

  return true;
}

export function hasPermission(permission) {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  // Check specific permissions
  const fullUser = getUserByUsername(user.username);
  return fullUser?.permissions?.includes(permission) || false;
}

export async function initiatePasswordReset(email) {
  const user = getUserByEmail(email);
  if (!user) {
    throw new Error('No account found with this email address');
  }

  return true;
}

export function resetPassword(token, newPassword) {
  throw new Error('Password reset not implemented in demo');
}