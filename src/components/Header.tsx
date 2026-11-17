'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '32px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link
            href="/"
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#1e40af',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>📚</span>
            <span>Thư viện CNTT</span>
          </Link>

          <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link
              href="/"
              style={{
                color: '#475569',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              Trang chủ
            </Link>
            <Link
              href="/books"
              style={{
                color: '#475569',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              Sách
            </Link>
            {session?.user && (
              <Link
                href="/loans"
                style={{
                  color: '#475569',
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              >
                Sách đã mượn
              </Link>
            )}
            {session?.user?.role === 'admin' && (
              <Link
                href="/admin"
                style={{
                  color: '#475569',
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              >
                Quản trị
              </Link>
            )}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {status === 'loading' ? (
            <div style={{ width: '90px', height: '36px' }} />
          ) : session?.user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#f1f5f9',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                }}
              >
                <span style={{ color: '#334155' }}>
                  Xin chào, <strong>{session.user.name}</strong> ({session.user.role})
                </span>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '13px' }}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn"
              style={{ padding: '8px 18px', fontSize: '14px' }}
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
