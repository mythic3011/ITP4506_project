const ORDERS_KEY = 'lml_orders';

const mockOrders = [
  {
    id: 1,
    customerName: "John Doe",
    vehicleId: 1,
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: 2024,
      price: 25999
    },
    status: "completed",
    date: "2024-01-15",
    total: 25999,
    paymentStatus: "paid",
    deliveryAddress: "123 Main St, City",
    contact: "+1234567890"
  },
  {
    id: 2,
    customerName: "Jane Smith",
    vehicleId: 2,
    vehicle: {
      make: "Honda",
      model: "CR-V",
      year: 2024,
      price: 28999
    },
    status: "processing",
    date: "2024-01-20",
    total: 28999,
    paymentStatus: "pending",
    deliveryAddress: "456 Oak Ave, Town",
    contact: "+1987654321"
  },
  {
    id: 3,
    customerName: "Mike Johnson",
    vehicleId: 3,
    vehicle: {
      make: "BMW",
      model: "3 Series",
      year: 2024,
      price: 43999
    },
    status: "pending",
    date: "2024-02-01",
    total: 43999,
    paymentStatus: "pending",
    deliveryAddress: "789 Pine Rd, Village",
    contact: "+1122334455"
  }
];

export function initOrders() {
  if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(mockOrders));
  }
}

export function getOrders() {
  initOrders();
  return JSON.parse(localStorage.getItem(ORDERS_KEY));
}

export function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const updatedOrders = orders.map(order => 
    order.id === orderId ? { ...order, status } : order
  );
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
  return updatedOrders;
}

export function addOrder(order) {
  const orders = getOrders();
  const newOrder = {
    ...order,
    id: Date.now(),
    date: new Date().toISOString().split('T')[0]
  };
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
}