'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { can } from '@/lib/permissions';
import {
  toLoanInput,
  validateLoan,
  toLoanData,
  type LoanFormState,
} from '@/lib/loan-validate';
import { submitLoan, cancelLoan } from '@/lib/loans';

export async function createLoanAction(
  prevState: LoanFormState,
  formData: FormData
): Promise<LoanFormState> {
  const session = await auth();
  if (!session?.user?.role || !can(session.user.role, 'loan:create')) {
    throw new Error('Không có quyền');
  }

  const input = toLoanInput(formData);
  const errors = validateLoan(input, db.books);

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: input,
      ok: false,
    };
  }

  const data = toLoanData(input);
  const result = submitLoan(session.user.email!, data);

  if (!result.ok) {
    return {
      errors: {},
      values: input,
      message: result.message,
      ok: false,
    };
  }

  revalidatePath('/loans');

  return {
    errors: {},
    values: {},
    message: 'Đã gửi yêu cầu, chờ duyệt',
    ok: true,
  };
}

export async function cancelLoanAction(id: number): Promise<void> {
  const session = await auth();
  if (!session?.user?.email) {
    return;
  }

  cancelLoan(session.user.email, id);
  revalidatePath('/loans');
}

