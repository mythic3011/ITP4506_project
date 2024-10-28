export function renderModal({
  id,
  title,
  content,
  actions
}) {
  return `
    <div id="${id}" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close">&times;</button>
        </div>
        ${content}
        ${actions ? `
          <div class="form-actions">
            ${actions}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function initModal(modalId) {
  const modal = $(`#${modalId}`);

  // Close button
  modal.find('.modal-close').on('click', () => {
    modal.removeClass('show');
  });

  // Click outside
  $(window).on('click', function(e) {
    if ($(e.target).is(modal)) {
      modal.removeClass('show');
    }
  });

  return {
    show: () => modal.addClass('show'),
    hide: () => modal.removeClass('show')
  };
}