// auth.js
import { apiRequest, getCookie } from './api.js';

export function isAuthenticated() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || getCookie('token');
    return !!token;
}

export function logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export async function checkToken(token) {
    try {
        const response = await fetch(`${API_URL}login.php?CheckToken=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}