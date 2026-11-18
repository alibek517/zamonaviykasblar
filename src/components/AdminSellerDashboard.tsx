import { type FormEvent, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Box,
  CheckCircle2,
  Edit3,
  PackagePlus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Store,
  Trash2,
  TrendingUp,
  Users,
  AlertCircle,
} from 'lucide-react';
import type {
  OrderStatus,
  Product,
  ProductCategory,
  ProductIconType,
  ProductUnit,
  UserAccount,
  WholesaleOrder,
} from '../domain/products';
import { calculateDiscountPercent } from '../domain/pricing';
import { validateProductForm } from '../domain/validation';
import { formatMoney, formatNumber } from '../lib/formatMoney';
import { ProductIllustration } from './ProductIllustrations';

interface AdminSellerDashboardProps {
  readonly currentUser: UserAccount;
  readonly products: readonly Product[];
  readonly orders: readonly WholesaleOrder[];
  readonly users: readonly UserAccount[];
  readonly onAddProduct: (product: Product) => void;
  readonly onUpdateProduct: (product: Product) => void;
  readonly onDeleteProduct: (productId: string) => void;
  readonly onResetCatalog: () => void;
  readonly onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  readonly onDeleteOrder: (orderId: string) => void;
}

const CATEGORIES: readonly ProductCategory[] = [
  'Kantselyariya',
  'Ofis texnikasi',
  'Qadoqlash va xo‘jalik',
  'Mebel va jihoz',
];

const UNITS: readonly ProductUnit[] = [
  'pachka',
  'dona',
  'quti',
  "to'plam",
  'rulon',
  'kg',
];

const ICON_TYPES: readonly { value: ProductIconType; label: string }[] = [
  { value: 'paper', label: 'A4 Qog‘oz' },
  { value: 'notebook', label: 'Daftar / Bloknot' },
  { value: 'pen', label: 'Ruchka / Marker' },
  { value: 'folder', label: 'Fayl papka' },
  { value: 'printer', label: 'Texnika / Kartridj' },
  { value: 'organizer', label: 'Organayzer / Jihoz' },
  { value: 'box', label: 'Quti / Qadoq' },
];

const ORDER_STATUSES: readonly OrderStatus[] = [
  'Kutilmoqda',
  'Tasdiqlandi',
  'Yetkazilmoqda',
  'Yakunlandi',
  'Bekor qilindi',
];

export function AdminSellerDashboard({
  currentUser,
  products,
  orders,
  users,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetCatalog,
  onUpdateOrderStatus,
  onDeleteOrder,
}: AdminSellerDashboardProps) {
  const isAdmin = currentUser.role === 'admin';
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users'>(
    'products'
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState<boolean>(true);

  // Form states
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<ProductUnit>('dona');
  const [category, setCategory] = useState<ProductCategory>('Kantselyariya');
  const [regularPrice, setRegularPrice] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [shortSpec, setShortSpec] = useState('');
  const [stock, setStock] = useState('250');
  const [poolTarget, setPoolTarget] = useState('50');
  const [iconType, setIconType] = useState<ProductIconType>('box');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const totalRevenue = orders
    .filter((o) => o.status !== 'Bekor qilindi')
    .reduce((sum, o) => sum + o.wholesaleTotal, 0);

  const totalSavings = orders
    .filter((o) => o.status !== 'Bekor qilindi')
    .reduce((sum, o) => sum + o.savings, 0);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setUnit('dona');
    setCategory('Kantselyariya');
    setRegularPrice('');
    setWholesalePrice('');
    setShortSpec('');
    setStock('250');
    setPoolTarget('50');
    setIconType('box');
    setFormError('');
  };

  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setUnit(product.unit);
    setCategory(product.category ?? 'Kantselyariya');
    setRegularPrice(String(product.regularPrice));
    setWholesalePrice(String(product.wholesalePrice));
    setShortSpec(product.shortSpec);
    setStock(String(product.stock ?? 200));
    setPoolTarget(String(product.poolTarget ?? 50));
    setIconType(product.iconType ?? 'box');
    setFormError('');
    setFormSuccess('');
    setShowProductForm(true);
  };

  const handleSubmitProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');

    const validation = validateProductForm({
      name,
      unit,
      category,
      regularPrice,
      wholesalePrice,
      shortSpec,
      stock,
      poolTarget,
      iconType,
      sellerName: currentUser.company || currentUser.fullName,
    });

    if (!validation.valid || !validation.value) {
      setFormError(validation.error ?? 'Ma’lumotlarni tekshiring.');
      return;
    }

    if (editingId) {
      const existing = products.find((p) => p.id === editingId);
      const updated: Product = {
        ...validation.value,
        id: editingId,
        poolCurrent: existing?.poolCurrent ?? 10,
      };
      onUpdateProduct(updated);
      setFormSuccess(`${editingId} — "${updated.name}" muvaffaqiyatli yangilandi!`);
      resetForm();
      return;
    }

    // Generate next M0X / MXX ID
    const existingNums = products
      .map((p) => {
        const match = /^M(\d+)$/i.exec(p.id);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !Number.isNaN(n));
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
    const nextNum = maxNum + 1;
    const newId = `M${String(nextNum).padStart(2, '0')}`;

    const created: Product = {
      ...validation.value,
      id: newId,
      poolCurrent: Math.max(
        1,
        Math.round((validation.value.poolTarget ?? 50) * 0.35)
      ),
    };

    onAddProduct(created);
    setFormSuccess(
      `Yangi mahsulot qo‘shildi: ${created.id} — "${created.name}" (${formatMoney(created.wholesalePrice)})`
    );
    resetForm();
  };

  return (
    <section
      id="boshqaruv-paneli"
      aria-labelledby="dashboard-heading"
      data-testid="admin-seller-dashboard"
      className="mt-8 scroll-mt-20 rounded-2xl border-2 border-ink-primary/20 bg-white p-2.5 shadow-xl dark:border-blue-500/30 dark:bg-paper-surface sm:rounded-3xl sm:p-6"
    >
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase ${
                isAdmin
                  ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300'
                  : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>Bosh Admin Paneli</span>
                </>
              ) : (
                <>
                  <Store className="h-3.5 w-3.5 shrink-0" />
                  <span>Sotuvchi Kabineti</span>
                </>
              )}
            </span>
            <span className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
              {currentUser.fullName}
            </span>
          </div>

          <h2
            id="dashboard-heading"
            className="mt-1 break-words text-lg font-extrabold text-ink dark:text-white sm:text-2xl"
          >
            {isAdmin
              ? 'Platforma, Mahsulotlar va Buyurtmalar Boshqaruvi'
              : 'Mahsulot qo‘shish va Savdo Boshqaruvi'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onResetCatalog}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-paper px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:border-ink hover:text-ink dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
            <span>Standart ma’lumotlar</span>
          </button>
        </div>
      </div>

      {/* KPI Kartochkalari */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-paper p-3 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="truncate">Katalog mahsulotlari</span>
            <Box className="h-4 w-4 shrink-0 text-ink-primary dark:text-blue-400" />
          </div>
          <strong className="mt-1 block font-mono text-lg font-extrabold text-ink dark:text-white sm:text-2xl">
            {products.length} tur
          </strong>
          <span className="block truncate text-[11px] text-slate-500">
            Yangi mahsulot qo‘shish ochiq
          </span>
        </div>

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-paper p-3 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="truncate">Ulgurji savdo hajmi</span>
            <TrendingUp className="h-4 w-4 shrink-0 text-lime-700 dark:text-lime-400" />
          </div>
          <strong className="mt-1 block truncate font-mono text-lg font-extrabold text-ink-primary dark:text-blue-400 sm:text-2xl">
            {formatMoney(totalRevenue)}
          </strong>
          <span className="block truncate text-[11px] text-slate-500">
            {orders.length} ta ulgurji buyurtma
          </span>
        </div>

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-paper p-3 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="truncate">Xaridorlar tejami</span>
            <ShoppingBag className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          </div>
          <strong className="mt-1 block truncate font-mono text-lg font-extrabold text-lime-800 dark:text-lime-300 sm:text-2xl">
            {formatMoney(totalSavings)}
          </strong>
          <span className="block truncate text-[11px] text-slate-500">
            Chakana narxga nisbatan foyda
          </span>
        </div>

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-paper p-3 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="truncate">Tizim foydalanuvchilari</span>
            <Users className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
          </div>
          <strong className="mt-1 block font-mono text-lg font-extrabold text-ink dark:text-white sm:text-2xl">
            {users.length} ta hisob
          </strong>
          <span className="block truncate text-[11px] text-slate-500">
            Admin, Sotuvchi va Mijozlar
          </span>
        </div>
      </div>

      {/* Ichki Bo'lim Tablari */}
      <div className="mt-4 flex flex-wrap gap-1.5 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold transition-colors ${
            activeTab === 'products'
              ? 'bg-ink-primary text-white shadow-sm dark:bg-blue-600'
              : 'bg-paper text-slate-700 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <PackagePlus className="h-3.5 w-3.5 shrink-0" />
          <span>Mahsulotlar boshqaruvi ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold transition-colors ${
            activeTab === 'orders'
              ? 'bg-ink-primary text-white shadow-sm dark:bg-blue-600'
              : 'bg-paper text-slate-700 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
          <span>Ulgurji buyurtmalar ({orders.length})</span>
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold transition-colors ${
              activeTab === 'users'
                ? 'bg-ink-primary text-white shadow-sm dark:bg-blue-600'
                : 'bg-paper text-slate-700 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span>Rollar va Foydalanuvchilar ({users.length})</span>
          </button>
        )}
      </div>

      {/* 1-TAB: MAHSULOT QO'SHISH VA BOSHQARISH */}
      {activeTab === 'products' && (
        <div className="mt-4 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-paper p-3 dark:border-slate-800 dark:bg-slate-900/90 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-extrabold text-ink dark:text-white sm:text-base">
                {editingId
                  ? `Mahsulotni tahrirlash (${editingId})`
                  : 'Yangi ulgurji mahsulot qo‘shish'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductForm((prev) => !prev)}
                className="text-xs font-bold text-ink-primary underline dark:text-blue-400"
              >
                {showProductForm ? 'Formani yashirish' : 'Formani ochish'}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {showProductForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmitProduct}
                  className="mt-3 space-y-3 overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label
                        htmlFor="new-prod-name"
                        className="block text-xs font-bold text-ink dark:text-slate-200"
                      >
                        Mahsulot nomi *
                      </label>
                      <input
                        id="new-prod-name"
                        data-testid="admin-product-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masalan: Stepler №10"
                        className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="new-prod-category"
                        className="block text-xs font-bold text-ink dark:text-slate-200"
                      >
                        Kategoriya *
                      </label>
                      <select
                        id="new-prod-category"
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value as ProductCategory)
                        }
                        className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="new-prod-unit"
                        className="block text-xs font-bold text-ink dark:text-slate-200"
                      >
                        O‘lchov birligi *
                      </label>
                      <select
                        id="new-prod-unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as ProductUnit)}
                        className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        {UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="new-prod-icon"
                        className="block text-xs font-bold text-ink dark:text-slate-200"
                      >
                        Illyustratsiya belgisi
                      </label>
                      <select
                        id="new-prod-icon"
                        value={iconType}
                        onChange={(e) =>
                          setIconType(e.target.value as ProductIconType)
                        }
                        className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        {ICON_TYPES.map((ic) => (
                          <option key={ic.value} value={ic.value}>
                            {ic.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label
                        htmlFor="new-prod-reg-price"
                        className="block text-xs font-bold text-ink dark:text-slate-200"
                      >
                        Oddiy (chakana) narx (so‘m) *
                      </label>
                      <input
                        id="new-prod-reg-price"
                        data-testid="admin-regular-price"
                        type="text"
                        inputMode="numeric"
                        value={regularPrice}
                        onChange={(e) => setRegularPrice(e.target.value)}
                        placeholder="Masalan: 15000"
                        className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs font-bold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="new-prod-whole-price"
                        className="block text-xs font-bold text-ink dark:text-slate-200"
                      >
                        Ulgurji narx (so‘m) *
                      </label>
                      <input
                        id="new-prod-whole-price"
                        data-testid="admin-wholesale-price"
                        type="text"
                        inputMode="numeric"
                        value={wholesalePrice}
                        onChange={(e) => setWholesalePrice(e.target.value)}
                        placeholder="Masalan: 11000"
                        className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs font-bold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="new-prod-stock"
                        className="block text-xs font-bold text-ink dark:text-slate-200"
                      >
                        Ombor zaxirasi ({unit})
                      </label>
                      <input
                        id="new-prod-stock"
                        type="text"
                        inputMode="numeric"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="250"
                        className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs font-bold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="new-prod-spec"
                        className="block text-xs font-bold text-ink dark:text-slate-200"
                      >
                        Qisqacha tavsif
                      </label>
                      <input
                        id="new-prod-spec"
                        type="text"
                        value={shortSpec}
                        onChange={(e) => setShortSpec(e.target.value)}
                        placeholder="Yuqori sifatli ulgurji mahsulot"
                        className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-ink-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {formError && (
                    <p
                      role="alert"
                      className="flex items-center gap-1.5 rounded-xl bg-red-50 p-2.5 text-xs font-bold text-red-600 dark:bg-red-950/50 dark:text-red-300"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{formError}</span>
                    </p>
                  )}

                  {formSuccess && (
                    <p
                      role="status"
                      className="flex items-center gap-1.5 rounded-xl bg-lime-100 p-2.5 text-xs font-bold text-lime-900 dark:bg-lime-950/60 dark:text-lime-300"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>{formSuccess}</span>
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="submit"
                      data-testid="admin-save-product-btn"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-ink-primary px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-ink dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                      <PackagePlus className="h-4 w-4 shrink-0" />
                      <span>
                        {editingId
                          ? 'O‘zgarishlarni saqlash'
                          : 'Katalogga mahsulot qo‘shish'}
                      </span>
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        Bekor qilish
                      </button>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Mavjud mahsulotlar ro'yxati (Tahrirlash va O'chirish) */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const disc = calculateDiscountPercent(
                product.regularPrice,
                product.wholesalePrice
              );
              return (
                <div
                  key={product.id}
                  className="flex min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-paper/60 p-3 dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="rounded-md bg-ink px-2 py-0.5 font-mono text-[11px] font-bold text-white dark:bg-blue-600">
                        {product.id}
                      </span>
                      <span className="rounded-full bg-lime-100 px-2 py-0.5 font-mono text-[11px] font-bold text-lime-900 dark:bg-lime-950 dark:text-lime-300">
                        −{disc}% ({product.unit})
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1 dark:bg-slate-800">
                        <ProductIllustration
                          productId={product.id}
                          iconType={product.iconType}
                          className="h-9 w-9"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-extrabold text-ink dark:text-white">
                          {product.name}
                        </h4>
                        <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                          {product.category ?? 'Kantselyariya'} • Zaxira:{' '}
                          {product.stock ?? 200} {product.unit}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-1 border-t border-dashed border-slate-200 pt-2 text-xs dark:border-slate-800">
                      <del className="font-mono text-slate-500">
                        {formatMoney(product.regularPrice)}
                      </del>
                      <strong className="font-mono text-sm font-extrabold text-ink-primary dark:text-blue-400">
                        {formatMoney(product.wholesalePrice)}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(product)}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-ink transition-colors hover:border-ink-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <Edit3 className="h-3.5 w-3.5 shrink-0" />
                      <span>Tahrirlash</span>
                    </button>

                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(product.id)}
                        aria-label={`${product.name} mahsulotini o‘chirish`}
                        className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2-TAB: BUYURTMALAR BOSHQARUVI */}
      {activeTab === 'orders' && (
        <div className="mt-4 space-y-3">
          {orders.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
              Hozircha ulgurji buyurtmalar mavjud emas.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="min-w-0 rounded-2xl border border-slate-200 bg-paper p-3.5 dark:border-slate-800 dark:bg-slate-900/90"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
                    <span className="font-mono text-xs font-extrabold text-ink dark:text-white">
                      #{order.id} • {order.createdAt}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        order.status === 'Yakunlandi' ||
                        order.status === 'Tasdiqlandi'
                          ? 'bg-lime-100 text-lime-900 dark:bg-lime-950 dark:text-lime-300'
                          : order.status === 'Bekor qilindi'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1 text-xs">
                    <p className="break-words">
                      <span className="text-slate-500">Xaridor:</span>{' '}
                      <strong className="text-ink dark:text-white">
                        {order.customerName}
                      </strong>
                    </p>
                    <p className="break-words">
                      <span className="text-slate-500">Mahsulot:</span>{' '}
                      <strong className="text-ink dark:text-white">
                        {order.productId} — {order.productName} (
                        {formatNumber(order.quantity)} {order.unit})
                      </strong>
                    </p>
                    <p className="break-words">
                      <span className="text-slate-500">Ulgurji jami:</span>{' '}
                      <strong className="font-mono text-ink-primary dark:text-blue-400">
                        {formatMoney(order.wholesaleTotal)}
                      </strong>{' '}
                      <span className="text-lime-700 dark:text-lime-400">
                        (Tejam: {formatMoney(order.savings)})
                      </span>
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 pt-2">
                    <select
                      aria-label={`Buyurtma ${order.id} holatini o‘zgartirish`}
                      value={order.status}
                      onChange={(e) =>
                        onUpdateOrderStatus(
                          order.id,
                          e.target.value as OrderStatus
                        )
                      }
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-ink dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          Holat: {st}
                        </option>
                      ))}
                    </select>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onDeleteOrder(order.id)}
                        className="rounded-xl border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                        title="Buyurtmani o'chirish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3-TAB: FOYDALANUVCHILAR VA ROLLAR (ADMIN UCHUN) */}
      {activeTab === 'users' && isAdmin && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="min-w-0 rounded-2xl border border-slate-200 bg-paper p-3.5 dark:border-slate-800 dark:bg-slate-900/90"
            >
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="rounded-full bg-ink-primary/10 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase text-ink-primary dark:bg-blue-500/20 dark:text-blue-300">
                  {u.role}
                </span>
                <span className="font-mono text-xs text-slate-500">
                  login: {u.username}
                </span>
              </div>
              <h4 className="mt-2 break-words text-sm font-extrabold text-ink dark:text-white">
                {u.fullName}
              </h4>
              <p className="mt-0.5 break-words text-xs text-slate-500 dark:text-slate-400">
                {u.company}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
