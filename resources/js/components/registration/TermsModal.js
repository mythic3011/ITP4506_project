import { renderModal } from '../forms/Modal.js';

export function renderTermsModal() {
  return renderModal({
    id: 'termsModal',
    title: 'Terms and Conditions',
    content: `
      <div class="terms-content">
        <h4>1. Account Terms</h4>
        <p>By creating an account, you agree to provide accurate and complete information.</p>

        <h4>2. Privacy Policy</h4>
        <p>Your personal information will be handled according to our privacy policy.</p>

        <h4>3. Staff Responsibilities</h4>
        <p>Staff members must maintain confidentiality and follow company policies.</p>

        <h4>4. Customer Responsibilities</h4>
        <p>Customers must provide accurate information for vehicle purchases and services.</p>

        <h4>5. Data Protection</h4>
        <p>We implement security measures to protect your personal information.</p>
      </div>
    `,
    actions: `
      <button type="button" class="btn btn-primary modal-close">I Understand</button>
    `
  });
}