export function filterOrders(orders, { status, searchTerm }) {
  return orders.filter(order => {
    const matchesStatus = !status || status === 'all' || order.status === status;
    const matchesSearch = !searchTerm || 
      order.orderNumber.toLowerCase().includes(searchTerm) ||
      order.customer.name.toLowerCase().includes(searchTerm) ||
      `${order.vehicle.make} ${order.vehicle.model}`.toLowerCase().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm);
    
    return matchesStatus && matchesSearch;
  });
}

export function getOrderStats(orders) {
  return {
    total: orders.length,
    pending: orders.filter(order => order.status === 'pending').length,
    processing: orders.filter(order => order.status === 'processing').length,
    completed: orders.filter(order => order.status === 'completed').length
  };
}