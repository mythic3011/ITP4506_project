export function AnalyticsCard({ title, children }) {
  return `
    <div class="analytics-card">
      <h3 class="analytics-title">${title}</h3>
      ${children}
    </div>
  `;
}