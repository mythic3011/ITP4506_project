export function showMessage(messageDiv, text, type) {
    try {
        messageDiv.textContent = text;
        messageDiv.className = 'message';
        messageDiv.classList.add(`${type}`);
        messageDiv.style.display = 'block';
    } catch (error) {
        console.error('Error showing message:', error);
    }
}

export function clearMessage(messageDiv) {
    try {
        messageDiv.style.display = 'none';
        messageDiv.className = 'message';
        messageDiv.textContent = '';
    } catch (error) {
        console.error('Error clearing message:', error);
    }
}