export class StatisticsView {
    constructor(elements) {
        this.elements = elements;
    }

    updateSummary(data) {
        this.elements.totalSales.textContent = data.totalSales;
        this.elements.totalOrders.textContent = data.totalOrders;
        this.elements.avgOrderValue.textContent = data.avgOrderValue;
        this.elements.activePolicies.textContent = data.activePolicies;
        this.elements.premiumRevenue.textContent = data.premiumRevenue;
        this.elements.claimsRate.textContent = data.claimsRate;
    }

    updateModelList(models) {
        this.elements.popularModels.innerHTML = models.map(model => `
            <div class="model-list-item">
                <span class="model-name">${model.name}</span>
                <span class="model-value">${model.sales} units</span>
            </div>
        `).join('');
    }

    updatePlansList(plans) {
        this.elements.insurancePlans.innerHTML = plans.map(plan => `
            <div class="plan-list-item">
                <span class="plan-name">${plan.name}</span>
                <span class="plan-value">${plan.count} policies</span>
            </div>
        `).join('');
    }

    updateStatsTable(stats) {
        this.elements.statsTableBody.innerHTML = stats.map(stat => `
            <tr>
                <td>${stat.model}</td>
                <td>${stat.unitsSold}</td>
                <td>${stat.revenue}</td>
                <td>${stat.insuranceRate}%</td>
                <td>${stat.avgPremium}</td>
            </tr>
        `).join('');
    }
}