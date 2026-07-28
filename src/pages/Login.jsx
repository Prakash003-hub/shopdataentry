import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Required',
        text: 'Please enter your login password.',
        confirmButtonColor: '#16a34a',
      });
      return;
    }

    setLoading(true);
    const res = await login(password);
    setLoading(false);

    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: 'Redirecting to SUBI Dashboard...',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/dashboard');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: res.message || 'Incorrect password. Try again.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 relative overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-card bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl text-white relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-green-600/40">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            SUBI <span className="text-green-400">Online Service</span>
          </h1>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Shop Budget & Customer Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-green-400" />
              <span>Enter System Password</span>
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password (e.g. 132003)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700/80 focus:border-green-500 text-white placeholder-slate-500 rounded-2xl px-4 py-3.5 text-sm font-semibold tracking-widest transition-all outline-none"
                autoFocus
              />
              <KeyRound className="w-5 h-5 text-slate-500 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span>Validating...</span>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800/80 pt-4">
          <span className="text-[11px] text-slate-400">
            Protected Single-User System • PWA Enabled
          </span>
        </div>
      </div>
    </div>
  );
}
