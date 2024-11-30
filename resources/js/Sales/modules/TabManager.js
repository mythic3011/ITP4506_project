// TabManager.js
export class TabManager {
    constructor(container) {
        this.container = container;
        this.tabButtons = this.container.querySelectorAll('.tab-button');
        this.tabPanels = this.container.querySelectorAll('.tab-panel');
        this.activeTabId = null;

        this.initialize();
    }

    initialize() {
        // Add click event listeners to all tab buttons
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTabId = button.getAttribute('data-tab');
                this.switchTab(targetTabId);
                this.emitTabChange(targetTabId);
            });
        });

        // Initialize the first active tab if none is active
        const initialActiveTab = Array.from(this.tabButtons).find(button => button.classList.contains('active'));
        if (initialActiveTab) {
            this.switchTab(initialActiveTab.getAttribute('data-tab'), false);
        } else if (this.tabButtons.length > 0) {
            this.switchTab(this.tabButtons[0].getAttribute('data-tab'), false);
        }
    }

    switchTab(tabId, emitEvent = true) {
        if (this.activeTabId === tabId) return;

        // Remove 'active' class from all buttons and hide all panels
        this.tabButtons.forEach(button => button.classList.remove('active'));
        this.tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add 'active' class to the clicked button and show the corresponding panel
        const activeButton = this.container.querySelector(`.tab-button[data-tab="${tabId}"]`);
        const activePanel = this.container.querySelector(`.tab-panel#${tabId}`);

        if (activeButton && activePanel) {
            activeButton.classList.add('active');
            activePanel.classList.add('active');
            this.activeTabId = tabId;

            if (emitEvent) {
                this.emitTabChange(tabId);
            }
        } else {
            console.warn(`Tab with ID "${tabId}" not found.`);
        }
    }

    emitTabChange(tabId) {
        console.log(`Emitting tabChange for tab: ${tabId}`);
        const event = new CustomEvent('tabChange', {
            detail: { tabId }
        });
        this.container.dispatchEvent(event);
    }
}