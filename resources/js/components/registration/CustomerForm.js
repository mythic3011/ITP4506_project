import { renderFormInput } from '../forms/FormInput.js';
import { renderFormCheckbox } from '../forms/FormCheckbox.js';
import { getIcon } from '../icons/index.js';

export function renderCustomerForm() {
  return `
    <form id="customerForm" class="auth-form tab-content active" data-tab="customer">
      <div class="form-grid">
        ${renderFormInput({
          id: 'customerFirstName',
          label: 'First Name',
          icon: 'user',
          required: true,
          placeholder: 'Enter your first name'
        })}

        ${renderFormInput({
          id: 'customerLastName',
          label: 'Last Name',
          icon: 'user',
          required: true,
          placeholder: 'Enter your last name'
        })}
      </div>

      ${renderFormInput({
        id: 'customerEmail',
        label: 'Email Address',
        type: 'email',
        icon: 'email',
        required: true,
        placeholder: 'Enter your email'
      })}

      ${renderFormInput({
        id: 'customerPhone',
        label: 'Phone Number',
        type: 'tel',
        icon: 'phone',
        required: true,
        placeholder: 'Enter your phone number'
      })}

      ${renderFormInput({
        id: 'customerPassword',
        label: 'Password',
        type: 'password',
        icon: 'lock',
        rightIcon: 'eye',
        required: true,
        placeholder: 'Create a password'
      })}

      ${renderFormInput({
        id: 'customerConfirmPassword',
        label: 'Confirm Password',
        type: 'password',
        icon: 'lock',
        rightIcon: 'eye',
        required: true,
        placeholder: 'Confirm your password'
      })}

      ${renderFormCheckbox({
        id: 'customerTerms',
        label: `I agree to the <button type="button" class="text-button" id="viewTermsBtn">Terms and Conditions</button>`,
        required: true
      })}

      <button type="submit" class="btn btn-primary btn-block">
        Create Customer Account
        ${getIcon('arrowRight')}
      </button>
    </form>
  `;
}