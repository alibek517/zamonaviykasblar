import {
  Layers,
  LogIn,
  LogOut,
  Moon,
  ShieldCheck,
  ShoppingBag,
  Store,
  Sun,
  UserCheck,
} from 'lucide-react';
import type { ThemeMode } from '../hooks/useTheme';
import type { UserAccount, UserRole } from '../domain/products';

interface HeaderProps {
  readonly theme: ThemeMode;
  readonly currentUser: UserAccount | null;
  readonly ordersCount: number;
  readonly onToggleTheme: () => void;
  readonly onOpenAuthModal: () => void;
  readonly onLogout: () => void;
  readonly onQuickSwitchRole: (role: UserRole) => void;
}

export function Header({
  theme,
  currentUser,
  ordersCount,
  onToggleTheme,
  onOpenAuthModal,
  onLogout,
  onQuickSwitchRole,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-paper/95 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-paper-dark/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-2 py-2.5 sm:px-6 sm:py-3">
        {/* Brend logotipi */}
        <a
          href="#top"
          className="group flex min-w-0 items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-royal"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ink text-paper shadow-sm transition-transform group-hover:scale-105 dark:bg-blue-600 dark:text-white sm:h-10 sm:w-10">
            <Layers className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <span className="block truncate text-sm font-extrabold tracking-tight text-ink dark:text-white sm:text-lg">
              Birga Ulgurji
            </span>
            <span className="hidden truncate text-[11px] font-medium text-slate-600 dark:text-slate-400 min-[340px]:block">
              Ulgurji savdo platformasi
            </span>
          </div>
        </a>

        {/* Asosiy navigatsiya */}
        <nav
          aria-label="Asosiy navigatsiya"
          className="hidden items-center gap-1 lg:flex"
        >
          <a
            href="#mahsulotlar"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200/60 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Katalog
          </a>
          <a
            href="#hisoblash"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200/60 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Ulgurji buyurtma
          </a>
          <a
            href="#buyurtmalar"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200/60 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Buyurtmalar ({ordersCount})
          </a>
          {(currentUser?.role === 'admin' ||
            currentUser?.role === 'sotuvchi') && (
            <a
              href="#boshqaruv-paneli"
              className="rounded-lg bg-ink-primary/10 px-3 py-2 text-sm font-extrabold text-ink-primary transition-colors hover:bg-ink-primary hover:text-white dark:bg-blue-500/20 dark:text-blue-300"
            >
              {currentUser.role === 'admin'
                ? 'Admin Panel'
                : 'Sotuvchi Kabineti'}
            </a>
          )}
        </nav>

        {/* O'ng taraf: 3 Rol tezkor tugmalari, Kirish / Profil va Tun/Kun */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* 3 xil rolni bir zumda sinab ko'rish va almashtirish */}
          <div
            role="group"
            aria-label="Rolni tanlash"
            className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-white/90 p-1 dark:border-slate-700 dark:bg-slate-900"
          >
            <button
              type="button"
              data-testid="role-switch-mijoz"
              onClick={() => onQuickSwitchRole('mijoz')}
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition-colors ${
                currentUser?.role === 'mijoz'
                  ? 'bg-lime-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
              title="Mijoz (Xaridor) sifatida ko'rish"
            >
              <UserCheck className="h-3 w-3 shrink-0" />
              <span>Mijoz</span>
            </button>

            <button
              type="button"
              data-testid="role-switch-sotuvchi"
              onClick={() => onQuickSwitchRole('sotuvchi')}
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition-colors ${
                currentUser?.role === 'sotuvchi'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
              title="Sotuvchi (Ta'minotchi) sifatida ko'rish"
            >
              <Store className="h-3 w-3 shrink-0" />
              <span>Sotuvchi</span>
            </button>

            <button
              type="button"
              data-testid="role-switch-admin"
              onClick={() => onQuickSwitchRole('admin')}
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition-colors ${
                currentUser?.role === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
              title="Admin sifatida ko'rish va mahsulot qo'shish"
            >
              <ShieldCheck className="h-3 w-3 shrink-0" />
              <span>Admin</span>
            </button>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onOpenAuthModal}
                data-testid="open-auth-modal-btn"
                className="inline-flex max-w-[130px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-ink hover:border-ink-primary dark:border-slate-700 dark:bg-paper-surface dark:text-slate-200 sm:max-w-[180px]"
                title="Hisobni almashtirish"
              >
                <ShoppingBag className="h-3.5 w-3.5 shrink-0 text-ink-primary dark:text-blue-400" />
                <span className="truncate">{currentUser.username}</span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                aria-label="Hisobdan chiqish"
                title="Hisobdan chiqish"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 hover:border-red-500 hover:text-red-600 dark:border-slate-700 dark:bg-paper-surface dark:text-slate-300"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              data-testid="open-auth-modal-btn"
              className="inline-flex items-center gap-1.5 rounded-xl bg-ink-primary px-3 py-1.5 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-ink dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <LogIn className="h-3.5 w-3.5 shrink-0" />
              <span>Kirish</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === 'dark'
                ? 'Yorug‘ rejimga o‘tish'
                : 'Tungi rejimga o‘tish'
            }
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:border-ink-royal hover:text-ink-royal dark:border-slate-700 dark:bg-paper-surface dark:text-slate-200 sm:h-9 sm:w-9"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
