# DEMO.md — 5 Daqiqalik Taqdimot Skripti va Himoya Qo‘llanmasi

Ushbu hujjat hakamlar oldida **5 daqiqalik taqdimot** o‘tkazish va **10 daqiqalik savol-javob / amaliy o‘zgartirish** bosqichidan muvaffaqiyatli o‘tish uchun tayyorlangan.

---

## 1-daqiqa: Muammo va G‘oya (Dolzarblik)
- **Nutq:** *"Assalomu alaykum, hurmatli hakamlar! Loyihamiz nomi — **Birga Ulgurji** (BILET 002). Kichik ofislar, o‘quv markazlari va talabalar kantselyariya mahsulotlarini yakka holda chakana narxda xarid qilganda 20–30% ortiqcha xarajat qilishadi. Bizning platformamiz bir mahsulotni ulgurji olishga qiziqqan xaridorlar talabini yig‘adi va xaridorga real vaqtda qancha pul tejashini aniq formula bilan hisoblab beradi."*
- **Ko‘rsatiladigan joy:** Yuqori Hero qismi, `"Sinov namunasi"` belgisi va Dark/Light rejim tugmasi.

---

## 2-daqiqa: Boshlang‘ich Ma’lumotlar va Katalog (M01–M04)
- **Nutq:** *"Bilet talabiga muvofiq 4 ta mahsulot — M01 (A4 qog‘oz, pachka), M02 (Daftar, dona), M03 (Ruchka, dona) va M04 (Fayl papkasi, dona) kartochkalarda keltirilgan. Har bir kartochkada ID, o‘lchov birligi, chizilgan oddiy narx, ulgurji narx va chegirma foizi ko‘rsatilgan. Tashqi og‘ir rasmlar o‘rniga tezkor inline SVG illyustratsiyalar chizilgan."*
- **Ko‘rsatiladigan joy:** Mahsulot kartochkalarini sichqoncha yoki klaviatura yo‘nalish tugmalari bilan tanlab, `layoutId` halqasi silliq ko‘chishini ko‘rsating.

---

## 3-daqiqa: Jonli Demo (`M01 × 3` va `M02 × 5`)
- **Nutq:** *"Endi tekshiruv stsenariylarini sinab ko‘ramiz:*
  1. *Forma tepasidagi **`M01 × 3`** chipini bosamiz: A4 qog‘ozdan 3 pachka tanlandi. Ulgurji jami `3 × 40 000 = 120 000 so'm`, taxminiy tejam esa `3 × (50 000 − 40 000) = 30 000 so'm`.*
  2. *Endi **`M02 × 5`** chipini bosamiz: Daftardan 5 dona tanlandi. Ulgurji jami `30 000 so'm`, tejam esa `10 000 so'm` ga darhol yangilandi.*
  3. *Ism maydoniga ismimizni yozib, **“Guruhli xaridga qo‘shilish”** tugmasini bosamiz. Ochilgan tasdiqlash modalida ism, mahsulot, miqdor, ulgurji jami va haqiqiy xarid amalga oshmasligi haqidagi rasmiy eslatma chiqadi."*

---

## 4-daqiqa: Qat’iy Validatsiya va Xato Holatlar
- **Nutq:** *"Tizim noto‘g‘ri ma’lumotlarga nisbatan qat’iy himoyalangan. Miqdor maydoniga `0`, `-2`, `2.5` yoki `03` kiritilsa yoxud ism bo‘sh qoldirilsa, Zod va `^[1-9]\d*$` regex validatsiyasi so‘rovni qabul qilmaydi va maydon ostida o‘zbek tilida aniq xato xabarini chiqaradi."*
- **Ko‘rsatiladigan joy:** Miqdorga `0` yoki `2.5` yozib, xato xabari va yengil `shake` animatsiyasini ko‘rsating.

---

## 5-daqiqa: Texnologik Stek va Arxitektura Xulosasi
- **Nutq:** *"Loyiha Vite, React 18, qat’iy TypeScript, Tailwind CSS, Framer Motion va Zod yordamida Domain-Driven arxitekturada yozilgan. Barcha hisob-kitob va validatsiya mantiqi `src/domain/` qatlamida UI'dan ajratilgan va Vitest avtomatik testlari bilan qoplangan."*

---

## Ekspert Savollariga Qisqa Javoblar va Jonli O‘zgartirish Qo‘llanmasi

1. **Savol: Nima uchun hisob-kitobda oddiy kasr sonlar emas, `Math.trunc` ishlatilgan?**
   - **Javob:** JavaScript'da floating-point (`0.1 + 0.2`) xatoliklarining oldini olish va so‘mdagi narxlar hamda mahsulot miqdori faqat butun son bo‘lgani uchun barcha amallar sof butun sonlarda bajarilgan.
2. **Savol: Agar hakam "Mahsulot narxini, sarlavhani yoki rangni hozir o‘zgartirib ko‘rsat" desa qayerdan o‘zgartiriladi?**
   - **Mahsulot narxi yoki nomi:** `src/domain/products.ts` (16–48-qatorlar).
   - **Asosiy ranglar:** `tailwind.config.js` (`colors.paper`, `colors.ink`, `colors.lime`).
   - **Sarlavha matni:** `src/components/Hero.tsx` (`HERO_WORDS` massivi).
