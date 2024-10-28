import { router } from '../router.js';
import { login, initiatePasswordReset } from '../services/auth.js';
import { showNotification } from '../utils/notifications.js';
import { validateEmail } from '../utils/validation.js';
import { renderFormInput } from '../components/forms/FormInput.js';
import { renderFormCheckbox } from '../components/forms/FormCheckbox.js';
import { renderModal, initModal } from '../components/forms/Modal.js';
import { getIcon } from '../components/icons/index.js';

export function renderLogin() {
  const rememberedUser = localStorage.getItem('lml_remember_user') || '';

  const loginHtml = `
    <div class="auth-container">
      <div class="auth-box">
        <div class="auth-header">
          <img src="/favicon.svg" alt="Logo" class="auth-logo">
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Sign in to your account</p>
        </div>

        <form id="loginForm" class="auth-form">
          ${renderFormInput({
            id: 'username',
            label: 'Username',
            icon: 'user',
            required: true,
            placeholder: 'Enter your username',
            value: rememberedUser
          })}

          <div class="form-group">
            <div class="password-label">
              <label class="form-label" for="password">Password</label>
              <button type="button" id="forgotPasswordBtn" class="text-button">Forgot password?</button>
            </div>
            ${renderFormInput({
              id: 'password',
              type: 'password',
              icon: 'lock',
              rightIcon: 'eye',
              required: true,
              placeholder: 'Enter your password'
            })}
          </div>

          ${renderFormCheckbox({
            id: 'rememberMe',
            label: 'Remember me',
            checked: !!rememberedUser
          })}

          <button type="submit" class="btn btn-primary btn-block">
            <span>Sign In</span>
            ${getIcon('arrowRight')}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <button type="button" id="createAccountBtn" class="text-button">Create one</button></p>
        </div>
      </div>

      ${renderModal({
        id: 'resetModal',
        title: 'Reset Password',
        content: `
          <form id="resetForm">
            ${renderFormInput({
              id: 'resetEmail',
              label: 'Email Address',
              type: 'email',
              icon: 'email',
              required: true,
              placeholder: 'Enter your email address'
            })}
          </form>
        `,
        actions: `
          <button type="button" class="btn btn-secondary modal-close">Cancel</button>
          <button type="submit" form="resetForm" class="btn btn-primary">Send Reset Link</button>
        `
      })}
    </div>
  `;

  $('#app').html(loginHtml);
  initLoginHandlers();
}

function initLoginHandlers() {
  const modal = initModal('resetModal');

  // Login form submission
  $('#loginForm').on('submit', async function(e) {
    e.preventDefault();
    
    const username = $('#username').val().trim();
    const password = $('#password').val();
    const rememberMe = $('#rememberMe').is(':checked');

    if (await handleLogin(username, password, rememberMe)) {
      showNotification('Login successful! Welcome back.');
      router.navigate('/dashboard');
    }
  });

  // Forgot password button
  $('#forgotPasswordBtn').on('click', () => modal.show());

  // Reset form submission
  $('#resetForm').on('submit', async function(e) {
    e.preventDefault();
    
    const email = $('#resetEmail').val().trim();

    if (!validateEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    await handlePasswordReset(email, modal);
  });

  // Create account button
  $('#createAccountBtn').on('click', () => {
    router.navigate('/register');
  });
}

async function handleLogin(username, password, rememberMe) {
  try {
    const isLoggedIn = await login(username, password);
    
    if (isLoggedIn) {
      if (rememberMe) {
        localStorage.setItem('lml_remember_user', username);
      } else {
        localStorage.removeItem('lml_remember_user');
      }
      return true;
    } else {
      showNotification('Invalid username or password', 'error');
      return false;
    }
  } catch (error) {
    showNotification(error.message || 'An error occurred during login.', 'error');
    return false;
  }
}

async function handlePasswordReset(email, modal) {
  try {
    await initiatePasswordReset(email);
    modal.hide();
    showNotification('Password reset instructions have been sent to your email', 'success');
  } catch (error) {
    showNotification(error.message || 'An error occurred while sending the reset link.', 'error');
  }
}
