export function renderFormCheckbox({
  id,
  label,
  checked = false
}) {
  return `
    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" id="${id}" ${checked ? 'checked' : ''}>
        <span class="checkbox-text">${label}</span>
      </label>
    </div>
  `;
}