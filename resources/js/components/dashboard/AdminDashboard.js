import { renderDashboardCard } from './DashboardCard.js';
import { getAdminStats } from '../../services/admin/dashboardStats.js';

export function renderAdminDashboard() {
  const stats = getAdminStats();

  const dashboardContent = [
    {
      title: 'Inquiry Management',
      text: 'Manage customer inquiries and messages',
      statNumber: stats.newInquiries,
      statLabel: 'New Inquiries',
      buttonId: 'manageInquiriesBtn',
      buttonText: 'Manage Inquiries',
      icon: 'message'
    },
    {
      title: 'Order Processing',
      text: 'Process and manage vehicle orders',
      statNumber: stats.pendingOrders,
      statLabel: 'Pending Orders',
      buttonId: 'processOrdersBtn',
      buttonText: 'Process Orders',
      icon: 'order'
    },
    {
      title: 'Vehicle Management',
      text: 'Manage vehicle inventory',
      statNumber: stats.totalVehicles,
      statLabel: 'Total Vehicles',
      buttonId: 'manageVehiclesBtn',
      buttonText: 'Manage Vehicles',
      icon: 'vehicle'
    },
    {
      title: 'Sales Analytics',
      text: 'View sales reports and analytics',
      statNumber: stats.monthlySales,
      statLabel: 'Monthly Sales',
      buttonId: 'viewAnalyticsBtn',
      buttonText: 'View Analytics',
      icon: 'chart'
    }
  ];

  return `
    <div class="dashboard-grid">
      ${dashboardContent.map(renderDashboardCard).join('')}
    </div>
  `;
}