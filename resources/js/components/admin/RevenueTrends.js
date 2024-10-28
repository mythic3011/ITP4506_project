export function RevenueTrends({ orders = [] }) {
  const monthlyRevenue = orders.reduce((acc, order) => {
    if (!order?.date || !order?.total) return acc;
    
    const date = new Date(order.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    acc[monthKey] = (acc[monthKey] || 0) + Number(order.total);
    return acc;
  }, {});

  const sortedMonths = Object.entries(monthlyRevenue)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6);

  const maxRevenue = Math.max(...Object.values(monthlyRevenue), 1);

  return sortedMonths.length ? `
    <div class="revenue-trends">
      ${sortedMonths.map(([month, revenue]) => `
        <div class="trend-bar">
          <div class="bar-fill" style="height: ${(revenue / maxRevenue * 100)}%"></div>
          <span class="month-label">${month}</span>
          <span class="revenue-label">$${revenue.toLocaleString()}</span>
        </div>
      `).join('')}
    </div>
  ` : '<p class="no-data">No revenue data available</p>';
}