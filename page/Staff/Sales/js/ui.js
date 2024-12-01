export function showMessage(messageDiv, text, type) {
    messageDiv.textContent = text;
    messageDiv.className = 'message';
    messageDiv.classList.add(`${type}`);
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
        messageDiv.className = '';
        messageDiv.classList.remove(`${type}`);
    }, 1000);
}

export function clearMessage(messageDiv) {
    messageDiv.style.display = 'none';
    messageDiv.className = 'message';
    messageDiv.textContent = '';
}