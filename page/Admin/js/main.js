import { fetchUsers } from './api.js';
import { validateUser, redirectUser } from './auth.js';
import { showMessage, clearMessage } from './ui.js';
import { DiscountController } from './controllers/DiscountController.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    let users = [];

    // Initialize discount system
    const discountController = new DiscountController();

    // Initialize users data
    fetchUsers()
        .then(data => {
            users = data;
        })
        .catch(error => {
            showMessage(messageDiv, error.message, 'error');
        });

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessage(messageDiv);

        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const user = validateUser(users, email, password);
            showMessage(messageDiv, 'Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                const redirectPath = redirectUser(user);
                window.location.href = redirectPath;
            }, 1500);
        } catch (error) {
            showMessage(messageDiv, error.message, 'error');
        }
    });
});