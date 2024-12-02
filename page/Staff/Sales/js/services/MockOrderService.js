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
                    dateAdded: "2024-12-01T05:12:02.641Z"
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
                    dateAdded: "2024-11-28T14:15:00.000Z"
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
            {
                id: "ORD-P1234C47THU5",
                data: "2024-11-15T09:45:12.789Z",
                status: "completed",
                customer: {
                    id: 6,
                    name: "Alice Wong",
                    email: "c3@a.com",
                    phone: "852 91234567",
                    address: "Unit B, 8/F, Fortune Building, Wan Chai, Hong Kong",
                    faxNumber: "852 91234567"
                },
                items: [{
                    id: 4,
                    make: "LMC",
                    model: "Camry",
                    color: "Silver",
                    upgrades: ["Premium Upholstery", "Adaptive Cruise Control"],
                    insurancePlans: [
                        {
                            planName: "Collision Coverage",
                            annualPremium: 3126
                        }
                    ],
                    price: 30178,
                    totalPrice: 33178,
                    dateAdded: "2024-11-15T09:30:00.000Z"
                }],
                discount: "SAVE10",
                licensingFee: 1000,
                tradeInValue: 0,
                financing: {
                    method: "loan_plan_c",
                    paymentMethod: "bank_transfer"
                },
                address: {
                    fullName: "Alice Wong",
                    addressLine1: "Unit B, 8/F, Fortune Building, Wan Chai, Hong Kong",
                    district: "Wan Chai"
                },
                licensingStatus: "completed",
                licensingDocuments: [
                    {
                        id: "DOC-DEF456",
                        fileName: "drivers_license.pdf",
                        uploadDate: "2024-11-16T11:20:00.000Z"
                    },
                    {
                        id: "DOC-GHI789",
                        fileName: "insurance_cert.pdf",
                        uploadDate: "2024-11-16T11:25:00.000Z"
                    }
                ],
                tradeInVehicle: null,
                payments: [
                    {
                        id: "PAY-ABC123",
                        amount: 3317.80,
                        method: "bank_transfer",
                        reference: "BT987654",
                        date: "2024-11-15T10:00:00.000Z"
                    },
                    {
                        id: "PAY-DEF456",
                        amount: 29860.20,
                        method: "bank_transfer",
                        reference: "BT987655",
                        date: "2024-11-20T14:15:00.000Z"
                    }
                ]
            }
        ];
    }
}