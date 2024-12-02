export function showMessage(messageDiv, text, type) {
    messageDiv.textContent = text;
    messageDiv.className = 'message';
    messageDiv.classList.add(`${type}`);
    messageDiv.style.display = 'block';
}

export function clearMessage(messageDiv) {
    messageDiv.style.display = 'none';
    messageDiv.className = 'message';
    messageDiv.textContent = '';
}