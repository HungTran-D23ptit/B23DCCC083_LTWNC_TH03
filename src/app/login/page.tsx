import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { LoginForm } from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  const { callbackUrl } = await searchParams;

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto 0' }}>
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔐</div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
            Đăng nhập
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
            Hệ thống quản lý mượn sách Thư viện khoa CNTT
          </p>
        </div>

        <LoginForm callbackUrl={callbackUrl ?? '/loans'} />
      </div>
    </div>
  );
}
