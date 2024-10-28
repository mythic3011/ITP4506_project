import { fetchJson } from '../../utils/fetchJson.js';

const MOCK_DATA = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      email: "admin@legendmotor.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      phone: "+1234567890",
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: null,
      preferences: {
        theme: "system",
        notifications: true
      }
    },
    {
      id: 2,
      username: "customer",
      password: "customer123",
      email: "customer@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "customer",
      phone: "+1987654321",
      createdAt: "2024-01-02T00:00:00Z",
      lastLogin: null,
      preferences: {
        theme: "light",
        notifications: true
      }
    }
  ],
  vehicles: [
    {
      id: 1,
      make: "Toyota",
      model: "Camry",
      year: 2024,
      price: 25999,
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500",
      status: "available",
      specs: {
        engine: "2.5L 4-Cylinder",
        transmission: "8-Speed Automatic",
        mileage: "New",
        color: "Celestial Silver Metallic"
      }
    },
    {
      id: 2,
      make: "Honda",
      model: "CR-V",
      year: 2024,
      price: 28999,
      image: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=500",
      status: "available",
      specs: {
        engine: "1.5L Turbo 4-Cylinder",
        transmission: "CVT",
        mileage: "New",
        color: "Platinum White Pearl"
      }
    }
  ],
  orders: [
    {
      id: 1,
      orderNumber: "ORD-2024-001",
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
      orderNumber: "ORD-2024-002",
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
    }
  ],
  inquiries: [
    {
      id: 1,
      customerName: "John Doe",
      email: "john@example.com",
      subject: "Vehicle Availability",
      message: "Is the 2024 Toyota Camry still available?",
      status: "pending",
      date: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      customerName: "Jane Smith",
      email: "jane@example.com",
      subject: "Test Drive Request",
      message: "I would like to schedule a test drive for the Honda CR-V",
      status: "responded",
      date: "2024-01-14T15:45:00Z"
    }
  ]
};

export async function initializeMockData() {
  try {
    // Initialize users
    if (!localStorage.getItem('lml_users')) {
      localStorage.setItem('lml_users', JSON.stringify(MOCK_DATA.users));
    }

    // Initialize vehicles
    if (!localStorage.getItem('lml_vehicles')) {
      localStorage.setItem('lml_vehicles', JSON.stringify(MOCK_DATA.vehicles));
    }

    // Initialize orders
    if (!localStorage.getItem('lml_orders')) {
      localStorage.setItem('lml_orders', JSON.stringify(MOCK_DATA.orders));
    }

    // Initialize inquiries
    if (!localStorage.getItem('lml_inquiries')) {
      localStorage.setItem('lml_inquiries', JSON.stringify(MOCK_DATA.inquiries));
    }

    console.log('Mock data initialized successfully');
  } catch (error) {
    console.error('Failed to initialize mock data:', error);
  }
}