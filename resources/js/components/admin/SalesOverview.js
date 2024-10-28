export function SalesOverview({ orders = [] }) {
  const totalSales = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  return `
    <div class="sales-overview">
      <div class="metric">
        <span class="metric-value">${totalSales}</span>
        <span class="metric-label">Total Sales</span>
      </div>
      <div class="metric">
        <span class="metric-value">$${totalRevenue.toLocaleString()}</span>
        <span class="metric-label">Total Revenue</span>
      </div>
      <div class="metric">
        <span class="metric-value">${completedOrders}</span>
        <span class="metric-label">Completed Orders</span>
      </div>
    </div>
  `;
}