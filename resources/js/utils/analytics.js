export function calculateStats(items, valueKey) {
  const values = items.map(item => Number(item[valueKey]));
  
  return {
    total: values.reduce((sum, val) => sum + val, 0),
    average: values.reduce((sum, val) => sum + val, 0) / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length
  };
}

export function groupByCategory(items, categoryKey) {
  return items.reduce((groups, item) => {
    const category = item[categoryKey];
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

export function calculateGrowth(current, previous) {
  if (!previous) return 100;
  return ((current - previous) / previous) * 100;
}

export function calculatePercentage(value, total) {
  if (!total) return 0;
  return (value / total) * 100;
}