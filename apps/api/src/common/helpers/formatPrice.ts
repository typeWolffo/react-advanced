export function formatPrice(amount: number): string {
  const formatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    currencyDisplay: "symbol",
    maximumFractionDigits: 2,
  });

  return formatter.format(amount / 100);
}
