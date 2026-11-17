'use client';

import { useActionState } from 'react';
import type { Book } from '@/types';
import type { LoanFormState } from '@/lib/loan-validate';
import { TERM_LABEL } from '@/lib/format';

export interface LoanFormProps {
  books: Book[];
  defaultBookId?: number;
  action: (prev: LoanFormState, formData: FormData) => Promise<LoanFormState>;
}

export function LoanForm({ books, defaultBookId, action }: LoanFormProps) {
  const initialState: LoanFormState = {
    errors: {},
    values: defaultBookId
      ? { bookId: String(defaultBookId), quantity: '1' }
      : { quantity: '1' },
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  const formKey = [
    state.values?.bookId ?? (defaultBookId ? String(defaultBookId) : ''),
    state.values?.pickupDate ?? '',
    state.values?.term ?? '',
    state.values?.quantity ?? '1',
    state.values?.reason ?? '',
    state.ok ? 'success' : 'pending',
    state.message ?? '',
  ].join('::');

  const selectedBookId =
    state.values?.bookId !== undefined
      ? state.values.bookId
      : defaultBookId
      ? String(defaultBookId)
      : '';

  return (
    <form
      key={formKey}
      action={formAction}
      className="card"
      style={{
        maxWidth: '560px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '32px',
      }}
    >
      <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
          Đăng ký mượn sách
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          Chọn đầu sách, thời hạn và số lượng bản muốn mượn
        </p>
      </div>

      <div>
        <label
          htmlFor="bookId"
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '6px',
          }}
        >
          Sách
        </label>
        <select
          id="bookId"
          name="bookId"
          defaultValue={selectedBookId}
          className="select-field"
        >
          <option value="">-- Chọn sách --</option>
          {books.map((book) => (
            <option key={book.id} value={String(book.id)}>
              {book.title} ({book.copies} bản)
            </option>
          ))}
        </select>
        {state.errors?.bookId && (
          <div
            role="alert"
            style={{
              color: '#dc2626',
              fontSize: '12px',
              marginTop: '4px',
              fontWeight: 500,
            }}
          >
            {state.errors.bookId}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label
            htmlFor="pickupDate"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '6px',
            }}
          >
            Ngày lấy sách
          </label>
          <input
            type="date"
            id="pickupDate"
            name="pickupDate"
            defaultValue={state.values?.pickupDate ?? ''}
            className="input-field"
          />
          {state.errors?.pickupDate && (
            <div
              role="alert"
              style={{
                color: '#dc2626',
                fontSize: '12px',
                marginTop: '4px',
                fontWeight: 500,
              }}
            >
              {state.errors.pickupDate}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="term"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '6px',
            }}
          >
            Thời hạn mượn
          </label>
          <select
            id="term"
            name="term"
            defaultValue={state.values?.term ?? ''}
            className="select-field"
          >
            <option value="">-- Chọn thời hạn --</option>
            <option value="7">{TERM_LABEL[7]}</option>
            <option value="14">{TERM_LABEL[14]}</option>
            <option value="30">{TERM_LABEL[30]}</option>
          </select>
          {state.errors?.term && (
            <div
              role="alert"
              style={{
                color: '#dc2626',
                fontSize: '12px',
                marginTop: '4px',
                fontWeight: 500,
              }}
            >
              {state.errors.term}
            </div>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="quantity"
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '6px',
          }}
        >
          Số quyển
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          defaultValue={state.values?.quantity ?? '1'}
          className="input-field"
        />
        {state.errors?.quantity && (
          <div
            role="alert"
            style={{
              color: '#dc2626',
              fontSize: '12px',
              marginTop: '4px',
              fontWeight: 500,
            }}
          >
            {state.errors.quantity}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="reason"
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '6px',
          }}
        >
          Lý do mượn
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          placeholder="Mô tả mục đích mượn sách (tối thiểu 10 ký tự)..."
          defaultValue={state.values?.reason ?? ''}
          className="textarea-field"
        />
        {state.errors?.reason && (
          <div
            role="alert"
            style={{
              color: '#dc2626',
              fontSize: '12px',
              marginTop: '4px',
              fontWeight: 500,
            }}
          >
            {state.errors.reason}
          </div>
        )}
      </div>

      {state.message && (
        <div
          role={state.ok ? 'status' : 'alert'}
          style={{
            color: state.ok ? '#065f46' : '#991b1b',
            backgroundColor: state.ok ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${state.ok ? '#a7f3d0' : '#fecaca'}`,
            borderRadius: '6px',
            padding: '10px 14px',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {state.message}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="btn"
          style={{ width: '100%', padding: '10px', fontSize: '15px' }}
        >
          {isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </button>
      </div>
    </form>
  );
}
