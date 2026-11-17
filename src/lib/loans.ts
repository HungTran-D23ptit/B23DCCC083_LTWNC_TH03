import { db } from './db';
import { can } from './permissions';
import type { Loan, LoanData, LoanStatus, Role } from '@/types';

export interface LoanItem extends Loan {
  bookTitle: string;
}

export interface ListLoansResult {
  items: LoanItem[];
  total: number;
  page: number;
  totalPages: number;
}

export function parseStatus(v: string | undefined): LoanStatus | undefined {
  if (v === 'pending' || v === 'approved' || v === 'rejected') {
    return v;
  }
  return undefined;
}

export function listLoans(
  viewer: { email: string; role: Role },
  status?: string,
  page: number = 1
): ListLoansResult {
  let list: Loan[] = [];

  if (can(viewer.role, 'loan:view-all')) {
    list = [...db.loans];
  } else if (can(viewer.role, 'loan:view-own')) {
    list = db.loans.filter((l) => l.userEmail === viewer.email);
  }

  const parsed = parseStatus(status);
  if (parsed) {
    list = list.filter((l) => l.status === parsed);
  }

  const mapped: LoanItem[] = list.map((loan) => {
    const book = db.books.find((b) => b.id === loan.bookId);
    return {
      ...loan,
      bookTitle: book ? book.title : '',
    };
  });

  const total = mapped.length;
  const totalPages = Math.max(1, Math.ceil(total / 10));

  let currentPage = page;
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const start = (currentPage - 1) * 10;
  const items = mapped.slice(start, start + 10);

  return {
    items,
    total,
    page: currentPage,
    totalPages,
  };
}

export function submitLoan(
  email: string,
  data: LoanData
): { ok: true; loan: Loan } | { ok: false; message: string } {
  const book = db.books.find((b) => b.id === data.bookId);
  if (!book) {
    return { ok: false, message: 'Sách không tồn tại' };
  }

  const reserved = db.loans
    .filter(
      (l) =>
        l.bookId === data.bookId &&
        l.pickupDate === data.pickupDate &&
        l.status !== 'rejected'
    )
    .reduce((sum, l) => sum + l.quantity, 0);

  if (reserved + data.quantity > book.copies) {
    return { ok: false, message: 'Sách đã hết bản vào ngày này' };
  }

  const newLoan: Loan = {
    id: db.nextLoanId++,
    bookId: data.bookId,
    userEmail: email,
    pickupDate: data.pickupDate,
    term: data.term,
    quantity: data.quantity,
    reason: data.reason,
    status: 'pending',
  };

  db.loans.unshift(newLoan);

  return { ok: true, loan: newLoan };
}

export function cancelLoan(
  email: string,
  id: number
): 'not-found' | 'forbidden' | 'not-pending' | 'ok' {
  const index = db.loans.findIndex((l) => l.id === id);
  if (index === -1) {
    return 'not-found';
  }

  const loan = db.loans[index];
  if (loan.userEmail !== email) {
    return 'forbidden';
  }

  if (loan.status !== 'pending') {
    return 'not-pending';
  }

  db.loans.splice(index, 1);
  return 'ok';
}

