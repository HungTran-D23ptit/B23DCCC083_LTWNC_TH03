import { describe, it, expect, vi } from 'vitest';
import { createLoanAction } from './actions';
import type { Session } from 'next-auth';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Kiểm thử Server Action createLoanAction', () => {
  it('admin gửi yêu cầu mượn thì ném lỗi Không có quyền', async () => {
    const { auth } = await import('@/auth');
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { email: 'admin@ptit.edu.vn', role: 'admin' },
      expires: '',
    } as unknown as Session);

    const formData = new FormData();
    await expect(
      createLoanAction({ errors: {}, values: {} }, formData)
    ).rejects.toThrow('Không có quyền');
  });

  it('student gửi yêu cầu mượn hợp lệ thì xử lý thành công', async () => {
    const { auth } = await import('@/auth');
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { email: 'sv01@ptit.edu.vn', role: 'student' },
      expires: '',
    } as unknown as Session);

    const formData = new FormData();
    formData.append('bookId', '11');
    formData.append('pickupDate', '2026-12-03');
    formData.append('term', '14');
    formData.append('quantity', '1');
    formData.append('reason', 'Mượn sách phục vụ nghiên cứu học tập');

    const result = await createLoanAction({ errors: {}, values: {} }, formData);
    expect(result.ok).toBe(true);
    expect(result.message).toBe('Đã gửi yêu cầu, chờ duyệt');
  });
});
