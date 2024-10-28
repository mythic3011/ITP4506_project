export function renderOrderStatus(status) {
  const statusClasses = {
    pending: 'status-pending',
    processing: 'status-processing',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  };

  const statusLabels = {
    pending: 'Order Placed',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  return `
    <span class="status-badge ${statusClasses[status] || 'status-pending'}">
      ${statusLabels[status] || 'Unknown'}
    </span>
  `;
}