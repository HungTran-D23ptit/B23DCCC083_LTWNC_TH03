import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { loadBooksShift } from '@/lib/books';

export const revalidate = 60;

export async function generateStaticParams() {
  const books = await loadBooksShift();
  return books.slice(0, 12).map((book) => ({ id: String(book.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = db.books.find((b) => b.id === Number(id));

  if (!book) {
    return {
      title: 'Không tìm thấy sách',
    };
  }

  return {
    title: `${book.title} – ${book.author}`,
    description: `Sách ${book.category}, thư viện có ${book.copies} bản.`,
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = db.books.find((b) => b.id === Number(id));

  if (!book) {
    notFound();
  }

  const now = new Date();
  const updateTime = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return (
    <div style={{ maxWidth: '640px', margin: '20px auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link
          href="/books"
          style={{
            fontSize: '14px',
            color: '#64748b',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ← Quay lại danh mục
        </Link>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '64px',
              height: '80px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              flexShrink: 0,
            }}
          >
            📘
          </div>

          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '8px',
              }}
            >
              {book.title}
            </h1>
            <span className="badge badge-info" style={{ marginBottom: '16px' }}>
              {book.category}
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '16px',
          }}
        >
          <p style={{ color: '#334155', fontSize: '15px' }}>
            <strong>Tác giả:</strong> {book.author}
          </p>
          <p style={{ color: '#334155', fontSize: '15px' }}>
            <strong>Chuyên mục:</strong> {book.category}
          </p>
          <p style={{ color: '#334155', fontSize: '15px' }}>
            <strong>Số bản:</strong> {book.copies}
          </p>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            Cập nhật lúc: {updateTime}
          </p>
        </div>

        <div
          style={{
            marginTop: '28px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '20px',
          }}
        >
          <Link
            href={`/loans?book=${book.id}`}
            className="btn"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            Mượn sách này
          </Link>
        </div>
      </div>
    </div>
  );
}
