import {formatCurrency, formatDate} from '../../../utils/formatters.js';
import {renderCustomerInfo} from './CustomerInfo.js';
import {renderVehicleInfo} from './VehicleInfo.js';
import {renderPaymentInfo} from './PaymentInfo.js';
import {renderOrderProgress} from './OrderProgress.js';
import {renderOrderActions} from './OrderActions.js';

export function initOrderListeners() {
    $('#viewToggle').on('click', function () {
        $('#ordersContainer').toggleClass('grid-view list-view');
        $(this).find('svg').toggleClass('hidden');
    });
}

export function renderOrderList(orders) {
    if (!orders || orders.length === 0) {
        return `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>No Orders Found</h3>
        <p>There are no orders to display at this time.</p>
      </div>
    `;
    }

    return `
    <div class="orders-container grid-view" id="ordersContainer">
      ${orders.map(order => renderOrderCard(order)).join('')}
    </div>
  `;
}

function renderOrderCard(order) {
    if (!order) return '';

    return `
    <div class="order-card ${order.status || 'pending'}">
      <div class="order-header">
        <div class="order-id">
          <div class="order-number">
            <h3>${order.orderNumber || `Order #${order.id}`}</h3>
            <span class="status-badge ${order.status}">${order.status || 'pending'}</span>
          </div>
          <span class="order-date">${formatDate(order.date)}</span>
        </div>
        <div class="quick-actions">
          <button class="btn btn-icon" title="Print Order" data-order-id="${order.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
          </button>
          <button class="btn btn-icon" title="Email Customer" data-order-id="${order.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div class="order-content">
        ${renderCustomerInfo(order.customer)}
        ${renderVehicleInfo(order.vehicle)}
        ${renderPaymentInfo(order.payment)}
      </div>

      <div class="order-footer">
        <div class="order-status">
          ${renderOrderProgress(order.status)}
        </div>
        <div class="order-actions">
          ${renderOrderActions(order)}
        </div>
      </div>
    </div>
  `;
}