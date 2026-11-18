import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const { Client } = pg;

const PASSWORD = process.env.SUPABASE_DB_PASSWORD || '';
const PROJECT_REF = 'pfkvlmotomlcsjlyliyw';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
const SUPABASE_KEY = 'sb_publishable_Z0X23PsUHoeJtofXuMBQcg_XZJ9x-_p';

const CANDIDATE_URLS = [
  `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres`,
  `postgresql://postgres:${PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`,
];

async function connectToDb() {
  for (const connStr of CANDIDATE_URLS) {
    const client = new Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });
    try {
      await client.connect();
      const res = await client.query('SELECT current_database(), current_user');
      console.log(
        'Connected successfully via:',
        connStr.replace(PASSWORD, '***'),
        res.rows[0]
      );
      return client;
    } catch (err) {
      console.log(
        'Candidate skipped:',
        connStr.replace(PASSWORD, '***'),
        err.message
      );
    }
  }
  throw new Error('Could not connect to any candidate Postgres URL');
}

async function main() {
  const client = await connectToDb();

  const schemaSql = fs.readFileSync(
    path.resolve('supabase/schema.sql'),
    'utf8'
  );

  await client.query(schemaSql);
  console.log('Schema applied successfully.');

  const products = [
    [
      'M01',
      "A4 qog'oz",
      'pachka',
      50000,
      40000,
      '500 varaq, 80 g/m², ofis standarti',
      'Kantselyariya',
      'paper',
      450,
      38,
      50,
      'Toshkent Qog‘oz Savdo',
    ],
    [
      'M02',
      'Daftar',
      'dona',
      8000,
      6000,
      '48 varaq, katak chiziqli, qattiq muqova',
      'Kantselyariya',
      'notebook',
      1200,
      85,
      100,
      'O‘quvchi Print MChJ',
    ],
    [
      'M03',
      'Ruchka',
      'dona',
      4000,
      3000,
      '0.7 mm, ko‘k siyoh, silliq yozuv',
      'Kantselyariya',
      'pen',
      3000,
      160,
      200,
      'Kantselyariya Optom',
    ],
    [
      'M04',
      'Fayl papkasi',
      'dona',
      10000,
      7000,
      'A4 format, mustahkam polipropilen',
      'Kantselyariya',
      'folder',
      800,
      42,
      60,
      'Ofis Market Toshkent',
    ],
    [
      'M05',
      'Termo etiketka (58×40)',
      'rulon',
      25000,
      18000,
      '700 shtrix-kod yorlig‘i, ombor va marketlar uchun',
      'Qadoqlash va xo‘jalik',
      'box',
      600,
      45,
      50,
      'PackPro Uzbekistan',
    ],
    [
      'M06',
      'Lazer printer kartridji 85A',
      'dona',
      160000,
      120000,
      '1 600 bet resurs, to‘liq yangi baraban bilan',
      'Ofis texnikasi',
      'printer',
      140,
      14,
      20,
      'TechOffice Ta’minot',
    ],
    [
      'M07',
      'Stol usti organayzer to‘plami',
      "to'plam",
      75000,
      55000,
      'Metall to‘rli 6 bo‘lmali ofis jamlanmasi',
      'Mebel va jihoz',
      'organizer',
      210,
      19,
      25,
      'Ofis Market Toshkent',
    ],
    [
      'M08',
      'Arxiv qutisi (Gofrokarton)',
      'quti',
      18000,
      13000,
      'A4 papkalar uchun qopqoqli mustahkam quti',
      'Qadoqlash va xo‘jalik',
      'box',
      520,
      64,
      80,
      'PackPro Uzbekistan',
    ],
  ];

  for (const p of products) {
    await client.query(
      `INSERT INTO public.birga_products
        (id, name, unit, regular_price, wholesale_price, short_spec, category, icon_type, stock, pool_current, pool_target, seller_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        unit = EXCLUDED.unit,
        regular_price = EXCLUDED.regular_price,
        wholesale_price = EXCLUDED.wholesale_price,
        short_spec = EXCLUDED.short_spec,
        category = EXCLUDED.category,
        icon_type = EXCLUDED.icon_type,
        stock = EXCLUDED.stock,
        pool_current = EXCLUDED.pool_current,
        pool_target = EXCLUDED.pool_target,
        seller_name = EXCLUDED.seller_name`,
      p
    );
  }

  const users = [
    [
      'u-admin',
      'admin',
      '123',
      'Kamoliddin Rahimov (Bosh Admin)',
      'admin',
      'Birga Ulgurji Boshqaruvi',
      '+998 90 100 00 01',
    ],
    [
      'u-seller',
      'sotuvchi',
      '123',
      'Javohir Usmonov (Ta’minotchi)',
      'sotuvchi',
      'Toshkent Qog‘oz Savdo MChJ',
      '+998 90 200 00 02',
    ],
    [
      'u-customer',
      'mijoz',
      '123',
      'Sardor Aliyev (Ulgurji Xaridor)',
      'mijoz',
      'Ziyo Ta’lim Markazi',
      '+998 90 300 00 03',
    ],
  ];

  for (const u of users) {
    await client.query(
      `INSERT INTO public.birga_users (id, username, password, full_name, role, company, phone)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (username) DO UPDATE SET
        password = EXCLUDED.password,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        company = EXCLUDED.company,
        phone = EXCLUDED.phone`,
      u
    );
  }

  const orders = [
    [
      'ORD-1001',
      'Sardor Aliyev (Ulgurji Xaridor)',
      'mijoz',
      '+998 90 300 00 03',
      'Toshkent sh., Chilonzor tumani, 9-kvartal',
      'M01',
      "A4 qog'oz",
      'pachka',
      10,
      50000,
      40000,
      400000,
      100000,
      'Tasdiqlandi',
      'Bugun, 10:15',
      'Toshkent Qog‘oz Savdo',
    ],
    [
      'ORD-1002',
      'Dilnoza Karimova',
      'dilnoza',
      '+998 93 555 12 34',
      'Toshkent sh., Yunusobod tumani, Amir Temur ko‘chasi',
      'M02',
      'Daftar',
      'dona',
      50,
      8000,
      6000,
      300000,
      100000,
      'Yetkazilmoqda',
      'Bugun, 11:05',
      'O‘quvchi Print MChJ',
    ],
  ];

  for (const o of orders) {
    await client.query(
      `INSERT INTO public.birga_orders
        (id, customer_name, customer_username, customer_phone, address, product_id, product_name, unit, quantity, regular_price, wholesale_price, wholesale_total, savings, status, created_at_label, seller_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       ON CONFLICT (id) DO NOTHING`,
      o
    );
  }

  await client.query(`NOTIFY pgrst, 'reload schema'`);
  await client.end();

  // Wait 2s for PostgREST schema reload
  await new Promise((r) => setTimeout(r, 2000));

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: prodData, error: prodErr } = await supabase
    .from('birga_products')
    .select('*')
    .order('id', { ascending: true });

  if (prodErr) {
    throw new Error(`Supabase REST check failed: ${prodErr.message}`);
  }
  console.log(
    `Supabase REST verified: ${prodData.length} products in birga_products!`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
