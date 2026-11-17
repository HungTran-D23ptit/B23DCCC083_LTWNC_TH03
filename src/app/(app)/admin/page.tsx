import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { can } from '@/lib/permissions';
import { formatDate, TERM_LABEL } from '@/lib/format';
import { reviewLoan } from './actions';

export const metadata: Metadata = {
  title: 'Quản trị mượn sách',
  robots: {
    index: false,
  },
};

export default async function AdminPage() {
  const session = await auth();
  if (!can(session?.user?.role, 'loan:review')) {
    redirect('/forbidden');
  }

  const pendingCount = db.loans.filter((l) => l.status === 'pending').length;
  const approvedCount = db.loans.filter((l) => l.status === 'approved').length;
  const rejectedCount = db.loans.filter((l) => l.status === 'rejected').length;

  const pendingLoans = db.loans.filter((l) => l.status === 'pending');

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Duyệt yêu cầu mượn sách
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Phê duyệt hoặc từ chối các yêu cầu đăng ký mượn tài liệu của sinh viên
        </p>
      </div>

      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#334155' }}>
          Chờ duyệt: {pendingCount} | Đã duyệt: {approvedCount} | Từ chối: {rejectedCount}
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-pending">Chờ duyệt: {pendingCount}</span>
          <span className="badge badge-approved">Đã duyệt: {approvedCount}</span>
          <span className="badge badge-rejected">Từ chối: {rejectedCount}</span>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tên sách</th>
              <th>Ngày lấy</th>
              <th>Thời hạn</th>
              <th>Email người mượn</th>
              <th style={{ width: '160px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pendingLoans.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  Không có yêu cầu nào đang chờ duyệt
                </td>
              </tr>
            ) : (
              pendingLoans.map((loan) => {
                const book = db.books.find((b) => b.id === loan.bookId);
                return (
                  <tr key={loan.id}>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>
                      {book ? book.title : ''}
                    </td>
                    <td>{formatDate(loan.pickupDate)}</td>
                    <td>{TERM_LABEL[loan.term]}</td>
                    <td style={{ color: '#475569' }}>{loan.userEmail}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <form action={reviewLoan.bind(null, loan.id, 'approved')}>
                          <button
                            type="submit"
                            className="btn btn-success"
                            style={{ padding: '4px 12px', fontSize: '13px' }}
                          >
                            Duyệt
                          </button>
                        </form>
                        <form action={reviewLoan.bind(null, loan.id, 'rejected')}>
                          <button
                            type="submit"
                            className="btn btn-danger"
                            style={{ padding: '4px 12px', fontSize: '13px' }}
                          >
                            Từ chối
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
