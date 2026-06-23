'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
const router = useRouter();

const [formData, setFormData] = useState({
name: '',
email: '',
password: '',
});

const [loading, setLoading] = useState(false);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();


try {
  setLoading(true);

  await api.post('/auth/register', formData);

  alert('Account created successfully');
  router.push('/auth/login');
} catch (error: any) {
  alert(
    error?.response?.data?.message || 'Registration failed'
  );
} finally {
  setLoading(false);
}


};

return (
<div
style={{
minHeight: '100vh',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
}}
> <form onSubmit={handleSubmit}> <h1>Create Account</h1>


    <input
      type="text"
      name="name"
      placeholder="Name"
      value={formData.name}
      onChange={handleChange}
      required
    />

    <br /><br />

    <input
      type="email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      required
    />

    <br /><br />

    <input
      type="password"
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
      required
    />

    <br /><br />

    <button type="submit">
      {loading ? 'Creating...' : 'Create Account'}
    </button>

    <p>
      Already have an account?{' '}
      <Link href="/auth/login">Login</Link>
    </p>
  </form>
</div>


);
}
