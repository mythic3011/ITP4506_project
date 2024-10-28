import { router } from '../../router.js';
import { logout } from '../../services/auth.js';
import { showNotification } from '../../utils/notifications.js';
import { initTheme } from '../../services/theme.js';

export function initNavigation() {
  // Navigation links
  $('.nav-link').on('click', function() {
    const route = $(this).data('route');
    router.navigate(route);
  });

  // Home button
  $('#homeBtn').on('click', () => router.navigate('/dashboard'));

  // Back button
  $('#backBtn').on('click', () => window.history.back());

  // User menu toggle
  $('#userMenuBtn').on('click', function(e) {
    e.stopPropagation();
    $('#userDropdown').toggleClass('show');
  });

  // Close dropdown when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.user-menu').length) {
      $('#userDropdown').removeClass('show');
    }
  });

  // Notifications
  $('#notificationsBtn').on('click', () => {
    showNotification('No new notifications', 'info');
  });

  // Profile button
  $('#profileBtn').on('click', () => {
    showNotification('Profile settings coming soon', 'info');
    $('#userDropdown').removeClass('show');
  });

  // Logout button
  $('#logoutBtn').on('click', () => {
    logout();
    showNotification('You have been logged out successfully');
    router.navigate('/login');
  });

  // Initialize theme
  initTheme();
}