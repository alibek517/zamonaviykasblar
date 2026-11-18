/**
 * Raqamlarni minglik xonalari orasida oddiy bo'shliq (" ") bilan formatlaydi.
 * Locale'ga bog'liq emas (masalan: 120000 -> "120 000").
 */
export function formatNumber(value: number): string {
  const safeInt = Math.trunc(Number.isFinite(value) ? value : 0);
  const sign = safeInt < 0 ? '-' : '';
  const digits = Math.abs(safeInt).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${sign}${grouped}`;
}

/**
 * Pul miqdorini "120 000 so'm" formatida qaytaradi.
 */
export function formatMoney(amount: number): string {
  return `${formatNumber(amount)} so'm`;
}
