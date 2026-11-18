import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import type { Product } from '../domain/products';
import type { OrderPricing } from '../domain/pricing';
import { formatMoney, formatNumber } from '../lib/formatMoney';

export interface ConfirmedOrder {
  readonly orderId?: string;
  readonly customerName: string;
  readonly product: Product;
  readonly pricing: OrderPricing;
}

interface ConfirmationModalProps {
  readonly order: ConfirmedOrder | null;
  readonly onClose: () => void;
}

const CONFETTI_PARTICLES = [
  { id: 1, dx: -75, dy: -55, color: '#84CC16', rotate: -35 },
  { id: 2, dx: -40, dy: -70, color: '#2563EB', rotate: 25 },
  { id: 3, dx: 0, dy: -80, color: '#F59E0B', rotate: -15 },
  { id: 4, dx: 45, dy: -68, color: '#84CC16', rotate: 40 },
  { id: 5, dx: 78, dy: -52, color: '#1E3A8A', rotate: -30 },
  { id: 6, dx: -60, dy: -25, color: '#F59E0B', rotate: 50 },
  { id: 7, dx: 62, dy: -22, color: '#84CC16', rotate: -45 },
];

export function ConfirmationModal({ order, onClose }: ConfirmationModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!order) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const timer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 20);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [order, onClose]);

  return (
    <AnimatePresence>
      {order && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          data-testid="confirmation-modal"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-ink/65 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            ref={dialogRef}
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.92, y: 16 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 10 }
            }
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 28,
            }}
            className="relative z-10 my-auto w-full max-w-md min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl dark:border-slate-700 dark:bg-paper-surface sm:rounded-3xl sm:p-7"
          >
            {/* Yopish tugmasi */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Modalni yopish"
              className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-paper text-slate-600 transition-colors hover:border-ink hover:text-ink dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:right-4 sm:top-4 sm:h-9 sm:w-9"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* SVG Check-mark va yengil konfetti */}
            <div className="relative mx-auto flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
              {!prefersReducedMotion &&
                CONFETTI_PARTICLES.map((particle) => (
                  <motion.span
                    key={particle.id}
                    aria-hidden="true"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
                    animate={{
                      x: particle.dx,
                      y: particle.dy,
                      opacity: 0,
                      scale: 1.1,
                      rotate: particle.rotate,
                    }}
                    transition={{ duration: 1.6, ease: 'easeOut' }}
                    style={{ backgroundColor: particle.color }}
                    className="pointer-events-none absolute h-2.5 w-2.5 rounded-sm"
                  />
                ))}

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100 text-lime-800 ring-4 ring-lime-50 dark:bg-lime-950/80 dark:text-lime-300 dark:ring-lime-900/30 sm:h-16 sm:w-16">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M7 16.5L13 22.5L25 10"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="32"
                    initial={{ strokeDashoffset: prefersReducedMotion ? 0 : 32 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />
                </svg>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="inline-block rounded-full bg-lime-100 px-3 py-0.5 font-mono text-xs font-bold text-lime-900 dark:bg-lime-950 dark:text-lime-300">
                {order.orderId ? `Buyurtma #${order.orderId}` : 'Buyurtma qabul qilindi'}
              </span>
              <h3
                id="modal-title"
                className="mt-1.5 break-words text-lg font-extrabold text-ink dark:text-white sm:text-2xl"
              >
                Ulgurji buyurtma tasdiqlandi!
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Buyurtmangiz ulgurji partiyaga qo‘shildi va sotuvchiga yuborildi
              </p>
            </div>

            <dl className="mt-4 divide-y divide-dashed divide-slate-200 rounded-2xl border border-slate-200 bg-paper p-3 text-xs dark:divide-slate-700/80 dark:border-slate-700 dark:bg-slate-900/90 sm:p-4 sm:text-sm">
              <div className="flex flex-wrap items-center justify-between gap-1 py-2 first:pt-0">
                <dt className="font-medium text-slate-600 dark:text-slate-400">
                  Xaridor ismi:
                </dt>
                <dd
                  data-testid="modal-customer-name"
                  className="break-words font-extrabold text-ink dark:text-white"
                >
                  {order.customerName}
                </dd>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1 py-2">
                <dt className="font-medium text-slate-600 dark:text-slate-400">
                  Mahsulot:
                </dt>
                <dd
                  data-testid="modal-product"
                  className="break-words font-bold text-ink dark:text-white"
                >
                  {order.product.id} — {order.product.name} ({order.product.unit})
                </dd>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1 py-2">
                <dt className="font-medium text-slate-600 dark:text-slate-400">
                  Miqdor:
                </dt>
                <dd
                  data-testid="modal-quantity"
                  className="font-mono font-bold tabular-nums text-ink dark:text-white"
                >
                  {formatNumber(order.pricing.quantity)} {order.product.unit}
                </dd>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1 py-2">
                <dt className="font-bold text-ink dark:text-slate-200">
                  Ulgurji jami:
                </dt>
                <dd
                  data-testid="modal-wholesale-total"
                  className="font-mono text-base font-extrabold tabular-nums text-ink-primary dark:text-blue-400 sm:text-lg"
                >
                  {formatMoney(order.pricing.wholesaleTotal)}
                </dd>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1 py-2 last:pb-0">
                <dt className="font-semibold text-lime-900 dark:text-lime-300">
                  Sizning foydangiz (Tejam):
                </dt>
                <dd
                  data-testid="modal-savings-total"
                  className="font-mono font-extrabold tabular-nums text-lime-800 dark:text-lime-300"
                >
                  {formatMoney(order.pricing.savings)}
                </dd>
              </div>
            </dl>

            <div
              id="modal-disclaimer"
              data-testid="modal-disclaimer"
              className="mt-3 flex items-start gap-2 rounded-xl border border-lime-300/80 bg-lime-50/90 p-2.5 text-xs font-medium text-lime-950 dark:border-lime-700/60 dark:bg-lime-950/50 dark:text-lime-200"
            >
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-lime-700 dark:text-lime-400"
                aria-hidden="true"
              />
              <span className="break-words">
                Buyurtmangiz &ldquo;Ulgurji buyurtmalar&rdquo; ro‘yxatiga
                qo‘shildi. Holatni Admin va Sotuvchi panelida ham kuzatishingiz
                mumkin.
              </span>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              data-testid="modal-close-button"
              className="mt-4 flex h-10 w-full items-center justify-center rounded-xl bg-ink px-4 text-xs font-extrabold text-white transition-colors hover:bg-ink-primary dark:bg-blue-600 dark:hover:bg-blue-500 sm:h-11 sm:text-sm"
            >
              Davom etish
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
