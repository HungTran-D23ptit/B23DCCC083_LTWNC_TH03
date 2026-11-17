import type { ReactNode } from 'react';

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <span
          className="badge badge-gray"
          style={{
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '4px 12px',
            color: '#475569',
            backgroundColor: '#e2e8f0',
          }}
        >
          Khu vực thành viên
        </span>
      </div>
      {children}
    </div>
  );
}
