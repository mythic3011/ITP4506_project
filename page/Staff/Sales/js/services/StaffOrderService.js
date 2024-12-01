export class StaffOrderService {
    constructor() {
        this.storageKey = 'LMC_Order';
        this.initializeMockData();
    }

    initializeMockData() {
        // clear the local storage
        localStorage.setItem(this.storageKey, "");
        const parsedOrders = MockOrderService.getMockOrders();
        localStorage.setItem(this.storageKey, JSON.stringify(parsedOrders));
        // try {
        //     const existingOrders = localStorage.getItem(this.storageKey);
        //     // Add mock orders to existing orders
        //     let parsedOrders = JSON.parse(existingOrders);
        //     if (!Array.isArray(parsedOrders)) {
        //         parsedOrders = [];
        //     }
        //     // get mock orders and then add them to the existing orders
        //     if (parsedOrders.length > 0) {
        //         parsedOrders = parsedOrders.concat(MockOrderService.getMockOrders());
        //     }
        //     else {
        //         parsedOrders = MockOrderService.getMockOrders();
        //     }

        //     localStorage.setItem(this.storageKey, JSON.stringify(parsedOrders));
        // } catch (error) {
        //     console.error('Error initializing mock data:', error);
        //     throw new Error('Failed to initialize mock data');
        // }
    }

    async getOrders() {
        try {
            const ordersData = localStorage.getItem(this.storageKey);
            if (!ordersData) {
                throw new Error('No orders found');
            }
            const orders = JSON.parse(ordersData);
            return Array.isArray(orders) ? orders : [orders];
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Failed to fetch orders');
        }
    }

    async getOrder(orderId) {
        try {
            const orders = await this.getOrders();
            const order = orders.find(o => o.id === orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw new Error('Failed to fetch order details');
        }
    }

    async updateStatus(orderId, newStatus) {
        try {
            const validStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
            if (!validStatuses.includes(newStatus)) {
                throw new Error('Invalid status');
            }

            const orders = await this.getOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);

            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            orders[orderIndex].status = newStatus;
            localStorage.setItem(this.storageKey, JSON.stringify(orders));

            return orders[orderIndex];
        } catch (error) {
            console.error('Error updating status:', error);
            throw new Error('Failed to update order status');
        }
    }

    async recordPayment(orderId, paymentData) {
        try {
            const orders = await this.getOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);

            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            if (!orders[orderIndex].payments) {
                orders[orderIndex].payments = [];
            }

            const payment = {
                id: this.generatePaymentId(),
                amount: paymentData.amount,
                method: paymentData.method,
                reference: paymentData.reference || null,
                notes: paymentData.notes || null,
                date: new Date().toISOString()
            };

            orders[orderIndex].payments.push(payment);
            localStorage.setItem(this.storageKey, JSON.stringify(orders));

            return orders[orderIndex];
        } catch (error) {
            console.error('Error recording payment:', error);
            throw new Error('Failed to record payment');
        }
    }

    async getLicensingData(orderId) {
        try {
            const order = await this.getOrder(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            return {
                status: order.licensingStatus || 'pending',
                documents: order.licensingDocuments || [],
                fee: order.licensingFee || 0,
                data: order.licensing || null
            };
        } catch (error) {
            console.error('Error fetching licensing data:', error);
            throw new Error('Failed to fetch licensing data');
        }
    }

    async updateLicensingStatus(orderId, newStatus, documents = []) {
        try {
            const orders = await this.getOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);

            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            orders[orderIndex].licensingStatus = newStatus;
            if (documents.length > 0) {
                if (!orders[orderIndex].licensingDocuments) {
                    orders[orderIndex].licensingDocuments = [];
                }
                orders[orderIndex].licensingDocuments.push(...documents);
            }

            localStorage.setItem(this.storageKey, JSON.stringify(orders));
            return orders[orderIndex];
        } catch (error) {
            console.error('Error updating licensing status:', error);
            throw new Error('Failed to update licensing status');
        }
    }

    async getTradeInData(orderId) {
        try {
            const order = await this.getOrder(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            return {
                vehicle: order.tradeInVehicle || null,
                value: order.tradeInValue || 0,
                status: order.tradeInStatus || 'pending'
            };
        } catch (error) {
            console.error('Error fetching trade-in data:', error);
            throw new Error('Failed to fetch trade-in data');
        }
    }

    async updateTradeInValue(orderId, tradeInData) {
        try {
            const orders = await this.getOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);

            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            orders[orderIndex].tradeInVehicle = tradeInData.vehicle;
            orders[orderIndex].tradeInValue = tradeInData.value;
            orders[orderIndex].tradeInStatus = tradeInData.status || 'pending';

            localStorage.setItem(this.storageKey, JSON.stringify(orders));
            return orders[orderIndex];
        } catch (error) {
            console.error('Error updating trade-in value:', error);
            throw new Error('Failed to update trade-in value');
        }
    }

    async getPaymentData(orderId) {
        try {
            const order = await this.getOrder(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            const totalPaid = (order.payments || []).reduce((sum, payment) => sum + payment.amount, 0);
            const total = order.items[0].totalPrice;

            return {
                total: total,
                payments: order.payments || [],
                remaining: total - totalPaid
            };
        } catch (error) {
            console.error('Error fetching payment data:', error);
            throw new Error('Failed to fetch payment data');
        }
    }

    generatePaymentId() {
        return 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    async exportOrders(startDate, endDate) {
        try {
            const orders = await this.getOrders();
            return orders.filter(order => {
                const orderDate = new Date(order.date);
                return (!startDate || orderDate >= startDate) &&
                    (!endDate || orderDate <= endDate);
            });
        } catch (error) {
            console.error('Error exporting orders:', error);
            throw new Error('Failed to export orders');
        }
    }
}

export class MockOrderService {
    static getMockOrders() {
        return [
            {
                id: "ORD-M4564A25TUE3",
                data: "2024-12-01T05:35:47.694Z",
                status: "pending",
                customer: {
                    id: 4,
                    name: "Jane Smith",
                    email: "c1@a.com",
                    phone: "852 87654321",
                    address: "Room 244, 2/F, 21 Yuen Wo Road, Sha Tin, NT, Hong Kong",
                    faxNumber: "852 87654321"
                },
                items: [{
                    id: 2,
                    make: "LMC",
                    model: "Equinox",
                    color: "Teal",
                    upgrades: ["Heated Seats", "Sport Suspension", "Backup Camera"],
                    insurancePlans: [
                        {
                            planName: "Uninsured Motorist Protection",
                            annualPremium: 2698
                        },
                        {
                            planName: "Basic Liability Coverage",
                            annualPremium: 1789
                        },
                        {
                            planName: "Collision Coverage",
                            annualPremium: 2572
                        }
                    ],
                    price: 41207,
                    totalPrice: 48266,
                    dateAdded: "2024-12-01T05:12:02.641Z",
                    images: [
                        {
                            url: "https://enzostvs-cached-generation.hf.space/generate/Equinox+car?format=square"
                        }
                    ]
                }],
                discount: "",
                licensingFee: 0,
                tradeInValue: 0,
                financing: {
                    method: "loan_plan_a",
                    paymentMethod: "cash"
                },
                address: {
                    fullName: "Jane Smith",
                    addressLine1: "Room 244, 2/F, 21 Yuen Wo Road, Sha Tin, NT, Hong Kong",
                    district: "Sha Tin"
                },
                licensingStatus: "pending",
                licensingDocuments: [],
                tradeInVehicle: null,
                payments: []
            },
            {
                id: "ORD-N7891B36WED4",
                data: "2024-11-28T14:22:31.123Z",
                status: "confirmed",
                customer: {
                    id: 5,
                    name: "John Doe",
                    email: "c2@a.com",
                    phone: "852 98765432",
                    address: "Flat A, 15/F, Tower 3, Ocean View, Tseung Kwan O, NT, Hong Kong",
                    faxNumber: "852 98765432"
                },
                items: [{
                    id: 7,
                    make: "LMC",
                    model: "GLA",
                    color: "Brown",
                    upgrades: ["Ambient Lighting", "Turbocharger", "Premium Sound System"],
                    insurancePlans: [
                        {
                            planName: "Comprehensive Coverage",
                            annualPremium: 2839
                        }
                    ],
                    price: 30351,
                    totalPrice: 35762,
                    dateAdded: "2024-11-28T14:15:00.000Z",
                    images: [
                        {
                            url: "https://enzostvs-cached-generation.hf.space/generate/GLA+car?format=square"
                        }
                    ]
                }],
                discount: "SUMMER2024",
                licensingFee: 1000,
                tradeInValue: 5000,
                financing: {
                    method: "loan_plan_b",
                    paymentMethod: "credit_card"
                },
                address: {
                    fullName: "John Doe",
                    addressLine1: "Flat A, 15/F, Tower 3, Ocean View, Tseung Kwan O, NT, Hong Kong",
                    district: "Tseung Kwan O"
                },
                licensingStatus: "processing",
                licensingDocuments: [
                    {
                        id: "DOC-ABC123",
                        fileName: "drivers_license.pdf",
                        uploadDate: "2024-11-29T10:15:00.000Z"
                    }
                ],
                tradeInVehicle: {
                    make: "Toyota",
                    model: "Camry",
                    year: 2019,
                    mileage: 45000,
                    condition: "good"
                },
                payments: [
                    {
                        id: "PAY-XYZ789",
                        amount: 3576.20,
                        method: "credit_card",
                        reference: "TX123456",
                        date: "2024-11-28T14:30:00.000Z"
                    }
                ]
            },
        ];
    }
}