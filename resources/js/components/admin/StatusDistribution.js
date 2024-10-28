export function StatusDistribution({ orders = [] }) {
  const statusCounts = orders.reduce((acc, order) => {
    if (!order?.status) return acc;
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0
  });

  return `
    <div class="status-distribution">
      ${Object.entries(statusCounts).map(([status, count]) => `
        <div class="status-stat">
          <span class="status-label ${status}">${status}</span>
          <span class="status-count">${count}</span>
        </div>
      `).join('')}
    </div>
  `;
}