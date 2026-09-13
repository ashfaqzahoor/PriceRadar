import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice.js';

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const result = await dispatch(login(form));
    if (result.meta.requestStatus === 'fulfilled') navigate('/');
    else setError(result.error.message || 'Login failed');
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-12">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Sign in to PriceRadar</h1>
        <p className="text-xs text-gray-500 mb-6">
          Access your saved items and sync baskets across your devices.
        </p>

        <form onSubmit={submit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-green-700 py-2.5 text-sm font-medium text-white hover:bg-green-800 transition-colors disabled:opacity-50 shadow-xs"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-xs text-gray-500 pt-2">
            Don't have an account?{' '}
            <Link className="font-medium text-green-700 hover:text-green-800" to="/register">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
