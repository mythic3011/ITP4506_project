export function renderOrderActions(order) {
  return `
    <div class="action-buttons">
      <button class="btn btn-secondary" data-order-id="${order.id}" data-action="view">
        View Details
      </button>
      <button class="btn btn-primary" data-order-id="${order.id}" data-action="update">
        Update Status
      </button>
    </div>
  `;
}