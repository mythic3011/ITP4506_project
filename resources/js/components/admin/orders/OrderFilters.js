
export function renderOrderFilters() {
  return `
    <div class="header-controls">
      <div class="search-container">
        <input 
          type="text" 
          id="orderSearch" 
          class="search-input" 
          placeholder="Search orders..."
          aria-label="Search orders"
        >
        <button class="search-button" aria-label="Search">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <select id="statusFilter" class="select-input">
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  `;
}
