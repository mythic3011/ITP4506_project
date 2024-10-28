export function sortByDate(array, key, ascending = false) {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

export function sortByString(array, key, ascending = true) {
  return [...array].sort((a, b) => {
    const valueA = a[key].toLowerCase();
    const valueB = b[key].toLowerCase();
    return ascending 
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });
}

export function sortByNumber(array, key, ascending = true) {
  return [...array].sort((a, b) => {
    return ascending 
      ? a[key] - b[key]
      : b[key] - a[key];
  });
}