import Link from 'next/link';
import { loadBooksShift } from '@/lib/books';

export default async function HomePage() {
  const books = await loadBooksShift();
  const categories = new Set(books.map((b) => b.category));

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto 0' }}>
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '48px 32px',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#1e3a8a',
            marginBottom: '12px',
          }}
        >
          Thư viện khoa CNTT PTIT
        </h1>
        <p
          style={{
            fontSize: '18px',
            color: '#475569',
            marginBottom: '24px',
            fontWeight: 500,
          }}
        >
          {books.length} đầu sách · {categories.size} chuyên mục
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link
            href="/books"
            className="btn"
            style={{
              padding: '12px 28px',
              fontSize: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
            }}
          >
            Xem danh mục sách
          </Link>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginTop: '32px',
        }}
      >
        {Array.from(categories).map((cat) => (
          <Link
            key={cat}
            href={`/books?category=${encodeURIComponent(cat)}`}
            className="card"
            style={{
              padding: '20px',
              textAlign: 'center',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📂</div>
            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>
              {cat}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              6 đầu sách
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
