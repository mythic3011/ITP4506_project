export function renderOrderStats(stats) {
  return `
    <div class="order-stats">
      <div class="stat-item">
        <span class="stat-value">${stats.total}</span>
        <span class="stat-label">Total Orders</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.pending}</span>
        <span class="stat-label">Pending</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.processing}</span>
        <span class="stat-label">Processing</span>
      </div>
    </div>
  `;
}