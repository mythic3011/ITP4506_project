import { renderThemeSwitcher } from './ThemeSwitcher.js';
import { getCurrentUser } from '../services/auth.js';

export function renderNavigation(title, showBackButton = false) {
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  return `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-left">
          ${showBackButton ? `
            <button id="backBtn" class="nav-btn" title="Go back">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          ` : ''}
          
          <button id="homeBtn" class="nav-btn" title="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </button>

          <h1 class="navbar-title">${title}</h1>
        </div>

        <div class="navbar-center">
          ${isAdmin ? `
            <div class="nav-links">
              <button class="nav-link" data-route="/admin/vehicles">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                  <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/>
                  <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6"/>
                </svg>
                Vehicles
              </button>
              <button class="nav-link" data-route="/admin/orders">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 17h6"/>
                  <path d="M9 13h6"/>
                  <path d="M12 3L4 10v11h16V10L12 3z"/>
                </svg>
                Orders
              </button>
              <button class="nav-link" data-route="/admin/inquiries">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Inquiries
              </button>
              <button class="nav-link" data-route="/admin/analytics">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                </svg>
                Analytics
              </button>
            </div>
          ` : ''}
        </div>

        <div class="navbar-right">
          ${renderThemeSwitcher()}

          <button id="notificationsBtn" class="nav-btn" title="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="notification-badge">3</span>
          </button>

          <div class="user-menu">
            <button id="userMenuBtn" class="user-menu-btn">
              <span class="user-avatar">${user.username.charAt(0).toUpperCase()}</span>
              <span class="user-name">${user.username}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            <div class="user-dropdown" id="userDropdown">
              <div class="dropdown-header">
                <strong>${user.username}</strong>
                <span class="user-role">${user.role}</span>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" id="profileBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Profile Settings
              </button>
              <button class="dropdown-item" id="logoutBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;
}