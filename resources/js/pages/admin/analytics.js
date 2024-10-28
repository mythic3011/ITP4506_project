import { renderNavigation } from '../../components/Navigation.js';
import { 
  getPopularModels, 
  getMonthlyRevenue, 
  getAnalyticsSummary 
} from '../../services/admin/analytics.js';

export function renderAnalytics() {
  try {
    const popularModels = getPopularModels();
    const monthlyRevenue = getMonthlyRevenue();
    const summary = getAnalyticsSummary();

    const analyticsHtml = `
      ${renderNavigation('Analytics Dashboard', true)}
      <main class="main-content">
        <div class="analytics-grid">
          ${renderSummaryCards(summary)}
          ${renderPopularModels(popularModels)}
          ${renderMonthlyRevenueChart(monthlyRevenue)}
        </div>
      </main>
    `;

    $('#app').html(analyticsHtml);
  } catch (error) {
    console.error('Error rendering analytics:', error);
    renderErrorState();
  }
}

// Function to render summary cards
function renderSummaryCards(summary) {
  return `
    <div class="summary-cards">
      <div class="stat-card">
        <div class="stat-icon sales">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3v18h18"/>
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>Total Sales</h3>
          <p class="stat-value">${summary.totalSales}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon revenue">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>Monthly Revenue</h3>
          <p class="stat-value">$${summary.monthlyRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon average">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 8l-8 8M8 8l8 8"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>Average Order Value</h3>
          <p class="stat-value">$${Math.round(summary.averageOrderValue).toLocaleString()}</p>
        </div>
      </div>
    </div>
  `;
}

// Function to render popular models
function renderPopularModels(popularModels) {
  return `
    <div class="chart-card">
      <h3>Popular Models</h3>
      <div class="popular-models">
        ${popularModels.map(({ model, count }) => `
          <div class="model-stat">
            <span class="model-name">${model}</span>
            <div class="model-bar-container">
              <div class="model-bar" style="width: ${(count / popularModels[0].count) * 100}%;">
                ${count} sales
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Function to render monthly revenue chart
function renderMonthlyRevenueChart(monthlyRevenue) {
  return `
    <div class="chart-card">
      <h3>Monthly Revenue</h3>
      <div class="revenue-chart">
        ${monthlyRevenue.map(({ month, revenue }) => `
          <div class="revenue-bar-container">
            <div class="revenue-bar" style="height: ${(revenue / Math.max(...monthlyRevenue.map(m => m.revenue))) * 100}%;">
              <span class="revenue-amount">$${revenue.toLocaleString()}</span>
            </div>
            <span class="month-label">${month}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Function to render error state
function renderErrorState() {
  $('#app').html(`
    ${renderNavigation('Analytics Dashboard', true)}
    <main class="main-content">
      <div class="error-message">
        <h2>Unable to load analytics data</h2>
        <p>Please try again later or contact support if the problem persists.</p>
      </div>
    </main>
  `);
}
