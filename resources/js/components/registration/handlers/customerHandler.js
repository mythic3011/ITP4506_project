import { router } from '../../../router.js';
import { registerUser } from '../../../services/auth.js';
import { showNotification } from '../../../utils/notifications.js';
import { validatePassword } from '../../../utils/validation.js';

export async function handleCustomerRegistration(e) {
  e.preventDefault();
  
  if (!$('#customerTerms').is(':checked')) {
    showNotification('Please accept the terms and conditions', 'error');
    return;
  }

  const password = $('#customerPassword').val();
  const confirmPassword = $('#customerConfirmPassword').val();

  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }

  if (!validatePassword(password)) {
    showNotification('Password must be at least 8 characters long', 'error');
    return;
  }

  const customerData = {
    firstName: $('#customerFirstName').val(),
    lastName: $('#customerLastName').val(),
    email: $('#customerEmail').val(),
    phone: $('#customerPhone').val(),
    password,
    role: 'customer'
  };

  try {
    registerUser(customerData);
    showNotification('Registration successful! Please sign in.', 'success');
    router.navigate('/login');
  } catch (error) {
    showNotification(error.message, 'error');
  }
}