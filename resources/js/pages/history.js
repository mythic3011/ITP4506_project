import {router} from '../router.js';
import {renderNavigation} from '../components/Navigation.js';
import {getCurrentUser} from '../services/auth.js';
import {getCustomerOrders} from '../services/orders.js';
import {formatCurrency, formatDate} from '../utils/formatters.js';
import {renderOrderStatus} from '../components/orders/OrderStatus.js';

export function renderHistory() {
    const user = getCurrentUser();
    const orders = getCustomerOrders(user.id);

    const historyHtml = `
    ${renderNavigation('Order History', true)}
    <main class="main-content">
      <div class="history-container">
        <div class="history-header">
          <h2>Your Orders</h2>
          <p class="text-secondary">${orders.length} total orders</p>
        </div>

        ${orders.length > 0 ? `
          <div class="orders-list">
            ${orders.map(order => `
              <div class="order-card">
                <div class="order-header">
                  <div class="order-info">
                    <h3>${order.orderNumber || `Order #${order.id}`}</h3>
                    <span class="order-date">${formatDate(order.date)}</span>
                  </div>
                  ${renderOrderStatus(order.status)}
                </div>

                <div class="order-details">
                  <div class="vehicle-info">
                    <img src="${order.vehicle.image}" alt="${order.vehicle.make} ${order.vehicle.model}" class="vehicle-thumbnail">
                    <div class="vehicle-details">
                      <h4>${order.vehicle.make} ${order.vehicle.model} ${order.vehicle.year}</h4>
                      <p class="price">${formatCurrency(order.vehicle.price)}</p>
                    </div>
                  </div>

                  <div class="order-progress">
                    ${renderOrderProgress(order)}
                  </div>
                </div>

                <div class="order-actions">
                  <button class="btn btn-secondary" onclick="window.navigate('/orders/${order.id}')">
                    View Details
                  </button>
                  ${order.status === 'pending' ? `
                    <button class="btn btn-primary" onclick="window.navigate('/support')">
                      Contact Support
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3>No Orders Yet</h3>
            <p>Start browsing our vehicles to make your first purchase</p>
            <button class="btn btn-primary" onclick="window.navigate('/vehicles')">
              Browse Vehicles
            </button>
          </div>
        `}
      </div>
    </main>
  `;

    $('#app').html(historyHtml);
}

function renderOrderProgress(order) {
    const steps = [{key: 'pending', label: 'Order Placed'}, {key: 'processing', label: 'Processing'}, {
        key: 'completed',
        label: 'Completed'
    }];

    const currentStep = steps.findIndex(step => step.key === order.status);

    return `
    <div class="progress-tracker">
      ${steps.map((step, index) => `
        <div class="progress-step ${index <= currentStep ? 'completed' : ''} ${order.status === step.key ? 'current' : ''}">
          <div class="step-indicator"></div>
          <span class="step-label">${step.label}</span>
        </div>
        ${index < steps.length - 1 ? '<div class="progress-line"></div>' : ''}
      `).join('')}
    </div>
  `;
}