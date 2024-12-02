export class TabManager {
    constructor(container) {
        this.container = container;
        this.tabButtons = container.querySelectorAll('.tab-button');
        this.tabPanels = this.getTabPanels();
        this.initialize();
    }

    getTabPanels() {
        const tabContent = this.container.querySelector('.tab-content');
        return tabContent ?
            tabContent.querySelectorAll('.tab-panel') :
            document.querySelectorAll(`[data-tab-container="${this.container.id}"] .tab-panel`);
    }

    initialize() {
        if (!this.tabButtons.length) return;

        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(button);
            });
        });

        // Set initial active tab
        const activeButton = this.container.querySelector('.tab-button.active') || this.tabButtons[0];
        if (activeButton) {
            this.switchTab(activeButton, false);
        }
    }

    switchTab(selectedButton, animate = true) {
        if (!selectedButton) return;

        // Update button states
        this.tabButtons.forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
        });
        selectedButton.classList.add('active');
        selectedButton.setAttribute('aria-selected', 'true');

        // Update panel visibility
        const targetId = selectedButton.getAttribute('data-tab');
        if (!targetId) return;

        this.tabPanels.forEach(panel => {
            const shouldShow = panel.id === targetId;
            panel.classList.toggle('active', shouldShow);
            panel.classList.toggle('hidden', !shouldShow);
            panel.setAttribute('aria-hidden', !shouldShow);

            if (animate && shouldShow) {
                this.animatePanel(panel);
            }
        });

        // Dispatch custom event
        this.container.dispatchEvent(new CustomEvent('tabChange', {
            detail: {
                tabId: targetId,
                button: selectedButton
            }
        }));
    }

    animatePanel(panel) {
        if (!panel) return;

        // Reset animation state
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(10px)';

        // Trigger animation
        requestAnimationFrame(() => {
            panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';

            // Clean up after animation
            panel.addEventListener('transitionend', () => {
                panel.style.transition = '';
                panel.style.transform = '';
            }, { once: true });
        });
    }

    getActiveTabId() {
        const activeButton = this.container.querySelector('.tab-button.active');
        return activeButton ? activeButton.getAttribute('data-tab') : null;
    }

    activateTab(tabId) {
        const button = Array.from(this.tabButtons).find(btn => btn.getAttribute('data-tab') === tabId);
        if (button) {
            this.switchTab(button);
        }
    }

    enableTab(tabId, enable = true) {
        const button = Array.from(this.tabButtons).find(btn => btn.getAttribute('data-tab') === tabId);
        if (button) {
            button.disabled = !enable;
            button.classList.toggle('disabled', !enable);
        }
    }

    hideTab(tabId) {
        const button = Array.from(this.tabButtons).find(btn => btn.getAttribute('data-tab') === tabId);
        if (button) {
            button.style.display = 'none';
        }
    }

    showTab(tabId) {
        const button = Array.from(this.tabButtons).find(btn => btn.getAttribute('data-tab') === tabId);
        if (button) {
            button.style.display = '';
        }
    }

    destroy() {
        this.tabButtons.forEach(button => {
            button.removeEventListener('click', this.switchTab);
        });
    }
}