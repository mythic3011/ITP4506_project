import { getIcon } from '../icons/index.js';

// Helper function to render label
function renderLabel(id, label) {
  return label ? `<label class="form-label" for="${id}">${label}</label>` : '';
}

// Helper function to render input icon
function renderIcon(icon) {
  return icon ? `<span class="input-icon">${typeof icon === 'string' ? getIcon(icon) : icon}</span>` : '';
}

// Helper function to render right icon button
function renderRightIcon(id, rightIcon) {
  return rightIcon ? `
    <button type="button" class="input-icon right" data-input="${id}">
      ${typeof rightIcon === 'string' ? getIcon(rightIcon) : rightIcon}
    </button>
  ` : '';
}

// Main function to render form input
export function renderFormInput({
  id,
  label,
  type = 'text',
  required = false,
  placeholder = '',
  icon = null,
  rightIcon = null,
  value = ''
}) {
  return `
    <div class="form-group">
      ${renderLabel(id, label)}
      <div class="input-group">
        ${renderIcon(icon)}
        <input 
          type="${type}" 
          id="${id}" 
          class="form-input${icon ? ' with-icon' : ''}" 
          ${required ? 'required' : ''} 
          placeholder="${placeholder}"
          value="${value}"
        >
        ${renderRightIcon(id, rightIcon)}
      </div>
    </div>
  `;
}

// Initialize form inputs functionality
export function initFormInputs() {
  // Password visibility toggle
  $('.input-icon.right').on('click', function() {
    const inputId = $(this).data('input');
    const input = $(`#${inputId}`);
    const isPasswordVisible = input.attr('type') === 'password';
    
    // Toggle input type and update icon
    input.attr('type', isPasswordVisible ? 'text' : 'password');
    $(this).html(isPasswordVisible ? getIcon('eyeOff') : getIcon('eye'));
  });
}
