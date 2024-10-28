export function renderUserMenu(user) {
  if (!user) return '';

  return `
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
  `;
}