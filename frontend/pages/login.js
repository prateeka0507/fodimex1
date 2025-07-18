import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5eee6] py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#b48a4a]">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#2E251D]">Login</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-[#b48a4a]"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-[#b48a4a]"
          />
          {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[#b48a4a] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#a07628] transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center text-[#7c6f5a]">
          Don't have an account? <a href="/register" className="text-[#b48a4a] hover:underline font-semibold">Register</a>
        </div>
      </div>
    </div>
  );
} 