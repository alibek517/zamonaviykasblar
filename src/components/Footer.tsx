export function Footer() {
  return (
    <footer className="mt-14 border-t border-slate-200/80 bg-paper-warm/60 pb-24 pt-8 text-xs text-slate-600 dark:border-slate-800/80 dark:bg-paper-surface/60 dark:text-slate-400 lg:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-2.5 sm:flex-row sm:items-center sm:px-6">
        <div className="min-w-0">
          <p className="break-words font-bold text-ink dark:text-slate-200">
            Birga Ulgurji — Ulgurji Savdo va Guruhli Xarid Platformasi
          </p>
          <p className="mt-1 break-words">
            Mijoz, Sotuvchi va Admin boshqaruv tizimiga ega yagona savdo
            ekotizimi.
          </p>
        </div>

        <p className="rounded-lg border border-slate-300/80 bg-white/80 px-3 py-1.5 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          © {new Date().getFullYear()} Birga Ulgurji • Barcha huquqlar
          himoyalangan
        </p>
      </div>
    </footer>
  );
}
