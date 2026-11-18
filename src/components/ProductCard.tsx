import { motion, useReducedMotion } from 'framer-motion';
import { Check, Store } from 'lucide-react';
import type { Product } from '../domain/products';
import { calculateDiscountPercent } from '../domain/pricing';
import { formatMoney } from '../lib/formatMoney';
import { ProductIllustration } from './ProductIllustrations';

interface ProductCardProps {
  readonly product: Product;
  readonly isSelected: boolean;
  readonly onSelect: (id: Product['id']) => void;
  readonly index: number;
}

export function ProductCard({
  product,
  isSelected,
  onSelect,
  index,
}: ProductCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const discountPercent = calculateDiscountPercent(
    product.regularPrice,
    product.wholesalePrice
  );
  const unitSaving = product.regularPrice - product.wholesalePrice;
  const poolCurrent = product.poolCurrent ?? 25;
  const poolTarget = product.poolTarget ?? 50;
  const poolPercent = Math.min(
    100,
    Math.round((poolCurrent / Math.max(1, poolTarget)) * 100)
  );

  return (
    <motion.div
      layout
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.3,
        delay: prefersReducedMotion ? 0 : Math.min(index * 0.05, 0.3),
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      className="relative min-w-0"
    >
      <button
        type="button"
        role="radio"
        aria-checked={isSelected}
        aria-label={`${product.id} ${product.name}, o'lchov birligi ${product.unit}, oddiy narx ${formatMoney(product.regularPrice)}, ulgurji narx ${formatMoney(product.wholesalePrice)}, chegirma ${discountPercent}%`}
        data-testid={`product-card-${product.id}`}
        onClick={() => onSelect(product.id)}
        className={`group relative flex h-full w-full min-w-0 flex-col justify-between rounded-2xl border p-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-royal sm:p-5 ${
          isSelected
            ? 'border-ink-primary bg-white shadow-lg dark:border-blue-500 dark:bg-slate-800/95'
            : 'border-slate-200/90 bg-white/90 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-paper-surface/90 dark:hover:border-slate-700'
        }`}
      >
        {/* Tanlanganda layoutId bilan siljuvchi halqa */}
        {isSelected && (
          <motion.span
            layoutId="selected-product-ring"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-ink-primary dark:ring-blue-400"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}

        <div>
          {/* Yuqori qator: ID, Birlik va Chegirma foizi */}
          <div className="flex w-full flex-wrap items-center justify-between gap-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-ink dark:bg-slate-700 dark:text-slate-100">
                {product.id}
              </span>
              <span className="rounded-full border border-slate-200 bg-paper px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                1 {product.unit}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-lime-100 px-2 py-0.5 font-mono text-xs font-bold text-lime-900 dark:bg-lime-950/80 dark:text-lime-300">
                −{discountPercent}%
              </span>

              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isSelected
                    ? 'border-ink-primary bg-ink-primary text-white dark:border-blue-500 dark:bg-blue-500'
                    : 'border-slate-300 bg-transparent dark:border-slate-600'
                }`}
                aria-hidden="true"
              >
                {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </span>
            </div>
          </div>

          {/* O'rta qism: Illyustratsiya va Mahsulot nomi */}
          <div className="my-3 flex flex-wrap items-center gap-3 min-[300px]:flex-nowrap">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-paper-warm/80 p-1.5 dark:bg-slate-900/80 sm:h-16 sm:w-16">
              <ProductIllustration
                productId={product.id}
                iconType={product.iconType}
                className="h-10 w-10 sm:h-13 sm:w-13"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="break-words text-base font-extrabold text-ink dark:text-white sm:text-lg">
                {product.name}
              </h3>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Birlik:{' '}
                <strong className="text-ink dark:text-slate-200">
                  {product.unit}
                </strong>
                {product.category ? ` • ${product.category}` : ''}
              </p>
              <p className="mt-0.5 break-words text-[11px] text-slate-500 dark:text-slate-400">
                {product.shortSpec}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full">
          {/* Guruhli partiya yig'ilish progress chizig'i */}
          <div className="mb-2.5">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-1 text-[11px]">
              <span className="inline-flex items-center gap-1 truncate font-medium text-slate-500 dark:text-slate-400">
                <Store className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {product.sellerName ?? 'Ulgurji Ta’minot'}
                </span>
              </span>
              <span className="font-mono font-bold text-ink-primary dark:text-blue-400">
                Partiya: {poolCurrent}/{poolTarget} {product.unit} ({poolPercent}
                %)
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${poolPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
                className="h-full rounded-full bg-gradient-to-r from-ink-primary to-lime-accent dark:from-blue-500 dark:to-lime-bright"
              />
            </div>
          </div>

          {/* Pastki qism: Oddiy narx (chizilgan) va Ulgurji narx */}
          <div className="flex w-full flex-wrap items-end justify-between gap-2 border-t border-dashed border-slate-200 pt-2.5 dark:border-slate-700/80">
            <div>
              <span className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Oddiy narx:
              </span>
              <del
                data-testid={`regular-price-${product.id}`}
                className="font-mono text-xs font-semibold tabular-nums text-slate-500 line-through dark:text-slate-400 sm:text-sm"
              >
                {formatMoney(product.regularPrice)}
              </del>
            </div>

            <div className="text-right">
              <span className="block text-[11px] font-semibold text-ink-primary dark:text-blue-400">
                Ulgurji ({product.unit}):
              </span>
              <strong
                data-testid={`wholesale-price-${product.id}`}
                className="font-mono text-base font-extrabold tabular-nums text-ink dark:text-white sm:text-lg"
              >
                {formatMoney(product.wholesalePrice)}
              </strong>
            </div>
          </div>

          <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-1 rounded-lg bg-paper/90 px-2.5 py-1.5 text-[11px] dark:bg-slate-900/70">
            <span className="font-medium text-slate-600 dark:text-slate-400">
              1 {product.unit}dan foyda:
            </span>
            <span className="font-mono font-bold tabular-nums text-lime-800 dark:text-lime-300">
              +{formatMoney(unitSaving)}
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
