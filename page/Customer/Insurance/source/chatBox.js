class ChatManager {
    constructor() {
        this.messages = [];
        this.chatContainer = null;
        this.isVisible = false;
        this.initialize();
    }

    initialize() {
        this.createChatInterface();
        this.loadMessages();
        this.attachEventListeners();
    }

    createChatInterface() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'chat-toggle';
        toggleBtn.innerHTML = '<img src="../../../resources/image/icon/chat.svg">';
        document.body.appendChild(toggleBtn);

        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'chat-container chat-hidden';
        this.chatContainer.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-icon">💬</div>
        <h3>Customer Support</h3>
        <button id="closeBtn" style="margin-left: auto; color: black">Close</button>
      </div>
      <div class="chat-messages"></div>
      <div class="chat-input">
        <div class="chat-input-wrapper">
          <textarea
            placeholder="Type your message..."
            rows="1"
            maxlength="1000"
          ></textarea>
        </div>
        <button id="sendBtn">Send</button>
      </div>
    `;
        document.body.appendChild(this.chatContainer);
    }

    loadMessages() {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');
        const storedMessages = localStorage.getItem(`chat-messages-${orderId}`);
        if (storedMessages) {
            this.messages = JSON.parse(storedMessages);
            this.renderMessages();
        }

    }

    saveMessages() {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id');
        localStorage.setItem(`chat-messages-${orderId}`, JSON.stringify(this.messages));
    }

    attachEventListeners() {
        const toggleBtn = document.querySelector('.chat-toggle');
        const sendBtn = this.chatContainer.querySelector('#sendBtn');
        const closeBtn = this.chatContainer.querySelector('#closeBtn');
        const textarea = this.chatContainer.querySelector('textarea');

        toggleBtn.addEventListener('click', () => this.toggleChat());

        closeBtn.addEventListener('click', () => this.toggleChat());

        sendBtn.addEventListener('click', () => this.sendMessage());

        textarea.addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';

            sendBtn.disabled = !e.target.value.trim();
        });

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!sendBtn.disabled) {
                    this.sendMessage();
                }
            }
        });
    }

    toggleChat() {
        this.isVisible = !this.isVisible;
        this.chatContainer.classList.toggle('chat-hidden');
        if (this.isVisible) {
            this.chatContainer.querySelector('textarea').focus();
        }
    }

    sendMessage() {
        const textarea = this.chatContainer.querySelector('textarea');
        const message = textarea.value.trim();
        console.log('sendMessage called');

        if (message) {
            const urlParams = new URLSearchParams(window.location.search);
            const orderId = urlParams.get('id');
            const pendingInsurance = JSON.parse(localStorage.getItem(`pendingInsurance-${orderId}`));

            const newMessage = {
                text: message,
                timestamp: new Date().toISOString(),
                sender: 'customer',
                staffEmail: 'customer@lmc.com',
                customerEmail: pendingInsurance.Save_selected_option_3.mainDriver.email
            };

            this.messages.push(newMessage);
            this.saveMessages();
            this.renderMessages();

            // Reset textarea
            textarea.value = '';
            textarea.style.height = 'auto';
            this.chatContainer.querySelector('button').disabled = true;
            textarea.focus();
        }
    }

    renderMessages() {
        const messagesContainer = this.chatContainer.querySelector('.chat-messages');
        messagesContainer.innerHTML = this.messages.map(msg => `
      <div class="message ${msg.sender}-message">
        <div class="message-header">
          <div class="message-avatar">
            ${msg.sender === 'staff' ? '👤' : '👤'}
          </div>
          <div class="message-sender">
            ${msg.sender === 'staff' ? 'Staff' : 'Customer'}
          </div>
        </div>
        <div class="message-content">${this.formatMessage(msg.text)}</div>
        <div class="message-timestamp">${this.formatTimestamp(msg.timestamp)}</div>
      </div>
    `).join('');

        this.attachEventListeners();
        setInterval(() => this.loadMessages(), 1000);
    }

    formatMessage(text) {
        return text.replace(/\n/g, '<br>');
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            month: 'short',
            day: 'numeric'
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new ChatManager();
});