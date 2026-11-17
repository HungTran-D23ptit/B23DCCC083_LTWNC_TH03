import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { loadBooksShift } from '@/lib/books';
import { listLoans } from '@/lib/loans';
import { formatDate, TERM_LABEL, STATUS_LABEL } from '@/lib/format';
import { LoanForm } from '@/components/LoanForm';
import { createLoanAction, cancelLoanAction } from './actions';

export const metadata: Metadata = {
  title: 'Sách đã mượn',
  robots: {
    index: false,
  },
};

export default async function LoansPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; book?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email || !session.user.role) {
    redirect('/login?callbackUrl=%2Floans');
  }

  const { status, page, book } = await searchParams;
  const currentPage = Number(page) || 1;

  const result = listLoans(
    { email: session.user.email, role: session.user.role },
    status,
    currentPage
  );

  const books = await loadBooksShift();
  const defaultBookId = book ? Number(book) : undefined;

  const makePageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (status) {
      params.set('status', status);
    }
    params.set('page', String(p));
    return `/loans?${params.toString()}`;
  };

  const getStatusBadgeClass = (s: string) => {
    if (s === 'approved') return 'badge-approved';
    if (s === 'rejected') return 'badge-rejected';
    return 'badge-pending';
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Sách đã mượn
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Theo dõi lịch sử yêu cầu mượn sách, trạng thái phê duyệt và thời hạn mượn
        </p>
      </div>

      {session.user.role === 'student' && (
        <LoanForm
          books={books}
          defaultBookId={defaultBookId}
          action={createLoanAction}
        />
      )}

      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <form method="GET" action="/loans" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label htmlFor="status" style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
            Trạng thái:{' '}
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status ?? ''}
            className="select-field"
            style={{ width: '180px' }}
          >
            <option value="">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
          <button type="submit" className="btn" style={{ padding: '8px 20px' }}>
            Lọc
          </button>
        </form>
      </div>

      <div className="table-container" style={{ marginBottom: '20px' }}>
        <table>
          <thead>
            <tr>
              <th>Tên sách</th>
              <th>Ngày lấy</th>
              <th>Thời hạn</th>
              <th>Số quyển</th>
              <th>Trạng thái</th>
              {session.user.role === 'student' && <th>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {result.items.length === 0 ? (
              <tr>
                <td
                  colSpan={session.user.role === 'student' ? 6 : 5}
                  style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}
                >
                  Chưa có yêu cầu mượn nào
                </td>
              </tr>
            ) : (
              result.items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: '#1e293b' }}>{item.bookTitle}</td>
                  <td>{formatDate(item.pickupDate)}</td>
                  <td>{TERM_LABEL[item.term]}</td>
                  <td>{item.quantity} quyển</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                      {STATUS_LABEL[item.status]}
                    </span>
                  </td>
                  {session.user.role === 'student' && (
                    <td>
                      {item.status === 'pending' && item.userEmail === session.user?.email && (
                        <form action={cancelLoanAction.bind(null, item.id)}>
                          <button
                            type="submit"
                            className="btn btn-danger"
                            style={{ padding: '4px 12px', fontSize: '13px' }}
                          >
                            Hủy
                          </button>
                        </form>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
        {result.page > 1 ? (
          <Link href={makePageUrl(result.page - 1)} className="btn btn-secondary" style={{ padding: '6px 16px' }}>
            Trước
          </Link>
        ) : (
          <span style={{ color: '#94a3b8', padding: '6px 16px', fontSize: '14px' }}>Trước</span>
        )}

        <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569', margin: '0 8px' }}>
          Trang {result.page}/{result.totalPages}
        </span>

        {result.page < result.totalPages ? (
          <Link href={makePageUrl(result.page + 1)} className="btn btn-secondary" style={{ padding: '6px 16px' }}>
            Sau
          </Link>
        ) : (
          <span style={{ color: '#94a3b8', padding: '6px 16px', fontSize: '14px' }}>Sau</span>
        )}
      </div>
    </div>
  );
}
