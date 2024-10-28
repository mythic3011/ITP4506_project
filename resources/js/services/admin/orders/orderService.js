// Mock order data with complete customer information
const mockOrders = [
  {
    id: 1,
    orderNumber: "ORD-2024-001",
    date: "2024-01-15",
    status: "processing",
    customer: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8900"
    },
    vehicle: {
      id: 1,
      make: "Toyota",
      model: "Camry",
      year: 2024,
      price: 25000
    },
    payment: {
      status: "paid",
      amount: 25000,
      method: "credit_card"
    }
  },
  {
    id: 2,
    orderNumber: "ORD-2024-002",
    date: "2024-01-16",
    status: "pending",
    customer: {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 234-567-8901"
    },
    vehicle: {
      id: 2,
      make: "Honda",
      model: "CR-V",
      year: 2024,
      price: 28000
    },
    payment: {
      status: "pending",
      amount: 28000,
      method: "bank_transfer"
    }
  }
];

export function getOrders() {
  return mockOrders;
}

export function getOrderById(id) {
  return mockOrders.find(order => order.id === id);
}

export function updateOrderStatus(orderId, newStatus) {
  const order = mockOrders.find(order => order.id === orderId);
  if (order) {
    order.status = newStatus;
    return true;
  }
  return false;
}