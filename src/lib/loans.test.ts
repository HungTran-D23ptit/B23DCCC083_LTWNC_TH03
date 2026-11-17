import { describe, it, expect } from 'vitest';
import { listLoans, submitLoan, cancelLoan, parseStatus } from './loans';

describe('Kiểm tra nghiệp vụ mượn sách', () => {
  it('listLoans: sv01 có 27 yêu cầu chia làm 3 trang với số lượng 10/10/7', () => {
    const page1 = listLoans({ email: 'sv01@ptit.edu.vn', role: 'student' }, undefined, 1);
    expect(page1.total).toBe(27);
    expect(page1.totalPages).toBe(3);
    expect(page1.items.length).toBe(10);
    expect(page1.items[0].bookTitle).toBeTruthy();

    const page2 = listLoans({ email: 'sv01@ptit.edu.vn', role: 'student' }, undefined, 2);
    expect(page2.items.length).toBe(10);

    const page3 = listLoans({ email: 'sv01@ptit.edu.vn', role: 'student' }, undefined, 3);
    expect(page3.items.length).toBe(7);
  });

  it('listLoans: admin thấy toàn bộ 37 yêu cầu mượn sách', () => {
    const result = listLoans({ email: 'admin@ptit.edu.vn', role: 'admin' }, undefined, 1);
    expect(result.total).toBe(37);
    expect(result.totalPages).toBe(4);
  });

  it('listLoans: trang vượt giới hạn được tự động kẹp lại', () => {
    const pageUnder = listLoans({ email: 'sv01@ptit.edu.vn', role: 'student' }, undefined, -5);
    expect(pageUnder.page).toBe(1);

    const pageOver = listLoans({ email: 'sv01@ptit.edu.vn', role: 'student' }, undefined, 999);
    expect(pageOver.page).toBe(3);
  });

  it('submitLoan: báo sách đã hết bản vào ngày này với sách id 6 ngày 2026-12-02', () => {
    const result = submitLoan('sv01@ptit.edu.vn', {
      bookId: 6,
      pickupDate: '2026-12-02',
      term: 14,
      quantity: 1,
      reason: 'Mượn sách học an toàn mạng máy tính',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe('Sách đã hết bản vào ngày này');
    }
  });

  it('tạo yêu cầu mượn thành công và cancelLoan trả về đúng 3 mã: forbidden, ok, not-found', () => {
    const created = submitLoan('sv01@ptit.edu.vn', {
      bookId: 11,
      pickupDate: '2026-12-03',
      term: 14,
      quantity: 1,
      reason: 'Mượn sách thiết kế cơ sở dữ liệu',
    });

    expect(created.ok).toBe(true);
    if (created.ok) {
      const loanId = created.loan.id;

      const forbiddenResult = cancelLoan('sv02@ptit.edu.vn', loanId);
      expect(forbiddenResult).toBe('forbidden');

      const okResult = cancelLoan('sv01@ptit.edu.vn', loanId);
      expect(okResult).toBe('ok');

      const notFoundResult = cancelLoan('sv01@ptit.edu.vn', loanId);
      expect(notFoundResult).toBe('not-found');
    }
  });

  it('parseStatus lọc đúng trạng thái hợp lệ và trả undefined khi không khớp', () => {
    expect(parseStatus('pending')).toBe('pending');
    expect(parseStatus('approved')).toBe('approved');
    expect(parseStatus('rejected')).toBe('rejected');
    expect(parseStatus('all')).toBeUndefined();
    expect(parseStatus('')).toBeUndefined();
  });
});

