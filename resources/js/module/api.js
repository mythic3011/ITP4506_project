// api.js - API request function

// const API_URL = '../../../resources/php/profile_api.php';
// const API_URL = '../../../resources/php/login.php';
// const API_URL = '../../../resources/php/ManageItem.php';

export async function apiRequest(API_URL, action, data = {}) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || getCookie('token');
    const csrfToken = getCookie('csrf_token');

    try {
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': csrfToken,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ...data, csrf_token: csrfToken })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}