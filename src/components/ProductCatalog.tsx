import { type KeyboardEvent, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Product, ProductId } from '../domain/products';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  readonly products: readonly Product[];
  readonly selectedProductId: ProductId;
  readonly onSelectProduct: (id: ProductId) => void;
}

const CATEGORY_FILTERS = [
  'Barchasi',
  'Kantselyariya',
  'Ofis texnikasi',
  'Qadoqlash va xo‘jalik',
  'Mebel va jihoz',
] as const;

export function ProductCatalog({
  products,
  selectedProductId,
  onSelectProduct,
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Barchasi' ||
        (item.category ?? 'Kantselyariya') === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      return (
        matchesCategory &&
        (item.name.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.shortSpec.toLowerCase().includes(q))
      );
    });
  }, [products, selectedCategory, searchQuery]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = filteredProducts.findIndex(
      (item) => item.id === selectedProductId
    );
    if (currentIndex === -1 || filteredProducts.length === 0) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % filteredProducts.length;
      onSelectProduct(filteredProducts[nextIndex].id);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex =
        (currentIndex - 1 + filteredProducts.length) % filteredProducts.length;
      onSelectProduct(filteredProducts[prevIndex].id);
    }
  };

  return (
    <section
      id="mahsulotlar"
      aria-labelledby="catalog-heading"
      className="min-w-0 scroll-mt-20"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-primary dark:text-blue-400">
            Ulgurji katalog
          </span>
          <h2
            id="catalog-heading"
            className="mt-1 break-words text-xl font-extrabold tracking-tight text-ink dark:text-white sm:text-3xl"
          >
            Ulgurji mahsulotlar vitrinasi
          </h2>
          <p className="mt-1 break-words text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Mahsulotni tanlab to‘g‘ridan-to‘g‘ri ulgurji narxda buyurtma bering
          </p>
        </div>

        <span className="rounded-full border border-slate-300 bg-white px-2.5 py-1 font-mono text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-paper-surface dark:text-slate-300">
          {filteredProducts.length} / {products.length} ta mahsulot
        </span>
      </div>

      {/* Qidiruv va Kategoriya filtrlari */}
      <div className="mb-4 space-y-2.5 rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-paper-surface sm:p-3.5">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mahsulot nomi yoki kodi bo‘yicha qidirish (M01, A4, Daftar...)"
            aria-label="Mahsulot qidirish"
            className="w-full rounded-xl border border-slate-300 bg-paper py-2 pl-9 pr-3 text-xs font-semibold text-ink focus:border-ink-primary focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="h-3 w-3 shrink-0" />
            <span>Bo‘lim:</span>
          </span>
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-ink-primary text-white dark:bg-blue-600'
                  : 'bg-paper text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-center dark:border-slate-700 dark:bg-paper-surface">
          <p className="text-sm font-bold text-ink dark:text-white">
            Qidiruv bo‘yicha mahsulot topilmadi
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Barchasi');
              setSearchQuery('');
            }}
            className="mt-2 rounded-lg bg-ink-primary px-3 py-1.5 text-xs font-bold text-white"
          >
            Barcha mahsulotlarni ko‘rsatish
          </button>
        </div>
      ) : (
        <div
          role="radiogroup"
          aria-labelledby="catalog-heading"
          onKeyDown={handleKeyDown}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
        >
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={product.id === selectedProductId}
              onSelect={onSelectProduct}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}
