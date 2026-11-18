import type { Product } from '../domain/products';
import type { OrderPricing } from '../domain/pricing';
import { formatMoney } from '../lib/formatMoney';
import { ArrowUpRight } from 'lucide-react';

interface MobileBottomBarProps {
  readonly selectedProduct: Product;
  readonly pricing: OrderPricing | null;
  readonly onQuickAction: () => void;
}

export function MobileBottomBar({
  selectedProduct,
  pricing,
  onQuickAction,
}: MobileBottomBarProps) {
  return (
    <div
      role="region"
      aria-label="Mobil tezkor buyurtma paneli"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/90 bg-white/95 px-2.5 py-2.5 shadow-[0_-8px_24px_rgba(15,30,54,0.08)] backdrop-blur-md dark:border-slate-800 dark:bg-paper-surface/95 lg:hidden"
    >
      <div className="mx-auto flex max-w-lg flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="block truncate text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            {selectedProduct.id} • {selectedProduct.name}
          </span>
          {pricing ? (
            <div className="flex flex-wrap items-baseline gap-1.5">
              <strong className="font-mono text-sm font-extrabold tabular-nums text-ink dark:text-white sm:text-base">
                {formatMoney(pricing.wholesaleTotal)}
              </strong>
              <span className="font-mono text-[11px] font-bold tabular-nums text-lime-800 dark:text-lime-300">
                (Foyda: {formatMoney(pricing.savings)})
              </span>
            </div>
          ) : (
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
              Miqdorni kiriting
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onQuickAction}
          className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-ink-primary px-3 py-2 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-ink dark:bg-blue-600"
        >
          <span>Buyurtma</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
