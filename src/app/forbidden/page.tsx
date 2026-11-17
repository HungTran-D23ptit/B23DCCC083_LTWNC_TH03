import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div style={{ maxWidth: '480px', margin: '40px auto 0' }}>
      <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#dc2626',
            marginBottom: '8px',
          }}
        >
          403 - Cấm truy cập
        </h1>
        <p style={{ color: '#475569', marginBottom: '24px', fontSize: '15px' }}>
          Bạn không có quyền truy cập trang này.
        </p>
        <Link href="/" className="btn">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
