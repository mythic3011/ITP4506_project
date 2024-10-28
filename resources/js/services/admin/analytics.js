// Utility function to ensure data safety
function safeGetSales() {
    try {
        const data = localStorage.getItem('lml_sales');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading sales data:', error);
        return [];
    }
}

export function getSalesData() {
    return safeGetSales().map(sale => ({
        id: sale.id || Date.now(), date: sale.date || new Date().toISOString(), vehicle: {
            make: sale.vehicle?.make || 'Unknown', model: sale.vehicle?.model || 'Unknown'
        }, total: sale.total || 0, customer: {
            id: sale.customer?.id || 0, name: sale.customer?.name || 'Unknown'
        }
    }));
}

export function getPopularModels() {
    const sales = getSalesData();
    const modelCounts = {};

    sales.forEach(sale => {
        const key = `${sale.vehicle.make} ${sale.vehicle.model}`;
        modelCounts[key] = (modelCounts[key] || 0) + 1;
    });

    return Object.entries(modelCounts)
        .map(([model, count]) => ({model, count}))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
}

export function getMonthlyRevenue() {
    const sales = getSalesData();
    const monthlyData = {};

    sales.forEach(sale => {
        const date = new Date(sale.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + sale.total;
    });

    return Object.entries(monthlyData)
        .map(([month, revenue]) => ({month, revenue}))
        .sort((a, b) => a.month.localeCompare(b.month));
}

export function getAnalyticsSummary() {
    const sales = getSalesData();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyRevenue = sales
        .filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
        })
        .reduce((sum, sale) => sum + sale.total, 0);

    return {
        totalSales: sales.length,
        monthlyRevenue,
        averageOrderValue: sales.length ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0
    };
}