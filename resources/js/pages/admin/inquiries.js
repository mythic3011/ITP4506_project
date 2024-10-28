import { router } from '../../router.js';
import { renderNavigation } from '../../components/Navigation.js';
import { renderSearch, initSearch } from '../../components/Search.js';
import { getInquiries, updateInquiryStatus } from '../../services/admin/inquiries.js';
import { showNotification } from '../../utils/notifications.js';

export function renderInquiries() {
  const inquiries = getInquiries();

  const inquiriesHtml = `
    ${renderNavigation('Customer Inquiries', true)}
    <main class="main-content">
      <div class="page-header">
        <h2>Customer Inquiries</h2>
        <div class="header-controls">
          ${renderSearch({ placeholder: 'Search inquiries...' })}
          <select id="statusFilter" class="select-input">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="responded">Responded</option>
          </select>
        </div>
      </div>

      <div class="inquiries-list" id="inquiriesList">
        ${renderInquiriesList(inquiries)}
      </div>
    </main>
  `;

  $('#app').html(inquiriesHtml);

  initSearch((query) => {
    const filtered = inquiries.filter(inquiry => 
      inquiry.customerName.toLowerCase().includes(query) ||
      inquiry.email.toLowerCase().includes(query) ||
      inquiry.subject.toLowerCase().includes(query) ||
      inquiry.message.toLowerCase().includes(query)
    );
    $('#inquiriesList').html(renderInquiriesList(filtered));
  });

  // Event Handlers
  $('.respond-btn').on('click', function() {
    const inquiryId = parseInt($(this).data('id'));
    updateInquiryStatus(inquiryId, 'responded');
    showNotification('Inquiry marked as responded', 'success');
    renderInquiries();
  });

  $('#statusFilter').on('change', function() {
    const status = $(this).val();
    const filtered = status === 'all' 
      ? inquiries 
      : inquiries.filter(i => i.status === status);
    $('#inquiriesList').html(renderInquiriesList(filtered));
  });

  $('#backBtn').on('click', () => router.navigate('/dashboard'));
}

function renderInquiriesList(inquiries) {
  return inquiries.length > 0 
    ? inquiries.map(inquiry => `
      <div class="inquiry-card" data-id="${inquiry.id}">
        <div class="inquiry-header">
          <h3>${inquiry.subject}</h3>
          <span class="status-badge ${inquiry.status}">${inquiry.status}</span>
        </div>
        <div class="inquiry-content">
          <p class="customer-info">
            <strong>${inquiry.customerName}</strong> (${inquiry.email})
          </p>
          <p class="message">${inquiry.message}</p>
          <p class="date">${new Date(inquiry.date).toLocaleDateString()}</p>
        </div>
        <div class="inquiry-actions">
          ${inquiry.status === 'pending' ? `
            <button class="btn btn-primary respond-btn" data-id="${inquiry.id}">
              Mark as Responded
            </button>
          ` : ''}
        </div>
      </div>
    `).join('')
    : `<div class="no-inquiries"><p>No inquiries found</p></div>`;
}