'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [errorMessage, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <form
      action={formAction}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '6px',
          }}
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="sv01@ptit.edu.vn"
          required
          className="input-field"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#334155',
            marginBottom: '6px',
          }}
        >
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="input-field"
        />
      </div>

      {errorMessage && (
        <div
          role="alert"
          style={{
            color: '#b91c1c',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '10px 14px',
            fontSize: '14px',
          }}
        >
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn"
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '15px',
          fontWeight: 600,
          marginTop: '6px',
        }}
      >
        {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>

      <div
        style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9',
          fontSize: '12px',
          color: '#64748b',
          lineHeight: '1.6',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Tài khoản thử nghiệm:</div>
        <div>• Sinh viên: <code>sv01@ptit.edu.vn</code> / <code>sv123456</code></div>
        <div>• Thủ thư (Admin): <code>admin@ptit.edu.vn</code> / <code>admin123</code></div>
      </div>
    </form>
  );
}
