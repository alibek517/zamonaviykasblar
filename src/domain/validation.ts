import { z } from 'zod';
import {
  PRODUCTS,
  getProductById,
  type Product,
  type ProductCategory,
  type ProductIconType,
  type ProductUnit,
} from './products';

export const MAX_QUANTITY = 1_000_000;
export const STRICT_POSITIVE_INT_REGEX = /^[1-9]\d*$/;

export interface FieldValidationResult<T> {
  readonly valid: boolean;
  readonly value?: T;
  readonly error?: string;
}

export interface OrderValidationSuccess {
  readonly valid: true;
  readonly customerName: string;
  readonly quantity: number;
  readonly product: Product;
}

export interface OrderValidationFailure {
  readonly valid: false;
  readonly errors: {
    readonly customerName?: string;
    readonly quantity?: string;
    readonly productId?: string;
  };
}

export type OrderValidationResult =
  | OrderValidationSuccess
  | OrderValidationFailure;

/**
 * Miqdor validatsiyasi (qat'iy ^[1-9]\d*$ va <= 1 000 000)
 */
export function validateQuantityInput(
  rawInput: string
): FieldValidationResult<number> {
  const raw = String(rawInput ?? '');
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Miqdorni kiriting (kamida 1 bo‘lgan butun son).',
    };
  }

  if (trimmed === '0') {
    return {
      valid: false,
      error: 'Miqdor 0 bo‘lishi mumkin emas. Kamida 1 kiriting.',
    };
  }

  if (trimmed.startsWith('-')) {
    return {
      valid: false,
      error: 'Miqdor manfiy son bo‘lishi mumkin emas. Musbat butun son kiriting.',
    };
  }

  if (trimmed.includes('.') || trimmed.includes(',')) {
    return {
      valid: false,
      error: 'Miqdor kasr son bo‘lishi mumkin emas. Faqat butun son kiriting.',
    };
  }

  if (trimmed.startsWith('0') && trimmed.length > 1) {
    return {
      valid: false,
      error: 'Miqdor 0 raqami bilan boshlanmasligi kerak (masalan: 3).',
    };
  }

  if (!STRICT_POSITIVE_INT_REGEX.test(trimmed)) {
    return {
      valid: false,
      error:
        'Miqdor formati noto‘g‘ri. Faqat 1 va undan katta butun raqam kiriting.',
    };
  }

  const parsed = Number(trimmed);

  if (!Number.isSafeInteger(parsed) || parsed > MAX_QUANTITY) {
    return {
      valid: false,
      error: 'Miqdor maksimal chegaradan (1 000 000) oshmasligi kerak.',
    };
  }

  return {
    valid: true,
    value: parsed,
  };
}

/**
 * Ism validatsiyasi (trim qilingandan so'ng bo'sh bo'lmasligi shart)
 */
export function validateCustomerName(
  rawName: string
): FieldValidationResult<string> {
  const trimmed = String(rawName ?? '').trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Ismingizni kiriting (maydon bo‘sh bo‘lishi mumkin emas).',
    };
  }

  if (trimmed.length > 80) {
    return {
      valid: false,
      error: 'Ism 80 ta belgidan oshmasligi kerak.',
    };
  }

  return {
    valid: true,
    value: trimmed,
  };
}

/**
 * Mahsulot tanlanganligini tekshirish
 */
export function validateProductId(
  rawProductId: string,
  catalog: readonly Product[] = PRODUCTS
): FieldValidationResult<Product> {
  const product = getProductById(String(rawProductId ?? '').trim(), catalog);
  if (!product) {
    return {
      valid: false,
      error: 'Ro‘yxatdan mahsulotni tanlang.',
    };
  }
  return {
    valid: true,
    value: product,
  };
}

/**
 * Zod sxemasi
 */
export const OrderFormSchema = z.object({
  productId: z
    .string()
    .refine((val) => validateProductId(val).valid, {
      message: 'Ro‘yxatdan mahsulotni tanlang.',
    }),
  quantity: z.string().superRefine((val, ctx) => {
    const res = validateQuantityInput(val);
    if (!res.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: res.error ?? 'Miqdor noto‘g‘ri.',
      });
    }
  }),
  customerName: z.string().superRefine((val, ctx) => {
    const res = validateCustomerName(val);
    if (!res.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: res.error ?? 'Ism kiritilmagan.',
      });
    }
  }),
});

/**
 * To'liq buyurtma so'rovini tekshirish funksiyasi
 */
export function validateOrderSubmission(
  input: {
    readonly productId: string;
    readonly quantity: string;
    readonly customerName: string;
  },
  catalog: readonly Product[] = PRODUCTS
): OrderValidationResult {
  const productCheck = validateProductId(input.productId, catalog);
  const qtyCheck = validateQuantityInput(input.quantity);
  const nameCheck = validateCustomerName(input.customerName);

  if (
    !productCheck.valid ||
    !qtyCheck.valid ||
    !nameCheck.valid ||
    !productCheck.value ||
    qtyCheck.value === undefined ||
    !nameCheck.value
  ) {
    return {
      valid: false,
      errors: {
        productId: productCheck.error,
        quantity: qtyCheck.error,
        customerName: nameCheck.error,
      },
    };
  }

  return {
    valid: true,
    product: productCheck.value,
    quantity: qtyCheck.value,
    customerName: nameCheck.value,
  };
}

/**
 * Admin / Sotuvchi tomonidan yangi mahsulot qo'shish formasi validatsiyasi
 */
export function validateProductForm(input: {
  readonly id?: string;
  readonly name: string;
  readonly unit: ProductUnit;
  readonly category: ProductCategory;
  readonly regularPrice: string;
  readonly wholesalePrice: string;
  readonly shortSpec: string;
  readonly stock: string;
  readonly poolTarget: string;
  readonly iconType: ProductIconType;
  readonly sellerName: string;
}): FieldValidationResult<Omit<Product, 'id'>> {
  const name = input.name.trim();
  if (name.length < 2) {
    return {
      valid: false,
      error: 'Mahsulot nomini kiriting (kamida 2 ta belgi).',
    };
  }

  const regCheck = validateQuantityInput(input.regularPrice);
  if (!regCheck.valid || !regCheck.value) {
    return {
      valid: false,
      error: 'Oddiy narxni to‘g‘ri butun sonda kiriting.',
    };
  }

  const wholeCheck = validateQuantityInput(input.wholesalePrice);
  if (!wholeCheck.valid || !wholeCheck.value) {
    return {
      valid: false,
      error: 'Ulgurji narxni to‘g‘ri butun sonda kiriting.',
    };
  }

  if (wholeCheck.value >= regCheck.value) {
    return {
      valid: false,
      error: 'Ulgurji narx oddiy narxdan kichik bo‘lishi kerak.',
    };
  }

  const stockCheck = validateQuantityInput(input.stock || '100');
  const targetCheck = validateQuantityInput(input.poolTarget || '50');

  return {
    valid: true,
    value: {
      name,
      unit: input.unit,
      category: input.category,
      regularPrice: regCheck.value,
      wholesalePrice: wholeCheck.value,
      shortSpec:
        input.shortSpec.trim() || `${input.category} ulgurji mahsuloti`,
      stock: stockCheck.valid && stockCheck.value ? stockCheck.value : 100,
      poolCurrent: 1,
      poolTarget:
        targetCheck.valid && targetCheck.value ? targetCheck.value : 50,
      iconType: input.iconType,
      sellerName: input.sellerName.trim() || 'Birga Ulgurji Hamkor',
    },
  };
}
