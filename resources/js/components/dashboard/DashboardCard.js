import { getDashboardIcon } from './DashboardIcons.js';

export function renderDashboardCard({ title, text, statNumber, statLabel, buttonId, buttonText, icon }) {
  return `
    <div class="dashboard-card">
      <div class="card-header">
        <h3 class="card-title">${title}</h3>
        ${icon ? `<div class="card-icon">${getDashboardIcon(icon)}</div>` : ''}
      </div>
      <p class="card-text">${text}</p>
      <div class="card-stats">
        <span class="stat-number">${statNumber}</span>
        <span class="stat-label">${statLabel}</span>
      </div>
      <button id="${buttonId}" class="btn btn-primary">${buttonText}</button>
    </div>
  `;
}