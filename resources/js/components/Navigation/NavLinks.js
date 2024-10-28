import { getCustomerLinks } from './links/CustomerLinks.js';
import { getAdminLinks } from './links/AdminLinks.js';

export function renderNavLinks(user) {
  if (!user) return '';
  
  const links = user.role === 'admin' ? getAdminLinks() : getCustomerLinks();
  
  return `
    <div class="nav-links">
      ${links.map(link => `
        <button class="nav-link" data-route="${link.route}">
          ${link.icon}
          ${link.label}
        </button>
      `).join('')}
    </div>
  `;
}