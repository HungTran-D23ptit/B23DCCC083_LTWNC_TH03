import { describe, it, expect } from 'vitest';
import { formatDate, TERM_LABEL, STATUS_LABEL } from './format';

describe('Kiểm tra hàm định dạng dữ liệu', () => {
  it('formatDate chuyển đổi đúng định dạng YYYY-MM-DD sang DD/MM/YYYY', () => {
    expect(formatDate('2026-12-02')).toBe('02/12/2026');
    expect(formatDate('2025-01-15')).toBe('15/01/2025');
  });

  it('TERM_LABEL và STATUS_LABEL cung cấp đầy đủ nhãn tiếng Việt', () => {
    expect(TERM_LABEL[7]).toBe('7 ngày');
    expect(TERM_LABEL[14]).toBe('14 ngày');
    expect(TERM_LABEL[30]).toBe('30 ngày');

    expect(STATUS_LABEL.pending).toBe('Chờ duyệt');
    expect(STATUS_LABEL.approved).toBe('Đã duyệt');
    expect(STATUS_LABEL.rejected).toBe('Từ chối');
  });
});

