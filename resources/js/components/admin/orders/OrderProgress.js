export function renderOrderProgress(status) {
  const steps = ['pending', 'processing', 'completed'];
  const currentStep = steps.indexOf(status);

  return `
    <div class="progress-tracker">
      ${steps.map((step, index) => `
        <div class="progress-step ${index <= currentStep ? 'completed' : ''} ${status === step ? 'current' : ''}">
          <div class="step-icon">
            ${getStepIcon(step)}
          </div>
          <span class="step-label">${step}</span>
        </div>
        ${index < steps.length - 1 ? '<div class="progress-line"></div>' : ''}
      `).join('')}
    </div>
  `;
}

function getStepIcon(step) {
  const icons = {
    pending: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>`,
    processing: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
    </svg>`,
    completed: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>`
  };

  return icons[step] || '';
}