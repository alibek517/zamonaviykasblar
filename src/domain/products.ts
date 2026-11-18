export type ProductId = string;
export type ProductUnit =
  | 'pachka'
  | 'dona'
  | 'quti'
  | "to'plam"
  | 'rulon'
  | 'kg';

export type ProductCategory =
  | 'Kantselyariya'
  | 'Ofis texnikasi'
  | 'Qadoqlash va xo‘jalik'
  | 'Mebel va jihoz';

export type ProductIconType =
  | 'paper'
  | 'notebook'
  | 'pen'
  | 'folder'
  | 'printer'
  | 'box'
  | 'organizer'
  | 'lamp';

export interface Product {
  readonly id: ProductId;
  readonly name: string;
  readonly unit: ProductUnit;
  readonly regularPrice: number;
  readonly wholesalePrice: number;
  readonly shortSpec: string;
  readonly category?: ProductCategory;
  readonly iconType?: ProductIconType;
  readonly stock?: number;
  readonly poolCurrent?: number;
  readonly poolTarget?: number;
  readonly sellerName?: string;
}

export type UserRole = 'mijoz' | 'sotuvchi' | 'admin';

export interface UserAccount {
  readonly id: string;
  readonly username: string;
  readonly password: string;
  readonly fullName: string;
  readonly role: UserRole;
  readonly company?: string;
  readonly phone?: string;
}

export type OrderStatus =
  | 'Kutilmoqda'
  | 'Tasdiqlandi'
  | 'Yetkazilmoqda'
  | 'Yakunlandi'
  | 'Bekor qilindi';

export interface WholesaleOrder {
  readonly id: string;
  readonly customerName: string;
  readonly customerUsername?: string;
  readonly customerPhone?: string;
  readonly address?: string;
  readonly productId: string;
  readonly productName: string;
  readonly unit: string;
  readonly quantity: number;
  readonly regularPrice: number;
  readonly wholesalePrice: number;
  readonly wholesaleTotal: number;
  readonly savings: number;
  readonly status: OrderStatus;
  readonly createdAt: string;
  readonly sellerName: string;
}

/**
 * Standart boshlang'ich mahsulotlar katalogi (Admin va Sotuvchi yangi mahsulot qo'shishi,
 * tahrirlashi va o'chirishi mumkin).
 */
export const PRODUCTS: readonly Product[] = [
  {
    id: 'M01',
    name: "A4 qog'oz",
    unit: 'pachka',
    regularPrice: 50000,
    wholesalePrice: 40000,
    shortSpec: '500 varaq, 80 g/m², ofis standarti',
    category: 'Kantselyariya',
    iconType: 'paper',
    stock: 450,
    poolCurrent: 38,
    poolTarget: 50,
    sellerName: 'Toshkent Qog‘oz Savdo',
  },
  {
    id: 'M02',
    name: 'Daftar',
    unit: 'dona',
    regularPrice: 8000,
    wholesalePrice: 6000,
    shortSpec: '48 varaq, katak chiziqli, qattiq muqova',
    category: 'Kantselyariya',
    iconType: 'notebook',
    stock: 1200,
    poolCurrent: 85,
    poolTarget: 100,
    sellerName: 'O‘quvchi Print MChJ',
  },
  {
    id: 'M03',
    name: 'Ruchka',
    unit: 'dona',
    regularPrice: 4000,
    wholesalePrice: 3000,
    shortSpec: '0.7 mm, ko‘k siyoh, silliq yozuv',
    category: 'Kantselyariya',
    iconType: 'pen',
    stock: 3000,
    poolCurrent: 160,
    poolTarget: 200,
    sellerName: 'Kantselyariya Optom',
  },
  {
    id: 'M04',
    name: 'Fayl papkasi',
    unit: 'dona',
    regularPrice: 10000,
    wholesalePrice: 7000,
    shortSpec: 'A4 format, mustahkam polipropilen',
    category: 'Kantselyariya',
    iconType: 'folder',
    stock: 800,
    poolCurrent: 42,
    poolTarget: 60,
    sellerName: 'Ofis Market Toshkent',
  },
  {
    id: 'M05',
    name: 'Termo etiketka (58×40)',
    unit: 'rulon',
    regularPrice: 25000,
    wholesalePrice: 18000,
    shortSpec: '700 shtrix-kod yorlig‘i, ombor va marketlar uchun',
    category: 'Qadoqlash va xo‘jalik',
    iconType: 'box',
    stock: 600,
    poolCurrent: 45,
    poolTarget: 50,
    sellerName: 'PackPro Uzbekistan',
  },
  {
    id: 'M06',
    name: 'Lazer printer kartridji 85A',
    unit: 'dona',
    regularPrice: 160000,
    wholesalePrice: 120000,
    shortSpec: '1 600 bet resurs, to‘liq yangi baraban bilan',
    category: 'Ofis texnikasi',
    iconType: 'printer',
    stock: 140,
    poolCurrent: 14,
    poolTarget: 20,
    sellerName: 'TechOffice Ta’minot',
  },
  {
    id: 'M07',
    name: 'Stol usti organayzer to‘plami',
    unit: "to'plam",
    regularPrice: 75000,
    wholesalePrice: 55000,
    shortSpec: 'Metall to‘rli 6 bo‘lmali ofis jamlanmasi',
    category: 'Mebel va jihoz',
    iconType: 'organizer',
    stock: 210,
    poolCurrent: 19,
    poolTarget: 25,
    sellerName: 'Ofis Market Toshkent',
  },
  {
    id: 'M08',
    name: 'Arxiv qutisi (Gofrokarton)',
    unit: 'quti',
    regularPrice: 18000,
    wholesalePrice: 13000,
    shortSpec: 'A4 papkalar uchun qopqoqli mustahkam quti',
    category: 'Qadoqlash va xo‘jalik',
    iconType: 'box',
    stock: 520,
    poolCurrent: 64,
    poolTarget: 80,
    sellerName: 'PackPro Uzbekistan',
  },
] as const;

export const DEFAULT_USERS: readonly UserAccount[] = [
  {
    id: 'u-admin',
    username: 'admin',
    password: '123',
    fullName: 'Kamoliddin Rahimov (Bosh Admin)',
    role: 'admin',
    company: 'Birga Ulgurji Boshqaruvi',
    phone: '+998 90 100 00 01',
  },
  {
    id: 'u-seller',
    username: 'sotuvchi',
    password: '123',
    fullName: 'Javohir Usmonov (Ta’minotchi)',
    role: 'sotuvchi',
    company: 'Toshkent Qog‘oz Savdo MChJ',
    phone: '+998 90 200 00 02',
  },
  {
    id: 'u-customer',
    username: 'mijoz',
    password: '123',
    fullName: 'Sardor Aliyev (Ulgurji Xaridor)',
    role: 'mijoz',
    company: 'Ziyo Ta’lim Markazi',
    phone: '+998 90 300 00 03',
  },
];

export const INITIAL_ORDERS: readonly WholesaleOrder[] = [
  {
    id: 'ORD-1001',
    customerName: 'Sardor Aliyev (Ulgurji Xaridor)',
    customerUsername: 'mijoz',
    customerPhone: '+998 90 300 00 03',
    address: 'Toshkent sh., Chilonzor tumani, 9-kvartal',
    productId: 'M01',
    productName: "A4 qog'oz",
    unit: 'pachka',
    quantity: 10,
    regularPrice: 50000,
    wholesalePrice: 40000,
    wholesaleTotal: 400000,
    savings: 100000,
    status: 'Tasdiqlandi',
    createdAt: 'Bugun, 10:15',
    sellerName: 'Toshkent Qog‘oz Savdo',
  },
  {
    id: 'ORD-1002',
    customerName: 'Dilnoza Karimova',
    customerUsername: 'dilnoza',
    customerPhone: '+998 93 555 12 34',
    address: 'Toshkent sh., Yunusobod tumani, Amir Temur ko‘chasi',
    productId: 'M02',
    productName: 'Daftar',
    unit: 'dona',
    quantity: 50,
    regularPrice: 8000,
    wholesalePrice: 6000,
    wholesaleTotal: 300000,
    savings: 100000,
    status: 'Yetkazilmoqda',
    createdAt: 'Bugun, 11:05',
    sellerName: 'O‘quvchi Print MChJ',
  },
];

export function getProductById(
  id: string,
  catalog: readonly Product[] = PRODUCTS
): Product | undefined {
  return catalog.find((product) => product.id === id);
}
