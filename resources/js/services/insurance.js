const INSURANCE_QUOTES_KEY = 'lml_insurance_quotes';

export const insuranceTypes = {
  basic: {
    name: 'Basic Coverage',
    description: 'Liability and collision coverage',
    multiplier: 0.05
  },
  standard: {
    name: 'Standard Coverage',
    description: 'Basic + comprehensive coverage',
    multiplier: 0.07
  },
  premium: {
    name: 'Premium Coverage',
    description: 'Standard + additional benefits',
    multiplier: 0.09
  }
};

export function calculateQuote(vehiclePrice, insuranceType) {
  const type = insuranceTypes[insuranceType];
  return vehiclePrice * type.multiplier;
}

export function saveQuote(quote) {
  const quotes = JSON.parse(localStorage.getItem(INSURANCE_QUOTES_KEY) || '[]');
  quotes.push({ ...quote, id: Date.now() });
  localStorage.setItem(INSURANCE_QUOTES_KEY, JSON.stringify(quotes));
}

export function getQuotes(userId) {
  const quotes = JSON.parse(localStorage.getItem(INSURANCE_QUOTES_KEY) || '[]');
  return quotes.filter(quote => quote.userId === userId);
}