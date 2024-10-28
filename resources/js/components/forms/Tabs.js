export function renderTabs({ id, tabs }) {
  return `
    <div class="tabs" id="${id}">
      <div class="tab-buttons">
        ${tabs.map(tab => `
          <button 
            type="button" 
            class="tab-button ${tab.active ? 'active' : ''}" 
            data-tab="${tab.id}"
          >
            ${tab.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}