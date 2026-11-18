import type { Product } from './products';
import { formatMoney, formatNumber } from '../lib/formatMoney';

export interface OrderPricing {
  readonly quantity: number;
  readonly wholesaleTotal: number;
  readonly savings: number;
  readonly regularTotal: number;
  readonly unitSaving: number;
  readonly discountPercent: number;
  readonly wholesaleFormula: string;
  readonly savingsFormula: string;
}

/**
 * Ulgurji jami = miqdor × ulgurji narx (butun sonlarda, floating-point xatosisiz)
 */
export function calculateWholesaleTotal(
  quantity: number,
  wholesalePrice: number
): number {
  const safeQty = Math.trunc(quantity);
  const safePrice = Math.trunc(wholesalePrice);
  return safeQty * safePrice;
}

/**
 * Tejam = miqdor × (oddiy narx − ulgurji narx) (butun sonlarda)
 */
export function calculateSavings(
  quantity: number,
  regularPrice: number,
  wholesalePrice: number
): number {
  const safeQty = Math.trunc(quantity);
  const unitDiff = Math.trunc(regularPrice) - Math.trunc(wholesalePrice);
  return safeQty * unitDiff;
}

/**
 * Chegirma foizi (faqat ko'rsatish uchun, butun songa yaxlitlangan)
 */
export function calculateDiscountPercent(
  regularPrice: number,
  wholesalePrice: number
): number {
  if (regularPrice <= 0) return 0;
  return Math.round(((regularPrice - wholesalePrice) / regularPrice) * 100);
}

/**
 * Tanlangan mahsulot va miqdor bo'yicha to'liq hisob-kitob va formula satrlarini qaytaradi
 */
export function calculateOrderPricing(
  product: Product,
  quantity: number
): OrderPricing {
  const safeQty = Math.trunc(quantity);
  const wholesaleTotal = calculateWholesaleTotal(
    safeQty,
    product.wholesalePrice
  );
  const savings = calculateSavings(
    safeQty,
    product.regularPrice,
    product.wholesalePrice
  );
  const regularTotal = safeQty * Math.trunc(product.regularPrice);
  const unitSaving =
    Math.trunc(product.regularPrice) - Math.trunc(product.wholesalePrice);
  const discountPercent = calculateDiscountPercent(
    product.regularPrice,
    product.wholesalePrice
  );

  const wholesaleFormula = `${formatNumber(safeQty)} × ${formatNumber(
    product.wholesalePrice
  )} = ${formatMoney(wholesaleTotal)}`;

  const savingsFormula = `${formatNumber(safeQty)} × (${formatNumber(
    product.regularPrice
  )} − ${formatNumber(product.wholesalePrice)}) = ${formatMoney(savings)}`;

  return {
    quantity: safeQty,
    wholesaleTotal,
    savings,
    regularTotal,
    unitSaving,
    discountPercent,
    wholesaleFormula,
    savingsFormula,
  };
}
