import type { Book, LoanInput, LoanData, LoanErrors, LoanFormState } from '@/types';

export type { LoanInput, LoanData, LoanErrors, LoanFormState };

export function today(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function toLoanInput(raw: FormData | Record<string, unknown>): LoanInput {
  if (typeof FormData !== 'undefined' && raw instanceof FormData) {
    return {
      bookId: raw.get('bookId')?.toString() ?? '',
      pickupDate: raw.get('pickupDate')?.toString() ?? '',
      term: raw.get('term')?.toString() ?? '',
      quantity: raw.get('quantity')?.toString() ?? '',
      reason: raw.get('reason')?.toString() ?? '',
    };
  }

  const obj = raw as Record<string, unknown>;
  return {
    bookId:
      typeof obj['bookId'] === 'string'
        ? obj['bookId']
        : obj['bookId'] != null
        ? String(obj['bookId'])
        : '',
    pickupDate:
      typeof obj['pickupDate'] === 'string'
        ? obj['pickupDate']
        : obj['pickupDate'] != null
        ? String(obj['pickupDate'])
        : '',
    term:
      typeof obj['term'] === 'string'
        ? obj['term']
        : obj['term'] != null
        ? String(obj['term'])
        : '',
    quantity:
      typeof obj['quantity'] === 'string'
        ? obj['quantity']
        : obj['quantity'] != null
        ? String(obj['quantity'])
        : '',
    reason:
      typeof obj['reason'] === 'string'
        ? obj['reason']
        : obj['reason'] != null
        ? String(obj['reason'])
        : '',
  };
}

export function validateLoan(input: LoanInput, books: Book[]): LoanErrors {
  const errors: LoanErrors = {};

  const selectedBook = books.find((b) => b.id === Number(input.bookId));
  if (!input.bookId || !selectedBook) {
    errors.bookId = 'Hãy chọn sách';
  }

  if (!input.pickupDate || input.pickupDate.trim() === '') {
    errors.pickupDate = 'Hãy chọn ngày';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(input.pickupDate)) {
    errors.pickupDate = 'Hãy chọn ngày';
  } else if (input.pickupDate < today()) {
    errors.pickupDate = 'Ngày lấy sách không được ở quá khứ';
  }

  if (input.term !== '7' && input.term !== '14' && input.term !== '30') {
    errors.term = 'Hãy chọn thời hạn';
  }

  const trimmedQty = input.quantity ? input.quantity.trim() : '';
  if (!trimmedQty || !/^\d+$/.test(trimmedQty) || Number(trimmedQty) < 1) {
    errors.quantity = 'Số quyển phải từ 1 trở lên';
  } else if (selectedBook && Number(trimmedQty) > selectedBook.copies) {
    errors.quantity = `Vượt số bản của sách (${selectedBook.copies} bản)`;
  }

  const trimmedReason = input.reason ? input.reason.trim() : '';
  if (trimmedReason.length < 10) {
    errors.reason = 'Lý do tối thiểu 10 ký tự';
  }

  return errors;
}

export function toLoanData(input: LoanInput): LoanData {
  return {
    bookId: Number(input.bookId),
    pickupDate: input.pickupDate,
    term: Number(input.term) as 7 | 14 | 30,
    quantity: Number(input.quantity),
    reason: input.reason.trim(),
  };
}
