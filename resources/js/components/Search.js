export function renderSearch({ placeholder = 'Search...', onSearch }) {
  return `
    <div class="search-container">
      <input 
        type="text" 
        class="search-input" 
        placeholder="${placeholder}"
        id="searchInput"
      >
      <button class="search-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
  `;
}

export function initSearch(filterFn) {
  let timeout;
  
  $('#searchInput').on('input', function() {
    const query = $(this).val().toLowerCase();
    
    // Debounce the search
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      filterFn(query);
    }, 300);
  });
}