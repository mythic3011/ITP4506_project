// DOM utility functions
export function createElement(tag, className, innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

export function appendChildren(parent, children) {
    children.forEach(child => parent.appendChild(child));
}

export function getElement(selector) {
    return document.querySelector(selector);
}