import { formatCurrency, formatDate } from '../../../utils/formatters.js';

export function renderPaymentInfo(payment) {
  if (!payment) return '';

  return `
    <div class="payment-info info-section">
      <h4>Payment Information</h4>
      <p><strong>Status:</strong> ${payment.status}</p>
      <p><strong>Amount:</strong> ${formatCurrency(payment.amount)}</p>
      <p><strong>Method:</strong> ${payment.method}</p>
      <p><strong>Date:</strong> ${formatDate(payment.date)}</p>
    </div>
  `;
}