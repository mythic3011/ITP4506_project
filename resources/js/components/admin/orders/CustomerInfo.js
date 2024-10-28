export function renderCustomerInfo(customer) {
  if (!customer) return '';

  return `
    <div class="customer-info info-section">
      <h4>Customer Information</h4>
      <p><strong>Name:</strong> ${customer.name}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Phone:</strong> ${customer.phone}</p>
      <p><strong>Address:</strong> ${customer.address}</p>
    </div>
  `;
}