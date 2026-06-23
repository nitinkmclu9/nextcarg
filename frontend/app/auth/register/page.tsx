'use client';

import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1>Create Account</h1>

      <input type="text" placeholder="Name" />
      <br />

      <input type="email" placeholder="Email" />
      <br />

      <input type="password" placeholder="Password" />
      <br />

      <button>Create Account</button>

      <p>
        Already have an account?{' '}
        <Link href="/auth/login">Login</Link>
      </p>
    </div>
  );
}