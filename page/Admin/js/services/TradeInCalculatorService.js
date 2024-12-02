export class TradeInCalculatorService {
    calculateValue(vehicleData) {
        const baseValue = this.getBaseValue(vehicleData.year);
        const mileageAdjustment = this.calculateMileageAdjustment(vehicleData.mileage);
        const conditionMultiplier = this.getConditionMultiplier(vehicleData.condition);
        const marketAdjustment = this.getMarketAdjustment(vehicleData.make, vehicleData.model);

        let value = (baseValue + mileageAdjustment) * conditionMultiplier * marketAdjustment;
        return Math.round(value * 100) / 100; // Round to 2 decimal places
    }

    getBaseValue(year) {
        const currentYear = new Date().getFullYear();
        const age = currentYear - year;
        const baseValue = 30000; // Base value for a new car
        const annualDepreciation = 0.15; // 15% annual depreciation
        return baseValue * Math.pow(1 - annualDepreciation, age);
    }

    calculateMileageAdjustment(mileage) {
        const averageAnnualMileage = 12000;
        const mileageRate = -0.1; // $0.10 per mile above average
        const mileageDifference = mileage - averageAnnualMileage;
        return Math.max(mileageDifference * mileageRate, -5000); // Cap the reduction at $5000
    }

    getConditionMultiplier(condition) {
        const multipliers = {
            excellent: 1.1,
            good: 1.0,
            fair: 0.8,
            poor: 0.6
        };
        return multipliers[condition] || multipliers.fair;
    }

    getMarketAdjustment(make, model) {
        // In a real application, this would fetch current market data
        // For now, return a simple multiplier based on make
        const marketMultipliers = {
            LMC: 1.1,
            Toyota: 1.05,
            Honda: 1.05,
            Ford: 0.95,
            default: 1.0
        };
        return marketMultipliers[make] || marketMultipliers.default;
    }
}