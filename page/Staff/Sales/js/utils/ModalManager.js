export class ModalManager {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.setupCloseOnOutsideClick();
    }

    open() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    setupCloseOnOutsideClick() {
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }
}