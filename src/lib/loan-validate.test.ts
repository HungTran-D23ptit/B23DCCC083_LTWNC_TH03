import { describe, it, expect } from 'vitest';
import {
  validateLoan,
  toLoanData,
  toLoanInput,
  today,
  type LoanInput,
} from './loan-validate';
import type { Book } from '@/types';

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
    title: 'Lập trình hướng đối tượng',
    author: 'Trần Minh Đức',
    category: 'Lập trình',
    copies: 3,
  },
];

describe('Kiểm tra hàm validateLoan và chuyển đổi dữ liệu', () => {
  it('dữ liệu hợp lệ trả về object rỗng không có lỗi', () => {
    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-01',
      term: '14',
      quantity: '1',
      reason: 'Mượn sách phục vụ nghiên cứu học tập',
    };
    const errors = validateLoan(input, mockBooks);
    expect(errors).toEqual({});
  });

  it('form trống báo đủ lỗi tất cả các trường', () => {
    const input: LoanInput = {
      bookId: '',
      pickupDate: '',
      term: '',
      quantity: '',
      reason: '',
    };
    const errors = validateLoan(input, mockBooks);
    expect(errors.bookId).toBe('Hãy chọn sách');
    expect(errors.pickupDate).toBe('Hãy chọn ngày');
    expect(errors.term).toBe('Hãy chọn thời hạn');
    expect(errors.quantity).toBe('Số quyển phải từ 1 trở lên');
    expect(errors.reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('ngày lấy sách ở quá khứ báo lỗi ngày không được ở quá khứ', () => {
    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2020-01-01',
      term: '7',
      quantity: '1',
      reason: 'Mượn sách nghiên cứu môn học',
    };
    const errors = validateLoan(input, mockBooks);
    expect(errors.pickupDate).toBe('Ngày lấy sách không được ở quá khứ');
  });

  it('lý do dưới 10 ký tự hoặc chuỗi toàn khoảng trắng đều báo lỗi', () => {
    const inputShort: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-01',
      term: '7',
      quantity: '1',
      reason: 'Ngắn',
    };
    expect(validateLoan(inputShort, mockBooks).reason).toBe('Lý do tối thiểu 10 ký tự');

    const inputSpaces: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-01',
      term: '7',
      quantity: '1',
      reason: '             ',
    };
    expect(validateLoan(inputSpaces, mockBooks).reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('số quyển vượt số bản của sách đã chọn báo lỗi vượt số bản', () => {
    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-01',
      term: '7',
      quantity: '2',
      reason: 'Mượn sách nghiên cứu môn học',
    };
    const errors = validateLoan(input, mockBooks);
    expect(errors.quantity).toBe('Vượt số bản của sách (1 bản)');
  });

  it('số quyển không phải số nguyên dương báo lỗi số quyển phải từ 1 trở lên', () => {
    const inputZero: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-01',
      term: '7',
      quantity: '0',
      reason: 'Mượn sách nghiên cứu môn học',
    };
    expect(validateLoan(inputZero, mockBooks).quantity).toBe('Số quyển phải từ 1 trở lên');

    const inputNegative: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-01',
      term: '7',
      quantity: '-1',
      reason: 'Mượn sách nghiên cứu môn học',
    };
    expect(validateLoan(inputNegative, mockBooks).quantity).toBe('Số quyển phải từ 1 trở lên');

    const inputText: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-01',
      term: '7',
      quantity: 'abc',
      reason: 'Mượn sách nghiên cứu môn học',
    };
    expect(validateLoan(inputText, mockBooks).quantity).toBe('Số quyển phải từ 1 trở lên');
  });

  it('thời hạn mượn không hợp lệ báo lỗi hãy chọn thời hạn', () => {
    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-01',
      term: '10',
      quantity: '1',
      reason: 'Mượn sách nghiên cứu môn học',
    };
    const errors = validateLoan(input, mockBooks);
    expect(errors.term).toBe('Hãy chọn thời hạn');
  });

  it('toLoanData ép kiểu số từ chuỗi và cắt khoảng trắng lý do', () => {
    const input: LoanInput = {
      bookId: '2',
      pickupDate: '2099-12-01',
      term: '30',
      quantity: '2',
      reason: '   Mượn sách làm đồ án tốt nghiệp   ',
    };
    const data = toLoanData(input);
    expect(data.bookId).toBe(2);
    expect(data.pickupDate).toBe('2099-12-01');
    expect(data.term).toBe(30);
    expect(data.quantity).toBe(2);
    expect(data.reason).toBe('Mượn sách làm đồ án tốt nghiệp');
  });

  it('toLoanInput chuyển đổi FormData và object thành LoanInput đầy đủ', () => {
    const formData = new FormData();
    formData.append('bookId', '3');
    formData.append('pickupDate', '2099-12-05');
    formData.append('term', '14');
    formData.append('quantity', '1');
    formData.append('reason', 'Lý do kiểm tra');

    const result = toLoanInput(formData);
    expect(result.bookId).toBe('3');
    expect(result.pickupDate).toBe('2099-12-05');

    const fromObj = toLoanInput({});
    expect(fromObj.bookId).toBe('');
    expect(fromObj.pickupDate).toBe('');
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

