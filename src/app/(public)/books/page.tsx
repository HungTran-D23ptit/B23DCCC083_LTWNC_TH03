import Link from 'next/link';
import { CATEGORIES } from '@/data/books';
import { loadBooksShift } from '@/lib/books';

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const books = await loadBooksShift({ category, q });

  const now = new Date();
  const renderTime = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Danh mục sách
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Tra cứu, tìm kiếm và lựa chọn các tài liệu học tập, giáo trình chuyên ngành CNTT
        </p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <form method="GET" action="/books">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ flex: '1 1 240px' }}>
              <label
                htmlFor="q"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569',
                  marginBottom: '6px',
                }}
              >
                Tìm sách
              </label>
              <input
                id="q"
                name="q"
                type="text"
                placeholder="Nhập tên sách..."
                defaultValue={q ?? ''}
                className="input-field"
              />
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <label
                htmlFor="category"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569',
                  marginBottom: '6px',
                }}
              >
                Chuyên mục
              </label>
              <select
                id="category"
                name="category"
                defaultValue={category ?? ''}
                className="select-field"
              >
                <option value="">Tất cả</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: '0 0 auto' }}>
              <button
                type="submit"
                className="btn"
                style={{ height: '38px', padding: '0 24px' }}
              >
                Lọc
              </button>
            </div>
          </div>
        </form>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          padding: '0 4px',
        }}
      >
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#334155' }}>
          Tìm thấy {books.length} sách
        </p>
        <p
          className="badge badge-gray"
          style={{ fontSize: '13px', padding: '4px 10px' }}
        >
          Render lúc: {renderTime}
        </p>
      </div>

      {books.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: '#64748b',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📖</div>
          <p style={{ fontSize: '16px', fontWeight: 500 }}>
            Không tìm thấy sách nào
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Tên sách</th>
                <th style={{ width: '35%' }}>Tác giả</th>
                <th style={{ width: '20%' }}>Số bản</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    <Link
                      href={`/books/${book.id}`}
                      style={{
                        fontWeight: 600,
                        color: '#1d4ed8',
                        fontSize: '15px',
                      }}
                    >
                      {book.title}
                    </Link>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        marginTop: '2px',
                      }}
                    >
                      {book.category}
                    </div>
                  </td>
                  <td style={{ color: '#334155' }}>{book.author}</td>
                  <td>
                    <span className="badge badge-info">
                      Số bản: {book.copies}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
