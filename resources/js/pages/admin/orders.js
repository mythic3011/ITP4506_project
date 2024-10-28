import { renderNavigation } from '../../components/Navigation/index.js';
import { getOrders } from '../../services/admin/orders/orderService.js';
import { filterOrders, getOrderStats } from '../../services/admin/orders/orderFilters.js';
import { renderOrderList, initOrderListeners } from '../../components/admin/orders/OrderList.js';
import { renderOrderStats } from '../../components/admin/orders/OrderStats.js';
import { renderOrderFilters } from '../../components/admin/orders/OrderFilters.js';

export function renderOrders() {
  const orders = getOrders();
  const stats = getOrderStats(orders);
  
  const ordersHtml = `
    ${renderNavigation('Order Management', true)}
    <main class="main-content">
      <div class="page-header">
        <div class="header-left">
          <h2 class="page-title">Order Management</h2>
          ${renderOrderStats(stats)}
        </div>
        ${renderOrderFilters()}
      </div>

      <div class="view-controls">
        <button id="gridViewBtn" class="view-btn active" title="Grid View">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </button>
        <button id="listViewBtn" class="view-btn" title="List View">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div id="ordersContainer" class="orders-container grid-view">
        ${renderOrderList(orders)}
      </div>
    </main>
  `;

  $('#app').html(ordersHtml);
  initOrderListeners();
  initViewControls();

  // Initialize search and filter functionality
  $('#orderSearch').on('input', debounceSearch);
  $('#statusFilter').on('change', filterOrdersByStatus);
}

function initViewControls() {
  $('#gridViewBtn').on('click', function() {
    $(this).addClass('active');
    $('#listViewBtn').removeClass('active');
    $('#ordersContainer').removeClass('list-view').addClass('grid-view');
  });

  $('#listViewBtn').on('click', function() {
    $(this).addClass('active');
    $('#gridViewBtn').removeClass('active');
    $('#ordersContainer').removeClass('grid-view').addClass('list-view');
  });
}

function debounceSearch() {
  const searchTerm = $('#orderSearch').val().toLowerCase();
  const status = $('#statusFilter').val();
  const orders = getOrders();
  
  const filteredOrders = filterOrders(orders, {
    status,
    searchTerm
  });
  
  $('#ordersContainer').html(renderOrderList(filteredOrders));
}

function filterOrdersByStatus() {
  const status = $('#statusFilter').val();
  const searchTerm = $('#orderSearch').val().toLowerCase();
  const orders = getOrders();
  
  const filteredOrders = filterOrders(orders, {
    status,
    searchTerm
  });
  
  $('#ordersContainer').html(renderOrderList(filteredOrders));
}