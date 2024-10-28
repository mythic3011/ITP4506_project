import { router } from '../router.js';
import { showNotification } from '../utils/notifications.js';
import { renderCustomerForm } from '../components/registration/CustomerForm.js';
import { renderStaffForm } from '../components/registration/StaffForm.js';
import { renderTermsModal } from '../components/registration/TermsModal.js';
import { initRegistrationHandlers } from '../components/registration/handlers.js';
import { renderTabs } from '../components/forms/Tabs.js';

export function renderRegister() {
  const registerHtml = `
    <div class="auth-container">
      <div class="auth-box">
        <div class="auth-header">
          <img src="/favicon.svg" alt="Logo" class="auth-logo">
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-subtitle">Join Legend Motor Limited</p>
        </div>

        ${renderTabs({
          id: 'registerTabs',
          tabs: [
            { id: 'customer', label: 'Customer', active: true },
            { id: 'staff', label: 'Staff' }
          ]
        })}

        ${renderCustomerForm()}
        ${renderStaffForm()}

        <div class="auth-footer">
          <p>Already have an account? <button type="button" id="signInBtn" class="text-button">Sign In</button></p>
        </div>
      </div>

      ${renderTermsModal()}
    </div>
  `;

  $('#app').html(registerHtml);
  initRegistrationHandlers();
}