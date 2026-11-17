'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { can } from '@/lib/permissions';

export async function reviewLoan(
  id: number,
  status: 'approved' | 'rejected'
): Promise<void> {
  const session = await auth();
  if (!session?.user?.role || !can(session.user.role, 'loan:review')) {
    throw new Error('Không có quyền');
  }

  const loan = db.loans.find((l) => l.id === id);
  if (loan && loan.status === 'pending') {
    loan.status = status;
  }

  revalidatePath('/admin');
}

