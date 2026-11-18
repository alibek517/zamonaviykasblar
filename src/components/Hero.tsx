import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDownRight,
  PackagePlus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import type { UserAccount, UserRole } from '../domain/products';

const HERO_WORDS = [
  'Ulgurji',
  'narxlarda',
  'to‘g‘ridan-to‘g‘ri',
  'va',
  'guruhli',
  'xarid',
  'platformasi',
];

interface HeroProps {
  readonly productsCount: number;
  readonly ordersCount: number;
  readonly currentUser: UserAccount | null;
  readonly onOpenAuthModal: () => void;
  readonly onQuickSwitchRole: (role: UserRole) => void;
}

export function Hero({
  productsCount,
  ordersCount,
  currentUser,
  onOpenAuthModal,
  onQuickSwitchRole,
}: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-paper-warm/80 to-paper py-6 dark:border-slate-800/80 dark:from-paper-surface/80 dark:to-paper-dark sm:py-12"
    >
      {/* Orqa fondagi suzuvchi animatsiyali SVG shakllar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute -right-12 -top-10 h-60 w-60 text-ink-primary/5 dark:text-blue-400/5"
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -14, 0], rotate: [0, 5, 0], scale: [1, 1.04, 1] }
          }
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect
            x="24"
            y="24"
            width="152"
            height="152"
            rx="28"
            fill="currentColor"
          />
        </motion.svg>

        <motion.svg
          viewBox="0 0 160 160"
          className="absolute -left-10 bottom-0 h-52 w-52 text-lime-accent/10 dark:text-lime-bright/5"
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, 14, 0], rotate: [0, -6, 0], scale: [1, 1.05, 1] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="80" cy="80" r="64" fill="currentColor" />
        </motion.svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-2.5 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-paper dark:bg-blue-600 dark:text-white">
                B2B & B2C Ulgurji Bozor
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800/85 dark:text-slate-300">
                <Sparkles
                  className="h-3.5 w-3.5 shrink-0 text-amber-accent dark:text-amber-bright"
                  aria-hidden="true"
                />
                <span>20% – 35% ulgurji chegirma</span>
              </span>
            </div>

            <h1
              id="hero-heading"
              className="break-words text-xl font-extrabold tracking-tight text-ink dark:text-white min-[320px]:text-2xl sm:text-4xl lg:text-5xl"
            >
              {HERO_WORDS.map((word, index) => (
                <motion.span
                  key={word}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 14 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: prefersReducedMotion ? 0 : index * 0.055,
                    ease: 'easeOut',
                  }}
                  className={`mr-2 inline-block ${
                    word === 'Ulgurji' || word === 'guruhli'
                      ? 'underline decoration-lime-accent decoration-4 underline-offset-4 dark:decoration-lime-bright'
                      : ''
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <p className="mt-3 max-w-2xl break-words text-xs leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
              Ofislar, o‘quv markazlari, do‘konlar va yakka xaridorlar uchun
              yagona ulgurji savdo tizimi. Mijoz sifatida arzon ulgurji narxda
              buyurtma bering, Sotuvchi yoki Admin sifatida yangi mahsulotlar
              qo‘shing va savdoni boshqaring.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <a
                href="#hisoblash"
                className="inline-flex items-center gap-1.5 rounded-xl bg-ink-primary px-3.5 py-2.5 text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-ink dark:bg-blue-600 dark:hover:bg-blue-500 sm:px-5 sm:py-3 sm:text-sm"
              >
                <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Ulgurji xaridni boshlash</span>
              </a>

              <a
                href="#mahsulotlar"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-ink transition-colors hover:border-ink-primary hover:bg-paper-warm dark:border-slate-700 dark:bg-paper-surface dark:text-slate-200 sm:px-4 sm:py-3 sm:text-sm"
              >
                <span>Katalog ({productsCount} tur)</span>
                <ArrowDownRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>

              {currentUser?.role === 'admin' ||
              currentUser?.role === 'sotuvchi' ? (
                <a
                  href="#boshqaruv-paneli"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300 bg-purple-50 px-3.5 py-2.5 text-xs font-extrabold text-purple-900 transition-colors hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-200 sm:px-4 sm:py-3 sm:text-sm"
                >
                  <PackagePlus className="h-4 w-4 shrink-0" />
                  <span>Yangi mahsulot qo‘shish</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onQuickSwitchRole('admin')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300 bg-purple-50 px-3.5 py-2.5 text-xs font-extrabold text-purple-900 transition-colors hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-200 sm:px-4 sm:py-3 sm:text-sm"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Admin panelga o‘tish</span>
                </button>
              )}
            </div>
          </div>

          {/* O'ng taraf: Jonli platforma ko'rsatkichlari va 3 rol kartasi */}
          <div className="min-w-0 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-3.5 shadow-md backdrop-blur-sm dark:border-slate-800 dark:bg-paper-surface/90 sm:p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 dark:border-slate-800">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Platforma holati
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-lime-700 dark:text-lime-400">
                  <span className="h-2 w-2 rounded-full bg-lime-500" />
                  Faol savdo
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-paper p-2.5 dark:bg-slate-900">
                  <span className="block text-[11px] text-slate-500">
                    Mahsulotlar
                  </span>
                  <strong className="font-mono text-base font-extrabold text-ink dark:text-white sm:text-xl">
                    {productsCount} xil
                  </strong>
                </div>
                <div className="rounded-xl bg-paper p-2.5 dark:bg-slate-900">
                  <span className="block text-[11px] text-slate-500">
                    Buyurtmalar
                  </span>
                  <strong className="font-mono text-base font-extrabold text-ink-primary dark:text-blue-400 sm:text-xl">
                    {ordersCount} ta
                  </strong>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-slate-200 bg-paper/70 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Joriy hisob:
                  </span>
                  <strong className="truncate text-ink dark:text-white">
                    {currentUser
                      ? `${currentUser.fullName} (${currentUser.role.toUpperCase()})`
                      : 'Mehmon (Mijoz)'}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="mt-2 w-full rounded-lg bg-ink/10 py-1.5 text-center text-[11px] font-extrabold text-ink transition-colors hover:bg-ink hover:text-white dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white"
                >
                  Login / Boshqa rolga kirish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
