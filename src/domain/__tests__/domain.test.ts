import { describe, expect, it } from 'vitest';
import { PRODUCTS, getProductById } from '../products';
import {
  calculateDiscountPercent,
  calculateOrderPricing,
  calculateSavings,
  calculateWholesaleTotal,
} from '../pricing';
import {
  validateCustomerName,
  validateOrderSubmission,
  validateProductForm,
  validateQuantityInput,
} from '../validation';
import { formatMoney, formatNumber } from '../../lib/formatMoney';

describe('Domain: Boshlang‘ich ma’lumotlar (PRODUCTS)', () => {
  it('katalogda M01–M04 va qo‘shimcha ulgurji mahsulotlar mavjud bo‘lishi kerak', () => {
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(8);

    expect(PRODUCTS[0]).toMatchObject({
      id: 'M01',
      name: "A4 qog'oz",
      unit: 'pachka',
      regularPrice: 50000,
      wholesalePrice: 40000,
    });

    expect(PRODUCTS[1]).toMatchObject({
      id: 'M02',
      name: 'Daftar',
      unit: 'dona',
      regularPrice: 8000,
      wholesalePrice: 6000,
    });

    expect(PRODUCTS[2]).toMatchObject({
      id: 'M03',
      name: 'Ruchka',
      unit: 'dona',
      regularPrice: 4000,
      wholesalePrice: 3000,
    });

    expect(PRODUCTS[3]).toMatchObject({
      id: 'M04',
      name: 'Fayl papkasi',
      unit: 'dona',
      regularPrice: 10000,
      wholesalePrice: 7000,
    });
  });
});

describe('Domain: formatMoney va formatNumber', () => {
  it('raqamlarni oddiy bo‘shliq bilan locale-mustaqil formatlaydi', () => {
    expect(formatNumber(120000)).toBe('120 000');
    expect(formatMoney(120000)).toBe("120 000 so'm");
    expect(formatMoney(30000)).toBe("30 000 so'm");
    expect(formatMoney(10000)).toBe("10 000 so'm");
  });
});

describe('Domain: Ulgurji hisob-kitob formulalari', () => {
  it('M01 × 3 -> ulgurji jami 120 000, tejam 30 000', () => {
    const m01 = getProductById('M01')!;
    const pricing = calculateOrderPricing(m01, 3);

    expect(pricing.wholesaleTotal).toBe(120000);
    expect(pricing.savings).toBe(30000);
    expect(pricing.wholesaleFormula).toBe("3 × 40 000 = 120 000 so'm");
    expect(pricing.savingsFormula).toBe("3 × (50 000 − 40 000) = 30 000 so'm");
  });

  it('M02 × 5 -> ulgurji jami 30 000, tejam 10 000', () => {
    const m02 = getProductById('M02')!;
    const pricing = calculateOrderPricing(m02, 5);

    expect(pricing.wholesaleTotal).toBe(30000);
    expect(pricing.savings).toBe(10000);
    expect(pricing.wholesaleFormula).toBe("5 × 6 000 = 30 000 so'm");
    expect(pricing.savingsFormula).toBe("5 × (8 000 − 6 000) = 10 000 so'm");
  });

  it('chegirma foizlari va narxlar to‘g‘ri hisoblanadi', () => {
    expect(calculateDiscountPercent(50000, 40000)).toBe(20);
    expect(calculateDiscountPercent(8000, 6000)).toBe(25);
    expect(calculateDiscountPercent(4000, 3000)).toBe(25);
    expect(calculateDiscountPercent(10000, 7000)).toBe(30);

    expect(calculateWholesaleTotal(4, 3000)).toBe(12000);
    expect(calculateSavings(4, 4000, 3000)).toBe(4000);
  });
});

describe('Domain: Qat’iy validatsiya (miqdor, ism, yangi mahsulot)', () => {
  it('to‘g‘ri musbat butun sonlarni qabul qiladi', () => {
    expect(validateQuantityInput('1')).toEqual({ valid: true, value: 1 });
    expect(validateQuantityInput('3')).toEqual({ valid: true, value: 3 });
    expect(validateQuantityInput('1000000')).toEqual({
      valid: true,
      value: 1000000,
    });
  });

  it('0, manfiy, kasr, bo‘sh va noto‘g‘ri formatlarni rad etadi', () => {
    const invalidInputs = [
      '',
      '   ',
      '0',
      '-2',
      '-1',
      '2.5',
      '1.5',
      '1,5',
      'abc',
      '1e2',
      '+3',
      '03',
      '1000001',
    ];

    for (const val of invalidInputs) {
      const res = validateQuantityInput(val);
      expect(res.valid, `"${val}" rad etilishi kerak edi`).toBe(false);
      expect(res.error).toBeTruthy();
    }
  });

  it('bo‘sh yoki faqat bo‘shliqdan iborat ismni rad etadi', () => {
    expect(validateCustomerName('').valid).toBe(false);
    expect(validateCustomerName('    ').valid).toBe(false);
    expect(validateCustomerName('  Sardor Aliyev  ')).toEqual({
      valid: true,
      value: 'Sardor Aliyev',
    });
  });

  it('Admin/Sotuvchi yangi mahsulot qo‘shish formasini tekshiradi', () => {
    const invalidProd = validateProductForm({
      name: 'Stepler',
      unit: 'dona',
      category: 'Kantselyariya',
      regularPrice: '10000',
      wholesalePrice: '12000',
      shortSpec: 'Test',
      stock: '100',
      poolTarget: '50',
      iconType: 'box',
      sellerName: 'Admin',
    });
    expect(invalidProd.valid).toBe(false);

    const validProd = validateProductForm({
      name: 'Stepler №10',
      unit: 'dona',
      category: 'Kantselyariya',
      regularPrice: '15000',
      wholesalePrice: '11000',
      shortSpec: 'Metall korpusli stepler',
      stock: '200',
      poolTarget: '50',
      iconType: 'box',
      sellerName: 'Admin',
    });
    expect(validProd.valid).toBe(true);
    expect(validProd.value?.wholesalePrice).toBe(11000);
  });

  it('to‘liq buyurtma validatsiyasida tanlanmagan mahsulot yoki xato maydonlarni ushlaydi', () => {
    const failRes = validateOrderSubmission({
      productId: '',
      quantity: '0',
      customerName: '   ',
    });
    expect(failRes.valid).toBe(false);

    const okRes = validateOrderSubmission({
      productId: 'M01',
      quantity: '3',
      customerName: 'Azizbek',
    });
    expect(okRes.valid).toBe(true);
  });
});
