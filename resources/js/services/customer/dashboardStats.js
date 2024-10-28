export function getCustomerStats() {
  const order_data = fetch('/resources/json/orders.json').then(response => response.json());
  const vehicle_data = fetch('/resources/json/vehicles.json').then(response => response.json());
  const quote_data = fetch('/resources/json/quotes.json').then(response => response.json());

  const stats = sumStats(order_data, vehicle_data, quote_data);

  return {
    availableVehicles: stats.availableVehicles,
    totalOrders: stats.totalOrders,
    activeQuotes: stats.activeQuotes
  };
}

function sumStats(order_data, vehicle_data, quote_data) {
  const orders = order_data.orders;
  const vehicles = vehicle_data.vehicles;
  const quotes = quote_data.quotes;

  return {
    availableVehicles: vehicles.filter(v => v.status === 'available').length,
    totalOrders: orders.length,
    activeQuotes: quotes.filter(q => q.status === 'active').length
  };
}