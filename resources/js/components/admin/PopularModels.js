export function PopularModels({ orders = [], vehicles = [] }) {
  const modelCounts = orders.reduce((acc, order) => {
    if (!order?.vehicleId) return acc;
    
    const vehicle = vehicles.find(v => v.id === order.vehicleId);
    if (!vehicle?.make || !vehicle?.model) return acc;
    
    const modelKey = `${vehicle.make} ${vehicle.model}`;
    acc[modelKey] = (acc[modelKey] || 0) + 1;
    return acc;
  }, {});

  const sortedModels = Object.entries(modelCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return sortedModels.length ? `
    <div class="popular-models">
      ${sortedModels.map(([model, count]) => `
        <div class="model-stat">
          <span class="model-name">${model}</span>
          <span class="model-count">${count} sales</span>
        </div>
      `).join('')}
    </div>
  ` : '<p class="no-data">No sales data available</p>';
}