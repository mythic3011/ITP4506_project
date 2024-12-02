export class MockStatisticsService {
    static getMockSalesData(days) {
        const data = [];
        const baseValue = 50000;
        const variance = 10000;

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                value: baseValue + Math.random() * variance * (Math.random() > 0.5 ? 1 : -1)
            });
        }

        return data.reverse();
    }

    static getMockInsuranceData(days) {
        const data = [];
        const baseValue = 100;
        const variance = 20;

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                value: baseValue + Math.random() * variance * (Math.random() > 0.5 ? 1 : -1)
            });
        }

        return data.reverse();
    }

    static getMockPopularModels() {
        return [
            {
                model: "LMC Equinox",
                sales: 245,
                revenue: 10045000,
                insuranceRate: 78,
                avgPremium: 2698
            },
            {
                model: "LMC Jetta",
                sales: 198,
                revenue: 7326000,
                insuranceRate: 82,
                avgPremium: 2847
            },
            {
                model: "LMC RAV4",
                sales: 167,
                revenue: 6632000,
                insuranceRate: 75,
                avgPremium: 2072
            },
            {
                model: "LMC Camry",
                sales: 143,
                revenue: 4315000,
                insuranceRate: 71,
                avgPremium: 3126
            },
            {
                model: "LMC F-150",
                sales: 112,
                revenue: 4176000,
                insuranceRate: 68,
                avgPremium: 1739
            }
        ];
    }

    static getMockInsurancePlans() {
        return [
            {
                name: "Comprehensive Coverage",
                count: 523,
                revenue: 1084000,
                avgPremium: 2839,
                claimRate: 12
            },
            {
                name: "Basic Liability",
                count: 412,
                revenue: 732000,
                avgPremium: 1789,
                claimRate: 8
            },
            {
                name: "Collision Coverage",
                count: 378,
                revenue: 967000,
                avgPremium: 2572,
                claimRate: 15
            },
            {
                name: "Uninsured Motorist",
                count: 245,
                revenue: 624000,
                avgPremium: 2548,
                claimRate: 5
            }
        ];
    }

    static getMockSummaryStats() {
        return {
            totalSales: 32486000,
            totalOrders: 865,
            avgOrderValue: 37556,
            activePolicies: 1558,
            premiumRevenue: 3407000,
            claimsRate: 9.8
        };
    }

    static getMockDetailedStats() {
        const models = this.getMockPopularModels();
        return models.map(model => ({
            model: model.model,
            unitsSold: model.sales,
            revenue: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'HKD'
            }).format(model.revenue),
            insuranceRate: model.insuranceRate,
            avgPremium: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'HKD'
            }).format(model.avgPremium)
        }));
    }
}