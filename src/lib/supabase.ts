import { createClient } from '@supabase/supabase-js';
import type { Product, UserAccount, WholesaleOrder } from '../domain/products';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://pfkvlmotomlcsjlyliyw.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_Z0X23PsUHoeJtofXuMBQcg_XZJ9x-_p';

export const isTestMode = import.meta.env.MODE === 'test';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});

export interface DbProductRow {
  id: string;
  name: string;
  unit: string;
  regular_price: number;
  wholesale_price: number;
  short_spec: string;
  category: string | null;
  icon_type: string | null;
  stock: number | null;
  pool_current: number | null;
  pool_target: number | null;
  seller_name: string | null;
  created_at?: string;
}

export interface DbOrderRow {
  id: string;
  customer_name: string;
  customer_username: string | null;
  customer_phone: string | null;
  address: string | null;
  product_id: string;
  product_name: string;
  unit: string;
  quantity: number;
  regular_price: number;
  wholesale_price: number;
  wholesale_total: number;
  savings: number;
  status: string;
  created_at_label: string;
  seller_name: string;
  created_at?: string;
}

export interface DbUserRow {
  id: string;
  username: string;
  password: string;
  full_name: string;
  role: string;
  company: string | null;
  phone: string | null;
}

export function mapRowToProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    unit: (row.unit as Product['unit']) || 'dona',
    regularPrice: Number(row.regular_price),
    wholesalePrice: Number(row.wholesale_price),
    shortSpec: row.short_spec,
    category: (row.category as Product['category']) ?? 'Kantselyariya',
    iconType: (row.icon_type as Product['iconType']) ?? 'box',
    stock: row.stock ?? 200,
    poolCurrent: row.pool_current ?? 20,
    poolTarget: row.pool_target ?? 50,
    sellerName: row.seller_name ?? 'Birga Ulgurji Ta’minot',
  };
}

export function mapProductToRow(product: Product): DbProductRow {
  return {
    id: product.id,
    name: product.name,
    unit: product.unit,
    regular_price: product.regularPrice,
    wholesale_price: product.wholesalePrice,
    short_spec: product.shortSpec,
    category: product.category ?? 'Kantselyariya',
    icon_type: product.iconType ?? 'box',
    stock: product.stock ?? 200,
    pool_current: product.poolCurrent ?? 20,
    pool_target: product.poolTarget ?? 50,
    seller_name: product.sellerName ?? 'Birga Ulgurji Ta’minot',
  };
}

export function mapRowToOrder(row: DbOrderRow): WholesaleOrder {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerUsername: row.customer_username ?? undefined,
    customerPhone: row.customer_phone ?? undefined,
    address: row.address ?? undefined,
    productId: row.product_id,
    productName: row.product_name,
    unit: row.unit,
    quantity: Number(row.quantity),
    regularPrice: Number(row.regular_price),
    wholesalePrice: Number(row.wholesale_price),
    wholesaleTotal: Number(row.wholesale_total),
    savings: Number(row.savings),
    status: (row.status as WholesaleOrder['status']) || 'Tasdiqlandi',
    createdAt: row.created_at_label,
    sellerName: row.seller_name,
  };
}

export function mapOrderToRow(order: WholesaleOrder): DbOrderRow {
  return {
    id: order.id,
    customer_name: order.customerName,
    customer_username: order.customerUsername ?? null,
    customer_phone: order.customerPhone ?? null,
    address: order.address ?? null,
    product_id: order.productId,
    product_name: order.productName,
    unit: order.unit,
    quantity: order.quantity,
    regular_price: order.regularPrice,
    wholesale_price: order.wholesalePrice,
    wholesale_total: order.wholesaleTotal,
    savings: order.savings,
    status: order.status,
    created_at_label: order.createdAt,
    seller_name: order.sellerName,
  };
}

export function mapRowToUser(row: DbUserRow): UserAccount {
  return {
    id: row.id,
    username: row.username,
    password: row.password,
    fullName: row.full_name,
    role: (row.role as UserAccount['role']) || 'mijoz',
    company: row.company ?? undefined,
    phone: row.phone ?? undefined,
  };
}

export function mapUserToRow(user: UserAccount): DbUserRow {
  return {
    id: user.id,
    username: user.username,
    password: user.password,
    full_name: user.fullName,
    role: user.role,
    company: user.company ?? null,
    phone: user.phone ?? null,
  };
}
