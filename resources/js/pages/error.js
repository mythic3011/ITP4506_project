import { router } from '../router.js';

export function renderError({ title, message, code = '404', action = null }) {
  const errorHtml = `
    <div class="error-container">
      <div class="error-content">
        <div class="error-code">${code}</div>
        <h1 class="error-title">${title || 'Page Not Found'}</h1>
        <p class="error-message">${message || 'The page you are looking for might have been removed or is temporarily unavailable.'}</p>
        <div class="error-actions">
          ${action || `
            <button class="btn btn-primary" onclick="window.navigate('/')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Back to Home</span>
            </button>
          `}
        </div>
      </div>
    </div>
  `;

  $('#app').html(errorHtml);
}

export function handle404() {
  renderError({
    code: '404',
    title: 'Page Not Found',
    message: 'The page you are looking for might have been removed or is temporarily unavailable.'
  });
}

export function handle403() {
  renderError({
    code: '403',
    title: 'Access Denied',
    message: 'You do not have permission to access this page.',
    action: `
      <button class="btn btn-primary" onclick="window.navigate('/login')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        <span>Sign In</span>
      </button>
    `
  });
}

export function handle500(error) {
  renderError({
    code: '500',
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
    action: `
      <div class="error-actions-group">
        <button class="btn btn-primary" onclick="window.location.reload()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
          </svg>
          <span>Retry</span>
        </button>
        <button class="btn btn-secondary" onclick="window.navigate('/')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Back to Home</span>
        </button>
      </div>
      ${error ? `<div class="error-details">Error: ${error.message}</div>` : ''}
    `
  });
}