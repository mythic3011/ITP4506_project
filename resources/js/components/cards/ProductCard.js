import { formatCurrency } from '../../utils/formatters.js';

export function renderProductCard({ 
  id,
  image,
  title,
  subtitle,
  price,
  status,
  specs = [],
  actionButton = null
}) {
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${image}" alt="${title}" loading="lazy">
        ${status ? `<span class="product-badge ${status}">${status}</span>` : ''}
      </div>
      
      <div class="product-content">
        <div class="product-header">
          <h3 class="product-title">${title}</h3>
          ${subtitle ? `<span class="product-subtitle">${subtitle}</span>` : ''}
        </div>
        
        <div class="product-price">
          ${formatCurrency(price)}
        </div>
        
        ${specs.length > 0 ? `
          <div class="product-specs">
            ${specs.map(spec => `
              <div class="spec-item">
                ${spec.icon || ''}
                <span>${spec.label}: ${spec.value}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${actionButton ? `
          <div class="product-actions">
            <button 
              class="btn btn-primary" 
              onclick="${actionButton.onClick}"
              ${actionButton.disabled ? 'disabled' : ''}
            >
              ${actionButton.icon || ''}
              ${actionButton.label}
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}