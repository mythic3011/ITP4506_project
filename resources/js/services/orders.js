import { fetchJson } from '../utils/fetchJson.js';

const ORDERS_KEY = 'lml_orders';

// Initialize orders from mock data
export async function initOrders() {
  if (!localStorage.getItem(ORDERS_KEY)) {
    try {
      const data = await fetchJson('/src/data/orders.json');
      localStorage.setItem(ORDERS_KEY, JSON.stringify(data.orders));
    } catch (error) {
      console.error('Failed to load orders data:', error);
      localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
    }
  }
}

// Get all orders
export function getOrders() {
  return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
}

// Get customer orders
export function getCustomerOrders(customerId) {
  const orders = getOrders();
  return orders.filter(order => order.customer.id === customerId);
}

// Get order by ID
export function getOrderById(orderId) {
  const orders = getOrders();
  return orders.find(order => order.id === orderId);
}

// Update order status
export function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const index = orders.findIndex(order => order.id === orderId);
  
  if (index !== -1) {
    orders[index].status = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return true;
  }
  return false;
}

// Add new order
export function createOrder(orderData) {
  const orders = getOrders();
  const newOrder = {
    id: Date.now(),
    orderNumber: generateOrderNumber(),
    date: new Date().toISOString(),
    status: 'pending',
    ...orderData
  };
  
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
}

// Generate order number
function generateOrderNumber() {
  const prefix = 'ORD';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}