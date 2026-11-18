import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Database } from 'lucide-react';
import {
  DEFAULT_USERS,
  INITIAL_ORDERS,
  PRODUCTS,
  getProductById,
  type OrderStatus,
  type Product,
  type ProductId,
  type UserAccount,
  type UserRole,
  type WholesaleOrder,
} from './domain/products';
import { calculateOrderPricing } from './domain/pricing';
import {
  MAX_QUANTITY,
  validateOrderSubmission,
  validateQuantityInput,
} from './domain/validation';
import {
  isTestMode,
  mapOrderToRow,
  mapProductToRow,
  mapRowToOrder,
  mapRowToProduct,
  mapRowToUser,
  mapUserToRow,
  supabase,
  type DbOrderRow,
  type DbProductRow,
  type DbUserRow,
} from './lib/supabase';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { CalculatorForm } from './components/CalculatorForm';
import { MobileBottomBar } from './components/MobileBottomBar';
import {
  ConfirmationModal,
  type ConfirmedOrder,
} from './components/ConfirmationModal';
import { AuthModal } from './components/AuthModal';
import { AdminSellerDashboard } from './components/AdminSellerDashboard';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';

const STORAGE_KEYS = {
  PRODUCTS: 'birga_ulgurji_products_v2',
  ORDERS: 'birga_ulgurji_orders_v2',
  USERS: 'birga_ulgurji_users_v2',
  CURRENT_USER: 'birga_ulgurji_current_user_v2',
} as const;

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // 1. Dynamic Products State (Synced with Supabase PostgreSQL + localStorage fallback)
  const [products, setProducts] = useState<readonly Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return PRODUCTS;
  });

  // 2. Dynamic Users & Auth State
  const [users, setUsers] = useState<readonly UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) {
        const parsed = JSON.parse(saved) as UserAccount[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? (JSON.parse(saved) as UserAccount) : null;
    } catch {
      return null;
    }
  });

  // 3. Dynamic Orders State
  const [orders, setOrders] = useState<readonly WholesaleOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved) as WholesaleOrder[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedProductId, setSelectedProductId] = useState<ProductId>('M01');
  const [quantity, setQuantity] = useState<string>('1');
  const [customerName, setCustomerName] = useState<string>('');

  const [quantityTouched, setQuantityTouched] = useState<boolean>(false);
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [productError, setProductError] = useState<string | undefined>(
    undefined
  );
  const [shakeKey, setShakeKey] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(
    null
  );

  // Initial fetch from Supabase PostgreSQL
  useEffect(() => {
    if (isTestMode) return;

    let isMounted = true;

    async function loadFromSupabase() {
      try {
        const [prodRes, orderRes, userRes] = await Promise.all([
          supabase
            .from('birga_products')
            .select('*')
            .order('id', { ascending: true }),
          supabase
            .from('birga_orders')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from('birga_users')
            .select('*')
            .order('created_at', { ascending: true }),
        ]);

        if (!isMounted) return;

        if (!prodRes.error && prodRes.data && prodRes.data.length > 0) {
          setProducts(
            (prodRes.data as DbProductRow[]).map((row) => mapRowToProduct(row))
          );
          setDbConnected(true);
        }

        if (!orderRes.error && orderRes.data && orderRes.data.length > 0) {
          setOrders(
            (orderRes.data as DbOrderRow[]).map((row) => mapRowToOrder(row))
          );
        }

        if (!userRes.error && userRes.data && userRes.data.length > 0) {
          setUsers(
            (userRes.data as DbUserRow[]).map((row) => mapRowToUser(row))
          );
        }
      } catch {
        // Fallback to local state if network unavailable
      }
    }

    void loadFromSupabase();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(
          STORAGE_KEYS.CURRENT_USER,
          JSON.stringify(currentUser)
        );
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const selectedProduct = useMemo(() => {
    return (
      getProductById(selectedProductId, products) ?? products[0] ?? PRODUCTS[0]
    );
  }, [selectedProductId, products]);

  const qtyCheck = useMemo(() => validateQuantityInput(quantity), [quantity]);

  const pricing = useMemo(() => {
    if (!qtyCheck.valid || qtyCheck.value === undefined) {
      return null;
    }
    return calculateOrderPricing(selectedProduct, qtyCheck.value);
  }, [qtyCheck, selectedProduct]);

  const displayedQuantityError =
    (quantityTouched || submitAttempted) && !qtyCheck.valid
      ? qtyCheck.error
      : undefined;

  const handleSelectProduct = (id: ProductId) => {
    setSelectedProductId(id);
    setProductError(undefined);
  };

  const handleChangeQuantity = (value: string) => {
    setQuantity(value);
    setQuantityTouched(true);
  };

  const handleStepQuantity = (delta: number) => {
    setQuantityTouched(true);
    const currentCheck = validateQuantityInput(quantity);
    const currentVal =
      currentCheck.valid && currentCheck.value !== undefined
        ? currentCheck.value
        : 0;
    const nextVal = Math.min(MAX_QUANTITY, Math.max(1, currentVal + delta));
    setQuantity(String(nextVal));
  };

  const handleChangeName = (value: string) => {
    setCustomerName(value);
    if (value.trim().length > 0) {
      setNameError(undefined);
    }
  };

  const handleApplyPreset = (productId: ProductId, presetQty: string) => {
    setSelectedProductId(productId);
    setQuantity(presetQty);
    setQuantityTouched(true);
    setProductError(undefined);
  };

  // Auth handlers
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (!customerName.trim()) {
      setCustomerName(user.fullName);
      setNameError(undefined);
    }
    showToast(`Xush kelibsiz, ${user.fullName} (${user.role.toUpperCase()})!`);
  };

  const handleRegisterUser = (newUser: UserAccount) => {
    setUsers((prev) => [...prev, newUser]);
    if (!isTestMode) {
      void supabase.from('birga_users').upsert(mapUserToRow(newUser));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Tizimdan muvaffaqiyatli chiqdingiz.');
  };

  const handleQuickSwitchRole = (targetRole: UserRole) => {
    const matched = users.find((u) => u.role === targetRole) ?? DEFAULT_USERS[0];
    setCurrentUser(matched);
    if (!customerName.trim()) {
      setCustomerName(matched.fullName);
      setNameError(undefined);
    }
    showToast(
      `Faol rol o‘zgartirildi: ${matched.fullName} (${matched.role.toUpperCase()})`
    );
  };

  // Product Management handlers (Admin & Sotuvchi -> Supabase DB)
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    setSelectedProductId(newProduct.id);
    showToast(`Yangi mahsulot qo‘shildi: ${newProduct.id} — ${newProduct.name}`);

    if (!isTestMode) {
      void supabase.from('birga_products').upsert(mapProductToRow(newProduct));
    }
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    showToast(`${updated.id} — ${updated.name} ma’lumotlari yangilandi`);

    if (!isTestMode) {
      void supabase.from('birga_products').upsert(mapProductToRow(updated));
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => {
      const next = prev.filter((item) => item.id !== productId);
      if (selectedProductId === productId && next.length > 0) {
        setSelectedProductId(next[0].id);
      }
      return next.length > 0 ? next : PRODUCTS;
    });
    showToast(`Mahsulot (${productId}) katalogdan o‘chirildi`);

    if (!isTestMode) {
      void supabase.from('birga_products').delete().eq('id', productId);
    }
  };

  const handleResetCatalog = () => {
    setProducts(PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setSelectedProductId('M01');
    showToast('Standart katalog va buyurtmalar tiklandi');

    if (!isTestMode) {
      void supabase
        .from('birga_products')
        .upsert(PRODUCTS.map((p) => mapProductToRow(p)));
    }
  };

  // Order Management handlers (Supabase DB)
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Buyurtma #${orderId} holati "${status}" ga o‘zgartirildi`);

    if (!isTestMode) {
      void supabase
        .from('birga_orders')
        .update({ status })
        .eq('id', orderId);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Buyurtma #${orderId} o‘chirildi`);

    if (!isTestMode) {
      void supabase.from('birga_orders').delete().eq('id', orderId);
    }
  };

  // Submit wholesale order (Supabase DB)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setQuantityTouched(true);

    const validation = validateOrderSubmission(
      {
        productId: selectedProduct.id,
        quantity,
        customerName,
      },
      products
    );

    if (!validation.valid) {
      setNameError(validation.errors.customerName);
      setProductError(validation.errors.productId);
      setShakeKey((prev) => prev + 1);

      if (validation.errors.quantity) {
        document.getElementById('quantity-input')?.focus();
      } else if (validation.errors.customerName) {
        document.getElementById('customer-name-input')?.focus();
      }
      return;
    }

    setNameError(undefined);
    setProductError(undefined);

    const orderPricing = calculateOrderPricing(
      validation.product,
      validation.quantity
    );

    const generatedOrderId = `ORD-${1003 + orders.length}`;
    const newWholesaleOrder: WholesaleOrder = {
      id: generatedOrderId,
      customerName: validation.customerName,
      customerUsername: currentUser?.username ?? 'mehmon',
      productId: validation.product.id,
      productName: validation.product.name,
      unit: validation.product.unit,
      quantity: validation.quantity,
      regularPrice: validation.product.regularPrice,
      wholesalePrice: validation.product.wholesalePrice,
      wholesaleTotal: orderPricing.wholesaleTotal,
      savings: orderPricing.savings,
      status: 'Tasdiqlandi',
      createdAt: 'Hozirgina',
      sellerName: validation.product.sellerName ?? 'Birga Ulgurji Ta’minot',
    };

    const nextConfirmedOrder: ConfirmedOrder = {
      orderId: generatedOrderId,
      customerName: validation.customerName,
      product: validation.product,
      pricing: orderPricing,
    };

    const finalizeOrder = () => {
      setOrders((prev) => [newWholesaleOrder, ...prev]);
      const updatedPoolCurrent =
        (validation.product.poolCurrent ?? 20) + validation.quantity;

      setProducts((prev) =>
        prev.map((item) =>
          item.id === validation.product.id
            ? {
                ...item,
                poolCurrent: updatedPoolCurrent,
              }
            : item
        )
      );
      setConfirmedOrder(nextConfirmedOrder);

      if (!isTestMode) {
        void supabase
          .from('birga_orders')
          .insert(mapOrderToRow(newWholesaleOrder));
        void supabase
          .from('birga_products')
          .update({ pool_current: updatedPoolCurrent })
          .eq('id', validation.product.id);
      }
    };

    if (isTestMode || prefersReducedMotion) {
      finalizeOrder();
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      finalizeOrder();
    }, 450);
  };

  const handleMobileQuickAction = () => {
    const calcSection = document.getElementById('hisoblash');
    calcSection?.scrollIntoView({ behavior: 'smooth' });
    const nameInput = document.getElementById('customer-name-input');
    nameInput?.focus();
  };

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-paper text-ink transition-colors dark:bg-paper-dark dark:text-slate-100">
      <Header
        theme={theme}
        currentUser={currentUser}
        ordersCount={orders.length}
        onToggleTheme={toggleTheme}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onQuickSwitchRole={handleQuickSwitchRole}
      />

      {/* Jonli bildirishnoma (Toast) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            role="status"
            aria-live="polite"
            className="fixed right-2.5 top-16 z-50 flex max-w-xs items-center gap-2 rounded-2xl border border-lime-400/70 bg-ink px-3.5 py-2.5 text-xs font-bold text-white shadow-xl dark:bg-blue-600 sm:right-6"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-lime-400 dark:text-white" />
            <span className="break-words">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-w-0">
        <Hero
          productsCount={products.length}
          ordersCount={orders.length}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onQuickSwitchRole={handleQuickSwitchRole}
        />

        <div className="mx-auto max-w-6xl min-w-0 px-2 pt-6 sm:px-6 sm:pt-10">
          {/* Supabase Real-Time DB Holati indikatori */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs dark:border-slate-800 dark:bg-paper-surface/80">
            <div className="flex items-center gap-2">
              <Database className="h-3.5 w-3.5 shrink-0 text-ink-primary dark:text-blue-400" />
              <span className="font-bold text-ink dark:text-slate-200">
                Ma’lumotlar bazasi: Supabase PostgreSQL
              </span>
            </div>
            <span
              data-testid="supabase-status-badge"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-lime-700 dark:text-lime-400"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  dbConnected ? 'bg-lime-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              {dbConnected
                ? 'Cloud DB Sinhronlangan'
                : 'Tezkor kesh + Cloud DB'}
            </span>
          </div>

          {/* Admin yoki Sotuvchi tizimga kirgan bo'lsa — Boshqaruv va Yangi mahsulot qo'shish paneli */}
          <AnimatePresence>
            {(currentUser?.role === 'admin' ||
              currentUser?.role === 'sotuvchi') && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mb-8 min-w-0"
              >
                <AdminSellerDashboard
                  currentUser={currentUser}
                  products={products}
                  orders={orders}
                  users={users}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onResetCatalog={handleResetCatalog}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onDeleteOrder={handleDeleteOrder}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="min-w-0 lg:col-span-7">
              <ProductCatalog
                products={products}
                selectedProductId={selectedProduct.id}
                onSelectProduct={handleSelectProduct}
              />
            </div>

            <div className="min-w-0 lg:col-span-5">
              <CalculatorForm
                products={products}
                selectedProduct={selectedProduct}
                quantity={quantity}
                customerName={customerName}
                pricing={pricing}
                quantityError={displayedQuantityError}
                nameError={nameError}
                productError={productError}
                shakeKey={shakeKey}
                isSubmitting={isSubmitting}
                onSelectProduct={handleSelectProduct}
                onChangeQuantity={handleChangeQuantity}
                onStepQuantity={handleStepQuantity}
                onChangeName={handleChangeName}
                onApplyPreset={handleApplyPreset}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          <HowItWorks orders={orders} />
        </div>
      </main>

      <Footer />

      <MobileBottomBar
        selectedProduct={selectedProduct}
        pricing={pricing}
        onQuickAction={handleMobileQuickAction}
      />

      <ConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        users={users}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
      />
    </div>
  );
}
