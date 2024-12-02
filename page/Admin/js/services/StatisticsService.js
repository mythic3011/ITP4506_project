import { MockStatisticsService } from './MockStatisticsService.js';

export class StatisticsService {
    async getStatistics(days = 30) {
        try {
            const salesData = MockStatisticsService.getMockSalesData(days);
            const insuranceData = MockStatisticsService.getMockInsuranceData(days);
            const summaryStats = MockStatisticsService.getMockSummaryStats();
            const popularModels = MockStatisticsService.getMockPopularModels();
            const insurancePlans = MockStatisticsService.getMockInsurancePlans();
            const detailedStats = MockStatisticsService.getMockDetailedStats();

            return {
                ...summaryStats,
                salesData: {
                    dates: salesData.map(d => this.formatDate(new Date(d.date))),
                    values: salesData.map(d => d.value)
                },
                insuranceData: {
                    dates: insuranceData.map(d => this.formatDate(new Date(d.date))),
                    values: insuranceData.map(d => d.value)
                },
                popularModels: popularModels.map(model => ({
                    name: model.model,
                    sales: model.sales
                })),
                insurancePlans: insurancePlans.map(plan => ({
                    name: plan.name,
                    count: plan.count
                })),
                detailedStats
            };
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw new Error('Failed to fetch statistics');
        }
    }

    formatDate(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const day = date.getDate().toString().padStart(2, '0');
        return `${month} ${day}`;
    }
}