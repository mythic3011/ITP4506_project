// Notifications.js
function showNotification(message, type = 'success') {
    const notificationContainer = $('#notification-container');

    function getNotificationIcon(type) {
        switch (type) {
            case 'success':
                return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
            case 'error':
                return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>';
            default:
                return '';
        }
    }

    function getNotificationTypeClass(type) {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
            default:
                return '';
        }
    }

    // Create notification element
    const notification = $(`
        <div class='notification ${type} p-4 mb-4 rounded shadow-md ${getNotificationTypeClass(type)}'>
        <div class='flex items-center justify-between'>
            ${getNotificationIcon(type)}
            <p class='text-sm font-bold'>${message}</p>
            </div>
        </div>
    `);

    // Append notification to container
    notificationContainer.append(notification);

    // Automatically remove notification after 3 seconds
    setTimeout(() => {
        notification.fadeOut(300, () => {
            notification.remove();
        });
    }, 3000);
}

$(document).ready(function () {
    if (!isAuthenticated()) {
        //redirectTo('../../../index.html');
    } else if (!isAuthorized()) {
        //redirectTo('../../../error/403.html');
    } else if (!isAdmin()) {
        //redirectTo('../../../page/admin/dashboard.html');
    } else {
    }
    initNotifications();
});

function isAuthenticated() {
    return true;
}

function isAuthorized() {
    return getCurrentUser().role === 'customer';
}

function isAdmin() {
    return getCurrentUser().role === 'admin';
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('lml_current_user')) || {};
}

function getCookie(name) {
    return document.cookie.split(';').map(cookie => cookie.trim().split('=')).find(cookie => cookie[0] === name)?.[1] || null;
}

function initNotifications() {
    const notifications = getNotifications();
    notifications.forEach(notification => showNotification(notification.message, notification.type));
    localStorage.removeItem('lml_notifications');
}

function getNotifications() {
    return JSON.parse(localStorage.getItem('lml_notifications')) || [];
}

function redirectTo(url) {
    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', initNotifications);