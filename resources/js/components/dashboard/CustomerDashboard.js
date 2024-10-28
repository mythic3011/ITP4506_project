import { renderDashboardCard } from './DashboardCard.js';
import { getCustomerStats } from '../../services/customer/dashboardStats.js';

export function renderCustomerDashboard() {
  const stats = getCustomerStats();

  const dashboardContent = [
    {
      title: 'Vehicle Catalog',
      text: 'Browse our selection of vehicles',
      statNumber: stats.availableVehicles,
      statLabel: 'Available Vehicles',
      buttonId: 'viewVehiclesBtn',
      buttonText: 'Browse Vehicles',
      icon: 'car'
    },
    {
      title: 'Purchase History',
      text: 'View your purchase history',
      statNumber: stats.totalOrders,
      statLabel: 'Total Orders',
      buttonId: 'viewHistoryBtn',
      buttonText: 'View History',
      icon: 'history'
    },
    {
      title: 'Insurance Quotes',
      text: 'Get insurance quotes for your vehicle',
      statNumber: stats.activeQuotes,
      statLabel: 'Active Quotes',
      buttonId: 'requestQuoteBtn',
      buttonText: 'Request Quote',
      icon: 'shield'
    }
  ];

  return `
    <div class="dashboard-grid">
      ${dashboardContent.map(renderDashboardCard).join('')}
    </div>
  `;
}