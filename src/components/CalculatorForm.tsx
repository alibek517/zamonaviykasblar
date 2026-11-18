import { type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  Loader2,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import type { Product, ProductId } from '../domain/products';
import type { OrderPricing } from '../domain/pricing';
import { formatMoney, formatNumber } from '../lib/formatMoney';
import { useCountUp } from '../hooks/useCountUp';

interface CalculatorFormProps {
  readonly products: readonly Product[];
  readonly selectedProduct: Product;
  readonly quantity: string;
  readonly customerName: string;
  readonly pricing: OrderPricing | null;
  readonly quantityError?: string;
  readonly nameError?: string;
  readonly productError?: string;
  readonly shakeKey: number;
  readonly isSubmitting: boolean;
  readonly onSelectProduct: (id: ProductId) => void;
  readonly onChangeQuantity: (value: string) => void;
  readonly onStepQuantity: (delta: number) => void;
  readonly onChangeName: (value: string) => void;
  readonly onApplyPreset: (productId: ProductId, qty: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function CalculatorForm({
  products,
  selectedProduct,
  quantity,
  customerName,
  pricing,
  quantityError,
  nameError,
  productError,
  shakeKey,
  isSubmitting,
  onSelectProduct,
  onChangeQuantity,
  onStepQuantity,
  onChangeName,
  onApplyPreset,
  onSubmit,
}: CalculatorFormProps) {
  const prefersReducedMotion = useReducedMotion();

  const animatedWholesale = useCountUp(pricing ? pricing.wholesaleTotal : 0);
  const animatedSavings = useCountUp(pricing ? pricing.savings : 0);

  const availableStock = selectedProduct.stock ?? 200;
  const isOutOfStock = availableStock <= 0;

  const wholesaleRatioPercent = pricing
    ? Math.round(100 - pricing.discountPercent)
    : 100;

  return (
    <aside
      id="hisoblash"
      aria-labelledby="calculator-heading"
      className="min-w-0 scroll-mt-20 lg:sticky lg:top-20"
    >
      <div className="min-w-0 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-paper-surface sm:p-6">
        {/* Sarlavha va tezkor partiya tugmalari */}
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200 pb-3.5 dark:border-slate-800">
          <div className="min-w-0">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-primary dark:text-blue-400">
              Ulgurji buyurtma rasmiylashtirish
            </span>
            <h2
              id="calculator-heading"
              className="mt-0.5 break-words text-lg font-extrabold text-ink dark:text-white sm:text-2xl"
            >
              Buyurtma va foyda hisobi
            </h2>
          </div>

          {/* Tezkor namunalar: M01 × 3 va M02 × 5 */}
          <div
            aria-label="Tezkor partiya namunalari"
            className="flex flex-wrap items-center gap-1.5"
          >
            <button
              type="button"
              data-testid="preset-m01-3"
              onClick={() => onApplyPreset('M01', '3')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-paper px-2 py-1 font-mono text-[11px] font-bold text-ink transition-colors hover:border-ink-primary hover:bg-ink-primary hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-600"
            >
              <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>M01 × 3</span>
            </button>
            <button
              type="button"
              data-testid="preset-m02-5"
              onClick={() => onApplyPreset('M02', '5')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-paper px-2 py-1 font-mono text-[11px] font-bold text-ink transition-colors hover:border-ink-primary hover:bg-ink-primary hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-600"
            >
              <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>M02 × 5</span>
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-4 space-y-3.5">
          {/* 1. Mahsulot tanlash */}
          <div className="min-w-0">
            <label
              htmlFor="product-select"
              className="block text-xs font-bold text-ink dark:text-slate-200 sm:text-sm"
            >
              Tanlangan mahsulot <span className="text-red-600">*</span>
            </label>
            <select
              id="product-select"
              name="productId"
              value={selectedProduct.id}
              onChange={(e) => onSelectProduct(e.target.value)}
              aria-invalid={Boolean(productError)}
              className="mt-1 block w-full min-w-0 truncate rounded-xl border border-slate-300 bg-paper px-2.5 py-2.5 text-xs font-semibold text-ink shadow-sm transition-colors focus:border-ink-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink-royal/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:px-3.5 sm:text-sm"
            >
              {products.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} — {item.name} ({item.unit}) • Zaxira:{' '}
                  {formatNumber(item.stock ?? 200)} {item.unit} • Ulgurji:{' '}
                  {formatMoney(item.wholesalePrice)}
                </option>
              ))}
            </select>
            {productError && (
              <p
                role="alert"
                aria-live="polite"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{productError}</span>
              </p>
            )}
          </div>

          {/* 2. Miqdor kiritish (ombor qoldig'i chegarasi bilan) */}
          <motion.div
            animate={
              quantityError && !prefersReducedMotion
                ? { x: [0, -6, 6, -4, 4, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.32 }}
            className="min-w-0"
          >
            <div className="flex flex-wrap items-center justify-between gap-1">
              <label
                htmlFor="quantity-input"
                className="block text-xs font-bold text-ink dark:text-slate-200 sm:text-sm"
              >
                Miqdor ({selectedProduct.unit}){' '}
                <span className="text-red-600">*</span>
              </label>

              <span
                data-testid="calculator-available-stock"
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ${
                  isOutOfStock
                    ? 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300'
                    : 'bg-lime-100 text-lime-900 dark:bg-lime-950/70 dark:text-lime-300'
                }`}
              >
                <PackageCheck className="h-3 w-3 shrink-0" />
                <span>
                  {isOutOfStock
                    ? `Omborda: 0 ${selectedProduct.unit}`
                    : `Mavjud: ${formatNumber(availableStock)} ${selectedProduct.unit}`}
                </span>
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => onStepQuantity(-1)}
                disabled={isOutOfStock}
                aria-label="Miqdorni bittaga kamaytirish"
                data-testid="qty-decrease"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-paper text-ink transition-colors hover:border-ink-primary hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:h-11 sm:w-11"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>

              <input
                id="quantity-input"
                name="quantity"
                type="text"
                inputMode="numeric"
                value={quantity}
                onChange={(e) => onChangeQuantity(e.target.value)}
                aria-invalid={Boolean(quantityError)}
                aria-describedby={
                  quantityError ? 'quantity-error' : 'quantity-hint'
                }
                placeholder={`1 – ${formatNumber(availableStock)}`}
                className={`h-10 w-full min-w-0 rounded-xl border px-2 text-center font-mono text-sm font-bold tabular-nums transition-colors focus:outline-none focus:ring-2 sm:h-11 sm:px-3.5 sm:text-base ${
                  quantityError
                    ? 'border-red-500 bg-red-50/50 text-red-900 focus:border-red-600 focus:ring-red-500/30 dark:border-red-500 dark:bg-red-950/30 dark:text-red-200'
                    : 'border-slate-300 bg-paper text-ink focus:border-ink-primary focus:bg-white focus:ring-ink-royal/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white'
                }`}
              />

              <button
                type="button"
                onClick={() => onStepQuantity(1)}
                disabled={
                  isOutOfStock ||
                  (Number.isInteger(Number(quantity)) &&
                    Number(quantity) >= availableStock)
                }
                aria-label="Miqdorni bittaga ko‘paytirish"
                data-testid="qty-increase"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-paper text-ink transition-colors hover:border-ink-primary hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:h-11 sm:w-11"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {quantityError ? (
              <p
                id="quantity-error"
                role="alert"
                aria-live="polite"
                data-testid="quantity-error"
                className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="break-words">{quantityError}</span>
              </p>
            ) : (
              <div
                id="quantity-hint"
                className="mt-1.5 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-600 dark:text-slate-400"
              >
                <span>
                  Maksimal buyurtma: {formatNumber(availableStock)}{' '}
                  {selectedProduct.unit}
                </span>
                {!isOutOfStock && (
                  <button
                    type="button"
                    data-testid="select-max-stock-btn"
                    onClick={() => onChangeQuantity(String(availableStock))}
                    className="font-mono font-bold text-ink-primary underline hover:text-ink dark:text-blue-400"
                  >
                    Barchasini tanlash ({formatNumber(availableStock)})
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* 3. Jonli ulgurji hisob-kitob va formulalar */}
          <div
            aria-live="polite"
            className="min-w-0 rounded-2xl border border-slate-200 bg-paper p-3 dark:border-slate-700/80 dark:bg-slate-900/90 sm:p-4"
          >
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Ulgurji to‘lov hisobi</span>
              <span className="truncate font-mono font-bold text-ink dark:text-slate-200">
                {selectedProduct.id} • {selectedProduct.name}
              </span>
            </div>

            {pricing ? (
              <div className="space-y-2.5">
                {/* Ulgurji jami */}
                <div className="min-w-0 rounded-xl border border-blue-200/80 bg-white p-2.5 dark:border-blue-900/60 dark:bg-slate-800/90 sm:p-3.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      Ulgurji jami:
                    </span>
                    <strong
                      data-testid="wholesale-total"
                      className="break-all font-mono text-lg font-extrabold tabular-nums text-ink-primary dark:text-blue-400 sm:text-2xl"
                    >
                      {formatMoney(animatedWholesale)}
                    </strong>
                  </div>
                  <p
                    data-testid="wholesale-formula"
                    className="mt-1 break-words font-mono text-[11px] font-medium tabular-nums text-slate-600 dark:text-slate-400 sm:text-xs"
                  >
                    Formula: {pricing.wholesaleFormula}
                  </p>
                </div>

                {/* Taxminiy tejam */}
                <div className="min-w-0 rounded-xl border border-lime-300/80 bg-lime-50/70 p-2.5 dark:border-lime-800/60 dark:bg-lime-950/30 sm:p-3.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-lime-900 dark:text-lime-300">
                      <TrendingDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Sizning foydangiz (Tejam):</span>
                    </span>
                    <strong
                      data-testid="savings-total"
                      className="break-all font-mono text-lg font-extrabold tabular-nums text-lime-800 dark:text-lime-300 sm:text-2xl"
                    >
                      {formatMoney(animatedSavings)}
                    </strong>
                  </div>
                  <p
                    data-testid="savings-formula"
                    className="mt-1 break-words font-mono text-[11px] font-medium tabular-nums text-lime-900/80 dark:text-lime-300/80 sm:text-xs"
                  >
                    Formula: {pricing.savingsFormula}
                  </p>
                </div>

                {/* Oddiy vs Ulgurji narx animatsiyali taqqoslash chizig'i */}
                <div className="pt-1">
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs">
                    <span className="text-slate-600 dark:text-slate-400">
                      Chakana narxda:{' '}
                      <del className="font-mono font-semibold tabular-nums">
                        {formatMoney(pricing.regularTotal)}
                      </del>
                    </span>
                    <span className="font-mono font-bold text-lime-800 dark:text-lime-300">
                      {pricing.discountPercent}% ulgurji foyda
                    </span>
                  </div>

                  <div
                    aria-hidden="true"
                    className="flex h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
                  >
                    <motion.div
                      initial={false}
                      animate={{ width: `${wholesaleRatioPercent}%` }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
                      className="bg-ink-primary dark:bg-blue-500"
                    />
                    <motion.div
                      initial={false}
                      animate={{ width: `${pricing.discountPercent}%` }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
                      className="bg-lime-accent dark:bg-lime-bright"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div
                data-testid="calculation-empty-state"
                className="rounded-xl border border-dashed border-amber-400/70 bg-amber-50/60 p-3 text-center dark:border-amber-700/60 dark:bg-amber-950/30"
              >
                <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  {isOutOfStock
                    ? 'Mahsulot omborda qolmagan'
                    : 'To‘g‘ri miqdor kiriting (1 dan ' +
                      formatNumber(availableStock) +
                      ' gacha)'}
                </p>
                <p className="mt-0.5 text-[11px] text-amber-800 dark:text-amber-400">
                  {isOutOfStock
                    ? 'Boshqa mahsulot tanlang yoki Admin panelidan zaxirani to‘ldiring.'
                    : `Ombordagi ${formatNumber(availableStock)} ${selectedProduct.unit}dan ortiq kiritib bo‘lmaydi.`}
                </p>
              </div>
            )}
          </div>

          {/* 4. Ism kiritish maydoni */}
          <motion.div
            animate={
              nameError && !prefersReducedMotion
                ? { x: [0, -6, 6, -4, 4, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.32 }}
            data-shake={shakeKey}
            className="min-w-0"
          >
            <label
              htmlFor="customer-name-input"
              className="block text-xs font-bold text-ink dark:text-slate-200 sm:text-sm"
            >
              Ism va familiya (yoki tashkilot nomi){' '}
              <span className="text-red-600">*</span>
            </label>
            <input
              id="customer-name-input"
              name="customerName"
              type="text"
              value={customerName}
              onChange={(e) => onChangeName(e.target.value)}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? 'name-error' : undefined}
              placeholder="Ismingizni kiriting"
              autoComplete="name"
              className={`mt-1 block h-10 w-full min-w-0 rounded-xl border px-3 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 sm:h-11 sm:px-3.5 sm:text-sm ${
                nameError
                  ? 'border-red-500 bg-red-50/50 text-red-900 focus:border-red-600 focus:ring-red-500/30 dark:border-red-500 dark:bg-red-950/30 dark:text-red-200'
                  : 'border-slate-300 bg-paper text-ink focus:border-ink-primary focus:bg-white focus:ring-ink-royal/30 dark:border-slate-700 dark:bg-slate-900 dark:text-white'
              }`}
            />
            {nameError && (
              <p
                id="name-error"
                role="alert"
                aria-live="polite"
                data-testid="name-error"
                className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="break-words">{nameError}</span>
              </p>
            )}
          </motion.div>

          {/* 5. Asosiy yuborish tugmasi */}
          <motion.button
            type="submit"
            disabled={isSubmitting || isOutOfStock}
            whileTap={
              prefersReducedMotion || isOutOfStock
                ? undefined
                : { scale: 0.985 }
            }
            data-testid="submit-button"
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-ink-primary px-3 py-2.5 text-center text-xs font-extrabold text-white shadow-md transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-royal dark:bg-blue-600 dark:hover:bg-blue-500 sm:text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin sm:h-5 sm:w-5" aria-hidden="true" />
                <span>Buyurtma rasmiylashtirilmoqda...</span>
              </>
            ) : isOutOfStock ? (
              <span>Omborda qolmagan (Tugagan)</span>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="break-words">Guruhli xaridga qo‘shilish</span>
              </>
            )}
          </motion.button>
        </form>
      </div>
    </aside>
  );
}
