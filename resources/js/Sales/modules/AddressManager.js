export class AddressManager {
    constructor(form) {
        this.form = form;
        this.initializeTabs();
    }

    initializeTabs() {
        const tabButtons = this.form.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => this.activateTab(button));
        });
    }

    activateTab(button) {
        const tabButtons = this.form.querySelectorAll('.tab-button');
        const tabPanels = this.form.querySelectorAll('.tab-panel');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        tabPanels.forEach(panel => panel.classList.remove('active'));
        const tabId = button.getAttribute('data-tab');
        const activePanel = this.form.querySelector(`#${tabId}`);
        if (activePanel) {
            activePanel.classList.add('active');
        }
    }

    validate() {
        const activePanel = this.form.querySelector('.tab-panel.active');
        if (!activePanel) return false;

        return Array.from(activePanel.querySelectorAll('input[required]'))
            .every(input => input.value.trim() !== '');
    }

    getAddressData() {
        const activePanel = this.form.querySelector('.tab-panel.active');
        if (!activePanel) return {};

        return Array.from(activePanel.querySelectorAll('input')).reduce((data, input) => {
            data[input.id] = input.value.trim();
            return data;
        }, {});
    }
}