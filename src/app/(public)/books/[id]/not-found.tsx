import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ maxWidth: '480px', margin: '40px auto 0' }}>
      <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <h1
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '8px',
          }}
        >
          Không tìm thấy sách
        </h1>
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
          Đầu sách bạn tìm kiếm không tồn tại hoặc đã được gỡ khỏi hệ thống.
        </p>
        <Link href="/books" className="btn">
          Xem danh mục sách
        </Link>
      </div>
    </div>
  );
}
