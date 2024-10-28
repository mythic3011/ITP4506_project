import { fetchJson } from '../utils/fetchJson.js';

const USERS_KEY = 'lml_users';

export async function initUsers() {
  if (!localStorage.getItem(USERS_KEY)) {
    try {
      const data = await fetchJson('/resources/json/users.json');
      localStorage.setItem(USERS_KEY, JSON.stringify(data.users));
    } catch (error) {
      console.error('Failed to load users data:', error);
      // Fallback to basic users if JSON fetch fails
      const basicUsers = [
        {
          id: 1,
          username: "admin",
          password: "admin123",
          role: "admin",
          email: "admin@legendmotor.com"
        },
        {
          id: 2,
          username: "customer",
          password: "customer123",
          role: "customer",
          email: "customer@example.com"
        }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(basicUsers));
    }
  }
}

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

export function getUserById(id) {
  const users = getUsers();
  return users.find(user => user.id === id);
}

export function getUserByUsername(username) {
  const users = getUsers();
  return users.find(user => user.username === username);
}

export function getUserByEmail(email) {
  const users = getUsers();
  return users.find(user => user.email === email);
}

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return user;
}

export function updateUser(id, updates) {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users[index];
  }
  return null;
}

export function updateUserPreferences(id, preferences) {
  const user = getUserById(id);
  if (user) {
    return updateUser(id, {
      preferences: { ...user.preferences, ...preferences }
    });
  }
  return null;
}

export function updateLastLogin(id) {
  return updateUser(id, {
    lastLogin: new Date().toISOString()
  });
}