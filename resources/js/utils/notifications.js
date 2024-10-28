let notificationTimeout;

export function showNotification(message, type = 'info') {
  // Remove existing notification
  $('.notification').remove();
  clearTimeout(notificationTimeout);

  // Create new notification
  const notification = $(`
    <div class="notification ${type}">
      <div class="notification-content">
        ${message}
      </div>
    </div>
  `);

  // Add to body
  $('body').append(notification);

  // Animate in
  setTimeout(() => {
    notification.addClass('show');
  }, 100);

  // Auto remove after 3 seconds
  notificationTimeout = setTimeout(() => {
    notification.removeClass('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}