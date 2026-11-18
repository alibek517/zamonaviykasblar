# Birga Ulgurji — Ulgurji Savdo va Guruhli Xarid Platformasi

**Birga Ulgurji** — mahsulotlarni ulgurji narxda sotish, guruhli buyurtmalar yig‘ish hamda **Mijoz**, **Sotuvchi** va **Admin** rollari orqali mahsulot va buyurtmalarni to‘liq boshqarishga mo‘ljallangan zamonaviy savdo platformasi.

---

## 1. Asosiy Imkoniyatlar

- **3 xil Rol va Real Login / Ro‘yxatdan o‘tish tizimi:**
  - **Admin (`login: admin` / `parol: 123`):** Platforma statistikasi, yangi ulgurji mahsulotlar qo‘shish, mavjud mahsulotlarni tahrirlash/o‘chirish, barcha ulgurji buyurtmalar holatini boshqarish (`Kutilmoqda`, `Tasdiqlandi`, `Yetkazilmoqda`, `Yakunlandi`, `Bekor qilindi`) va foydalanuvchilar ro‘yxati.
  - **Sotuvchi (`login: sotuvchi` / `parol: 123`):** Sotuvchi kabineti orqali katalogga yangi mahsulot qo‘shish, narx va ombor zaxirasini tahrirlash, kelib tushgan ulgurji buyurtmalarni boshqarish.
  - **Mijoz (`login: mijoz` / `parol: 123`):** Bo‘limlar va qidiruv bo‘yicha ulgurji mahsulotlarni ko‘rish, foyda va ulgurji to‘lovni real vaqtda hisoblash, guruhli partiyalarga buyurtma berish.
- **200px gacha Ultra-Responsive Dizayn:**
  - `200px`, `360px`, `768px` va `1280px+` o‘lchamlarda gorizontal siljishsiz (`overflow-x-hidden`) moslashuvchan interfeys.
- **Boy Animatsiyalar (Framer Motion):**
  - Stagger kirish animatsiyalari, `layoutId` tanlov halqasi, guruhli partiya progress chiziqlari, count-up raqamlar, validatsiya `shake` effekti va konfetti bilan tasdiqlash modali.

---

## 2. Ishga tushirish

```bash
# Paketlarni o'rnatish
npm install

# Development serverni ishga tushirish
npm run dev

# Avtomatik testlarni tekshirish
npm run test

# Kod sifatini tekshirish (ESLint)
npm run lint

# Production build
npm run build
```
