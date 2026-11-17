import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoanForm } from './LoanForm';
import type { Book } from '@/types';
import type { LoanFormState } from '@/lib/loan-validate';

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Lập trình C căn bản',
    author: 'Nguyễn Văn Hùng',
    category: 'Lập trình',
    copies: 1,
  },
  {
    id: 2,
    title: 'An toàn mạng',
    author: 'Bùi Ngọc Anh',
    category: 'Mạng máy tính',
    copies: 2,
  },
];

describe('Kiểm thử component LoanForm theo hành vi người dùng', () => {
  it('action trả errors thì lỗi hiện ra dưới đúng ô với role alert', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn().mockResolvedValue({
      errors: {
        bookId: 'Hãy chọn sách',
        pickupDate: 'Hãy chọn ngày',
        term: 'Hãy chọn thời hạn',
        quantity: 'Số quyển phải từ 1 trở lên',
        reason: 'Lý do tối thiểu 10 ký tự',
      },
      values: {},
    } as LoanFormState);

    render(<LoanForm books={mockBooks} action={mockAction} />);

    const submitBtn = screen.getByRole('button', { name: 'Gửi yêu cầu' });
    await user.click(submitBtn);

    expect(await screen.findByText('Hãy chọn sách')).toBeInTheDocument();
    expect(screen.getByText('Hãy chọn ngày')).toBeInTheDocument();
    expect(screen.getByText('Hãy chọn thời hạn')).toBeInTheDocument();
    expect(screen.getByText('Số quyển phải từ 1 trở lên')).toBeInTheDocument();
    expect(screen.getByText('Lý do tối thiểu 10 ký tự')).toBeInTheDocument();
  });

  it('điền hợp lệ bằng userEvent thì action được gọi 1 lần và FormData có đúng bookId, term, quantity', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn().mockResolvedValue({
      errors: {},
      values: {},
      message: 'Đã gửi yêu cầu, chờ duyệt',
      ok: true,
    } as LoanFormState);

    render(<LoanForm books={mockBooks} action={mockAction} />);

    await user.selectOptions(screen.getByLabelText('Sách'), '1');
    await user.type(screen.getByLabelText('Ngày lấy sách'), '2026-12-05');
    await user.selectOptions(screen.getByLabelText('Thời hạn mượn'), '14');

    const qtyInput = screen.getByLabelText('Số quyển');
    await user.clear(qtyInput);
    await user.type(qtyInput, '2');

    await user.type(screen.getByLabelText('Lý do mượn'), 'Mượn sách phục vụ nghiên cứu');

    await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));

    expect(mockAction).toHaveBeenCalledTimes(1);
    const formData = mockAction.mock.calls[0][1] as FormData;
    expect(formData.get('bookId')).toBe('1');
    expect(formData.get('term')).toBe('14');
    expect(formData.get('quantity')).toBe('2');
  });

  it('action trả message Sách đã hết bản vào ngày này cùng values thì thông báo hiện ra và lý do đã nhập vẫn còn', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn().mockResolvedValue({
      errors: {},
      values: {
        bookId: '2',
        pickupDate: '2026-12-02',
        term: '14',
        quantity: '1',
        reason: 'Lý do mượn sách rất chi tiết và hợp lệ',
      },
      message: 'Sách đã hết bản vào ngày này',
      ok: false,
    } as LoanFormState);

    render(<LoanForm books={mockBooks} action={mockAction} />);

    await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));

    expect(await screen.findByText('Sách đã hết bản vào ngày này')).toBeInTheDocument();
    expect(screen.getByLabelText('Lý do mượn')).toHaveValue(
      'Lý do mượn sách rất chi tiết và hợp lệ'
    );
  });

  it('có defaultBookId thì ô Sách được chọn sẵn sách tương ứng', () => {
    const mockAction = vi.fn();
    render(<LoanForm books={mockBooks} defaultBookId={2} action={mockAction} />);

    const selectBook = screen.getByLabelText('Sách');
    expect(selectBook).toHaveValue('2');
  });
});

