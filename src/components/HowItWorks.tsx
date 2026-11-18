import { ShieldCheck, ShoppingBag, Store, Truck } from 'lucide-react';
import type { WholesaleOrder } from '../domain/products';
import { formatMoney, formatNumber } from '../lib/formatMoney';

interface HowItWorksProps {
  readonly orders: readonly WholesaleOrder[];
}

const ROLES_INFO = [
  {
    role: 'Mijoz (Xaridor)',
    badge: 'login: mijoz / parol: 123',
    description:
      'Katalogdagi barcha mahsulotlarni ulgurji narxda tanlaydi, sof foydasini ko‘radi va guruhli ulgurji partiyaga buyurtma beradi.',
    icon: ShoppingBag,
  },
  {
    role: 'Sotuvchi (Ta’minotchi)',
    badge: 'login: sotuvchi / parol: 123',
    description:
      'Sotuvchi kabinetidan yangi ulgurji mahsulotlar qo‘shadi, narx va ombor qoldig‘ini yangilaydi hamda buyurtmalarni tasdiqlaydi.',
    icon: Store,
  },
  {
    role: 'Bosh Admin',
    badge: 'login: admin / parol: 123',
    description:
      'Butun platforma aylanmasi, barcha mahsulotlar, buyurtma holatlari va ro‘yxatdan o‘tgan foydalanuvchilarni to‘liq boshqaradi.',
    icon: ShieldCheck,
  },
] as const;

export function HowItWorks({ orders }: HowItWorksProps) {
  return (
    <div className="mt-10 space-y-10">
      {/* Faol ulgurji buyurtmalar bo'limi */}
      <section
        id="buyurtmalar"
        aria-labelledby="orders-feed-heading"
        className="min-w-0 scroll-mt-20 border-t border-slate-200/80 pt-8 dark:border-slate-800/80"
      >
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div className="min-w-0">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-primary dark:text-blue-400">
              Jonli savdo jarayoni
            </span>
            <h2
              id="orders-feed-heading"
              className="mt-1 break-words text-xl font-extrabold tracking-tight text-ink dark:text-white sm:text-2xl"
            >
              Rasmiylashtirilgan ulgurji buyurtmalar ({orders.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orders.slice(0, 6).map((order) => (
            <div
              key={order.id}
              className="min-w-0 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-paper-surface"
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="font-mono text-xs font-extrabold text-ink dark:text-white">
                  #{order.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    order.status === 'Yakunlandi' ||
                    order.status === 'Tasdiqlandi'
                      ? 'bg-lime-100 text-lime-900 dark:bg-lime-950 dark:text-lime-300'
                      : order.status === 'Bekor qilindi'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  <Truck className="h-3 w-3 shrink-0" />
                  <span>{order.status}</span>
                </span>
              </div>

              <h3 className="mt-2 truncate text-sm font-extrabold text-ink dark:text-white">
                {order.productId} — {order.productName}
              </h3>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                Xaridor: {order.customerName} • {formatNumber(order.quantity)}{' '}
                {order.unit}
              </p>

              <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-1 border-t border-dashed border-slate-200 pt-2 text-xs dark:border-slate-800">
                <span className="font-mono font-extrabold text-ink-primary dark:text-blue-400">
                  {formatMoney(order.wholesaleTotal)}
                </span>
                <span className="font-mono font-bold text-lime-800 dark:text-lime-300">
                  Foyda: +{formatMoney(order.savings)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 xil rol va platforma tuzilmasi */}
      <section
        id="qanday-ishlaydi"
        aria-labelledby="how-it-works-heading"
        className="min-w-0 scroll-mt-20 border-t border-slate-200/80 pt-8 dark:border-slate-800/80"
      >
        <div className="mb-6 max-w-2xl">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-primary dark:text-blue-400">
            Platforma ekotizimi • 3 xil rol
          </span>
          <h2
            id="how-it-works-heading"
            className="mt-1 break-words text-xl font-extrabold tracking-tight text-ink dark:text-white sm:text-3xl"
          >
            Mijoz, Sotuvchi va Admin imkoniyatlari
          </h2>
          <p className="mt-1 break-words text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Yuqori menyudagi tugmalar yoki Login oynasi orqali istalgan rolga
            o‘tib barcha funksiyalarni boshqarishingiz mumkin
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ROLES_INFO.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.role}
                className="min-w-0 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-paper-surface sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper-warm text-ink-primary dark:bg-slate-800 dark:text-blue-400">
                    <IconComponent className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {item.badge}
                  </span>
                </div>

                <h3 className="mt-3 break-words text-base font-extrabold text-ink dark:text-white">
                  {item.role}
                </h3>
                <p className="mt-1.5 break-words text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-sm">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
