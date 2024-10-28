export function filterByStatus(items, status) {
  return items.filter(item => item.status === status);
}

export function filterByDateRange(items, startDate, endDate, dateKey = 'date') {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return items.filter(item => {
    const itemDate = new Date(item[dateKey]);
    return itemDate >= start && itemDate <= end;
  });
}

export function filterByPrice(items, minPrice, maxPrice, priceKey = 'price') {
  return items.filter(item => {
    const price = Number(item[priceKey]);
    return price >= minPrice && price <= maxPrice;
  });
}

export function searchItems(items, query, keys) {
  const searchTerm = query.toLowerCase();
  
  return items.filter(item => 
    keys.some(key => {
      const value = item[key];
      return value && value.toString().toLowerCase().includes(searchTerm);
    })
  );
}