import { router } from '../../../router.js';
import { registerUser } from '../../../services/auth.js';
import { showNotification } from '../../../utils/notifications.js';
import { validatePassword } from '../../../utils/validation.js';

export async function handleStaffRegistration(e) {
  e.preventDefault();

  if (!$('#staffTerms').is(':checked')) {
    showNotification('Please accept the terms and conditions', 'error');
    return;
  }

  const password = $('#staffPassword').val();
  const confirmPassword = $('#staffConfirmPassword').val();

  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }

  if (!validatePassword(password)) {
    showNotification('Password must be at least 8 characters long', 'error');
    return;
  }

  const staffData = {
    firstName: $('#staffFirstName').val(),
    lastName: $('#staffLastName').val(),
    staffNumber: $('#staffNumber').val(),
    email: $('#staffEmail').val(),
    phone: $('#staffPhone').val(),
    password,
    role: 'staff'
  };

  try {
    await registerUser(staffData);
    showNotification('Registration successful! Please sign in.', 'success');
    router.navigate('/login');
  } catch (error) {
    showNotification(error.message, 'error');
  }
}