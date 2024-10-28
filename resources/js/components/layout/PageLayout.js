import { renderNavigation } from '../Navigation.js';
import { renderSearch } from '../Search.js';

let isLoading = false;

// Function to render page layout
export function renderPageLayout({ 
  title, 
  subtitle = '', 
  showBackButton = false, 
  showSearch = false,
  showFilters = false,
  filters = null,
  children = ''
}) {
  // Hide loading state if content is ready
  if (isLoading) {
    setLoadingState(false);
  }

  return `
    ${renderNavigation(title, showBackButton)}
    <main class="main-content">
      <div class="page-header">
        <div class="header-content">
          <h2 class="page-title">${title}</h2>
          ${subtitle ? `<p class="page-subtitle">${subtitle}</p>` : ''}
        </div>
        ${showSearch || showFilters ? `
          <div class="header-controls">
            ${showSearch ? renderSearch({ placeholder: `Search ${title.toLowerCase()}...` }) : ''}
            ${showFilters && filters ? filters : ''}
          </div>
        ` : ''}
      </div>
      ${children}
    </main>
  `;
}

// Function to render empty state
export function renderEmptyState({ 
  icon = 'search',
  title = 'No Results Found',
  message = 'Try adjusting your search or filters'
}) {
  const icons = {
    search: `
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    `,
    empty: `
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    `,
    error: `
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    `
  };

  return `
    <div class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${icons[icon] || icons.empty}
      </svg>
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `;
}

// Function to render loading state
export function renderLoadingState() {
  if (!isLoading) return ''; // Return empty if not loading
  
  return `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `;
}

// Function to set loading state
export function setLoadingState(loading) {
  isLoading = loading;
}
