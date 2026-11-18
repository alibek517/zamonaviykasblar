-- Birga Ulgurji — Supabase PostgreSQL Schema

CREATE TABLE IF NOT EXISTS public.birga_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  regular_price BIGINT NOT NULL,
  wholesale_price BIGINT NOT NULL,
  short_spec TEXT NOT NULL,
  category TEXT DEFAULT 'Kantselyariya',
  icon_type TEXT DEFAULT 'box',
  stock INTEGER DEFAULT 200,
  pool_current INTEGER DEFAULT 20,
  pool_target INTEGER DEFAULT 50,
  seller_name TEXT DEFAULT 'Birga Ulgurji Ta’minot',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.birga_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('mijoz', 'sotuvchi', 'admin')),
  company TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.birga_orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_username TEXT,
  customer_phone TEXT,
  address TEXT,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  unit TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  regular_price BIGINT NOT NULL,
  wholesale_price BIGINT NOT NULL,
  wholesale_total BIGINT NOT NULL,
  savings BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Tasdiqlandi',
  created_at_label TEXT NOT NULL DEFAULT 'Hozirgina',
  seller_name TEXT NOT NULL DEFAULT 'Birga Ulgurji Ta’minot',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and allow public access for the publishable client key
ALTER TABLE public.birga_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birga_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birga_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public full access birga_products" ON public.birga_products;
CREATE POLICY "Public full access birga_products"
  ON public.birga_products FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access birga_users" ON public.birga_users;
CREATE POLICY "Public full access birga_users"
  ON public.birga_users FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access birga_orders" ON public.birga_orders;
CREATE POLICY "Public full access birga_orders"
  ON public.birga_orders FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.birga_products TO anon, authenticated, service_role;
GRANT ALL ON public.birga_users TO anon, authenticated, service_role;
GRANT ALL ON public.birga_orders TO anon, authenticated, service_role;
