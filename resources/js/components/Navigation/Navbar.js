import {renderUserMenu} from './UserMenu.js';
import {renderNavLinks} from './NavLinks.js';
import {renderThemeSwitcher} from '../ThemeSwitcher.js';
import {renderBackButton} from './buttons/BackButton.js';
import {renderHomeButton} from './buttons/HomeButton.js';
import {renderNotificationButton} from './buttons/NotificationButton.js';
import {getCurrentUser} from '../../services/auth.js';
import {initNavigation} from './NavigationHandlers.js';
import {showNotification} from '../../utils/notifications.js';


export function renderNavbar(title, showBackButton = false) {
    const user = getCurrentUser();

    const navbar = `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-left">
          ${showBackButton ? renderBackButton() : ''}
          ${renderHomeButton()}
          <h1 class="navbar-title">${title}</h1>
        </div>

        <div class="navbar-center">
          ${renderNavLinks(user)}
        </div>

        <div class="navbar-right">
          ${renderThemeSwitcher()}
          ${renderNotificationButton()}
          ${renderUserMenu(user)}
        </div>
      </div>
    </nav>
  `;

    // Initialize navigation handlers after rendering
    setTimeout(() => initNavigation(), 0);
    return navbar;
}