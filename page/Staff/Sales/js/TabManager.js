export class TabManager {
    constructor(container) {
        this.container = container;
        this.tabButtons = container.querySelectorAll('.tab-button');
        this.tabContent = container.querySelector('.tab-content');
        this.tabPanels = this.tabContent ?
            this.tabContent.querySelectorAll('.tab-panel') :
            document.querySelectorAll('.tab-panel');
        this.initialize();
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

        const targetId = selectedButton.getAttribute('data-tab');
        if (!targetId) return;

        // Update button states
        this.tabButtons.forEach(button => {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
        });
        selectedButton.classList.add('active');
        selectedButton.setAttribute('aria-selected', 'true');

        // Update panel visibility
        this.tabPanels.forEach(panel => {
            const shouldShow = panel.id === targetId;
            panel.classList.toggle('active', shouldShow);
            panel.classList.toggle('hidden', !shouldShow);

            if (animate && shouldShow) {
                this.animatePanel(panel);
            }
        });

        // Dispatch custom event
        this.container.dispatchEvent(new CustomEvent('tabChange', {
            detail: { tabId: targetId }
        }));
    }

    animatePanel(panel) {
        if (!panel) return;

        panel.style.opacity = '0';
        panel.style.transform = 'translateY(10px)';

        requestAnimationFrame(() => {
            panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';

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
}