import { router } from '../router.js';
import { renderNavigation } from '../components/Navigation.js';
import { getCurrentUser } from '../services/auth.js';
import { renderAdminDashboard } from '../components/dashboard/AdminDashboard.js';
import { renderCustomerDashboard } from '../components/dashboard/CustomerDashboard.js';

export function renderDashboard() {
  const user = getCurrentUser();
  const isAdmin = user.role === 'admin';
  const navigationTitle = isAdmin ? 'Admin Dashboard' : 'Legend Motor Limited';

  const dashboardHtml = `
    ${renderNavigation(navigationTitle)}
    <main class="main-content">
      ${isAdmin ? renderAdminDashboard() : renderCustomerDashboard()}
    </main>
  `;

  $('#app').html(dashboardHtml);
  initDashboardHandlers();
}

function initDashboardHandlers() {
  // Admin handlers
  $('#manageInquiriesBtn').on('click', () => router.navigate('/admin/inquiries'));
  $('#processOrdersBtn').on('click', () => router.navigate('/admin/orders'));
  $('#manageVehiclesBtn').on('click', () => router.navigate('/admin/vehicles'));
  $('#viewAnalyticsBtn').on('click', () => router.navigate('/admin/analytics'));

  // Customer handlers
  $('#viewVehiclesBtn').on('click', () => router.navigate('/vehicles'));
  $('#viewHistoryBtn').on('click', () => router.navigate('/history'));
  $('#requestQuoteBtn').on('click', () => router.navigate('/vehicles'));
}