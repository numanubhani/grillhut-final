
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAdminStatus } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@gh.com' && password === 'admin') {
      setAdminStatus(true);
      navigate('/admin');
    } else {
      setError('Invalid credentials. Hint: admin@gh.com / admin');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-zinc-800 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-3xl font-serif font-black mb-2">Admin Portal</h2>
          <p className="text-slate-500 dark:text-zinc-400">Access your restaurant management hub</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="admin@gh.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold transition-all shadow-lg active:scale-95 group"
          >
            Sign In
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
