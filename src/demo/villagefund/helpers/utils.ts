export const currencyFormat = (amount: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const dateFormatFromUTC = (date: string): string => {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};