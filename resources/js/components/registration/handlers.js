import { router } from '../../router.js';
import { registerUser } from '../../services/auth.js';
import { showNotification } from '../../utils/notifications.js';
import { validatePassword } from '../../utils/validation.js';
import { initModal } from '../forms/Modal.js';
import { handleCustomerRegistration } from './handlers/customerHandler.js';
import { handleStaffRegistration } from './handlers/staffHandler.js';

export function initRegistrationHandlers() {
  const termsModal = initModal('termsModal');

  // Tab switching
  $('.tab-button').on('click', function() {
    const tabId = $(this).data('tab');
    $('.tab-button').removeClass('active');
    $(this).addClass('active');
    $('.tab-content').removeClass('active');
    $(`[data-tab="${tabId}"]`).addClass('active');
  });

  // View terms button
  $('#viewTermsBtn').on('click', () => termsModal.show());

  // Customer registration
  $('#customerForm').on('submit', handleCustomerRegistration);

  // Staff registration
  $('#staffForm').on('submit', handleStaffRegistration);

  // Sign in button
  $('#signInBtn').on('click', () => router.navigate('/login'));
}