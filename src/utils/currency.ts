export const formatNGN = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const parsePrice = (price: number): number => {
  // Ensure price is always an integer (kobo to naira)
  return Math.round(price);
};
