export function renderStatCard({
  title,
  value,
  label,
  icon = null,
  trend = null,
  variant = 'default'
}) {
  return `
    <div class="stat-card ${variant}">
      <div class="stat-header">
        <h3 class="stat-title">${title}</h3>
        ${icon ? `<div class="stat-icon">${icon}</div>` : ''}
      </div>
      
      <div class="stat-content">
        <div class="stat-value">${value}</div>
        <div class="stat-label">${label}</div>
        
        ${trend ? `
          <div class="stat-trend ${trend.type}">
            <span class="trend-icon">
              ${trend.type === 'up' ? `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
              ` : `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              `}
            </span>
            <span class="trend-value">${trend.value}%</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}