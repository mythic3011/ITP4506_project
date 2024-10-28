import { renderFormInput } from '../forms/FormInput.js';
import { renderFormCheckbox } from '../forms/FormCheckbox.js';
import { getIcon } from '../icons/index.js';

export function renderStaffForm() {
  return `
    <form id="staffForm" class="auth-form tab-content" data-tab="staff">
      <div class="form-grid">
        ${renderFormInput({
          id: 'staffFirstName',
          label: 'First Name',
          icon: 'user',
          required: true,
          placeholder: 'Enter your first name'
        })}

        ${renderFormInput({
          id: 'staffLastName',
          label: 'Last Name',
          icon: 'user',
          required: true,
          placeholder: 'Enter your last name'
        })}
      </div>

      ${renderFormInput({
        id: 'staffNumber',
        label: 'Staff Number',
        icon: 'id',
        required: true,
        placeholder: 'Enter your staff number'
      })}

      ${renderFormInput({
        id: 'staffEmail',
        label: 'Work Email',
        type: 'email',
        icon: 'email',
        required: true,
        placeholder: 'Enter your work email'
      })}

      ${renderFormInput({
        id: 'staffPhone',
        label: 'Phone Number',
        type: 'tel',
        icon: 'phone',
        required: true,
        placeholder: 'Enter your phone number'
      })}

      ${renderFormInput({
        id: 'staffPassword',
        label: 'Password',
        type: 'password',
        icon: 'lock',
        rightIcon: 'eye',
        required: true,
        placeholder: 'Create a password'
      })}

      ${renderFormInput({
        id: 'staffConfirmPassword',
        label: 'Confirm Password',
        type: 'password',
        icon: 'lock',
        rightIcon: 'eye',
        required: true,
        placeholder: 'Confirm your password'
      })}

      ${renderFormCheckbox({
        id: 'staffTerms',
        label: `I agree to the <button type="button" class="text-button" id="viewTermsBtn">Terms and Conditions</button>`,
        required: true
      })}

      <button type="submit" class="btn btn-primary btn-block">
        Create Staff Account
        ${getIcon('arrowRight')}
      </button>
    </form>
  `;
}