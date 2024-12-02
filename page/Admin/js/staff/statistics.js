import { StatisticsService } from '../services/StatisticsService.js';
import { StatisticsView } from './views/StatisticsView.js';
import { ChartManager } from '../utils/ChartManager.js';
import { formatCurrency } from '../utils/formatters.js';

class StatisticsUI {
    constructor() {
        this.statisticsService = new StatisticsService();
        this.view = new StatisticsView({
            totalSales: document.getElementById('totalSales'),
            totalOrders: document.getElementById('totalOrders'),
            avgOrderValue: document.getElementById('avgOrderValue'),
            activePolicies: document.getElementById('activePolicies'),
            premiumRevenue: document.getElementById('premiumRevenue'),
            claimsRate: document.getElementById('claimsRate'),
            popularModels: document.getElementById('popularModels'),
            insurancePlans: document.getElementById('insurancePlans'),
            statsTableBody: document.getElementById('statsTableBody')
        });
        this.chartManager = new ChartManager();
        this.initializeCharts();
        this.attachEventListeners();
        this.loadStatistics();
    }

    initializeCharts() {
        this.salesChart = this.chartManager.createLineChart('salesChart', {
            label: 'Daily Sales',
            borderColor: '#1a237e',
            title: 'Daily Sales Performance',
            yAxisLabel: 'Sales Amount ($)',
            xAxisLabel: 'Date'
        });

        this.insuranceChart = this.chartManager.createLineChart('insuranceChart', {
            label: 'Insurance Policies',
            borderColor: '#00897b',
            title: 'Insurance Policy Trends',
            yAxisLabel: 'Number of Policies',
            xAxisLabel: 'Date'
        });

        this.modelsChart = this.chartManager.createDoughnutChart('modelsChart', {
            title: 'Popular Models Distribution',
            colors: ['#1e40af', '#0369a1', '#0891b2', '#0d9488', '#059669']
        });

        this.plansChart = this.chartManager.createPieChart('plansChart', {
            title: 'Insurance Plans Distribution',
            colors: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef']
        });
    }

    attachEventListeners() {
        const dateRange = document.getElementById('dateRange');
        dateRange.addEventListener('change', () => {
            this.loadStatistics(parseInt(dateRange.value));
        });

        window.addEventListener('resize', () => {
            this.redrawCharts();
        });
    }

    async loadStatistics(days = 30) {
        try {
            const stats = await this.statisticsService.getStatistics(days);
            this.updateUI(stats);
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    updateUI(stats) {
        // Update summary statistics
        this.view.updateSummary({
            totalSales: formatCurrency(stats.totalSales),
            totalOrders: stats.totalOrders.toLocaleString(),
            avgOrderValue: formatCurrency(stats.avgOrderValue),
            activePolicies: stats.activePolicies.toLocaleString(),
            premiumRevenue: formatCurrency(stats.premiumRevenue),
            claimsRate: `${stats.claimsRate}%`
        });

        // Update charts
        this.updateSalesChart(stats.salesData);
        this.updateInsuranceChart(stats.insuranceData);
        this.updateModelsChart(stats.popularModels);
        this.updatePlansChart(stats.insurancePlans);

        // Update lists and table
        this.view.updateModelList(stats.popularModels);
        this.view.updatePlansList(stats.insurancePlans);
        this.view.updateStatsTable(stats.detailedStats);
    }

    updateSalesChart(data) {
        this.salesChart.data.labels = data.dates;
        this.salesChart.data.values = data.values;
        this.salesChart.draw();
    }

    updateInsuranceChart(data) {
        this.insuranceChart.data.labels = data.dates;
        this.insuranceChart.data.values = data.values;
        this.insuranceChart.draw();
    }

    updateModelsChart(models) {
        this.modelsChart.data = {
            labels: models.map(model => model.name),
            values: models.map(model => model.sales)
        };
        this.modelsChart.draw();
    }

    updatePlansChart(plans) {
        this.plansChart.data = {
            labels: plans.map(plan => plan.name),
            values: plans.map(plan => plan.count)
        };
        this.plansChart.draw();
    }

    redrawCharts() {
        this.salesChart.draw();
        this.insuranceChart.draw();
        this.modelsChart.draw();
        this.plansChart.draw();
    }
}

// Initialize the UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StatisticsUI();
});