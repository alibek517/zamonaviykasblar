import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';

describe('App UI, 3 Rol (Mijoz, Sotuvchi, Admin) va Ulgurji Savdo', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('mahsulotlarni ikkala narx va o‘lchov birligi bilan ko‘rsatadi', () => {
    render(<App />);

    expect(screen.getByTestId('product-card-M01')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-M02')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-M03')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-M04')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-M05')).toBeInTheDocument();

    expect(screen.getByTestId('regular-price-M01')).toHaveTextContent(
      "50 000 so'm"
    );
    expect(screen.getByTestId('wholesale-price-M01')).toHaveTextContent(
      "40 000 so'm"
    );
  });

  it('M01 × 3 -> ulgurji jami 120 000, tejam 30 000', () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('preset-m01-3'));

    expect(screen.getByTestId('wholesale-total')).toHaveTextContent(
      "120 000 so'm"
    );
    expect(screen.getByTestId('savings-total')).toHaveTextContent(
      "30 000 so'm"
    );
    expect(screen.getByTestId('wholesale-formula')).toHaveTextContent(
      "3 × 40 000 = 120 000 so'm"
    );
  });

  it('M02 × 5 -> ulgurji jami 30 000, tejam 10 000', () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('preset-m02-5'));

    expect(screen.getByTestId('wholesale-total')).toHaveTextContent(
      "30 000 so'm"
    );
    expect(screen.getByTestId('savings-total')).toHaveTextContent(
      "10 000 so'm"
    );
    expect(screen.getByTestId('wholesale-formula')).toHaveTextContent(
      "5 × 6 000 = 30 000 so'm"
    );
  });

  it('miqdor 0, -2, 2.5, bo‘sh yoki ism bo‘sh bo‘lsa rad etiladi', () => {
    render(<App />);

    const qtyInput = screen.getByLabelText(/^Miqdor \(/i);
    const nameInput = screen.getByLabelText(/^Ism/i);
    const submitBtn = screen.getByTestId('submit-button');

    fireEvent.change(qtyInput, { target: { value: '0' } });
    fireEvent.change(nameInput, { target: { value: '   ' } });
    fireEvent.click(submitBtn);

    expect(screen.getByTestId('quantity-error')).toBeInTheDocument();
    expect(screen.getByTestId('name-error')).toBeInTheDocument();
    expect(qtyInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();

    fireEvent.change(qtyInput, { target: { value: '-2' } });
    expect(screen.getByTestId('quantity-error')).toHaveTextContent(/manfiy/i);

    fireEvent.change(qtyInput, { target: { value: '2.5' } });
    expect(screen.getByTestId('quantity-error')).toHaveTextContent(/kasr/i);
  });

  it('buyurtma rasmiylashtirilganda modalda ism, mahsulot, miqdor va ulgurji jami chiqadi', () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('preset-m01-3'));
    const nameInput = screen.getByLabelText(/^Ism/i);
    fireEvent.change(nameInput, { target: { value: 'Sardor Aliyev' } });

    fireEvent.click(screen.getByTestId('submit-button'));

    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-customer-name')).toHaveTextContent(
      'Sardor Aliyev'
    );
    expect(screen.getByTestId('modal-product')).toHaveTextContent(
      "M01 — A4 qog'oz (pachka)"
    );
    expect(screen.getByTestId('modal-quantity')).toHaveTextContent('3 pachka');
    expect(screen.getByTestId('modal-wholesale-total')).toHaveTextContent(
      "120 000 so'm"
    );
  });

  it('Admin roliga o‘tilganda Admin Panel ochiladi va yangi mahsulot (M09) qo‘shish ishlaydi', () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('role-switch-admin'));
    expect(screen.getByTestId('admin-seller-dashboard')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('admin-product-name'), {
      target: { value: 'Stepler №10' },
    });
    fireEvent.change(screen.getByTestId('admin-regular-price'), {
      target: { value: '15000' },
    });
    fireEvent.change(screen.getByTestId('admin-wholesale-price'), {
      target: { value: '11000' },
    });

    fireEvent.click(screen.getByTestId('admin-save-product-btn'));

    expect(screen.getByTestId('product-card-M09')).toBeInTheDocument();
    expect(screen.getByTestId('wholesale-price-M09')).toHaveTextContent(
      "11 000 so'm"
    );
  });
});
