import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === 'string' ? detail : (detail ? JSON.stringify(detail) : 'Invalid email or password. Try demo: deep@foodlens.ai / demo123');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md card-fresh p-8 space-y-6 bg-white shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#164B3A] text-white flex items-center justify-center font-black mx-auto">
            <Sparkles className="w-6 h-6 text-[#DDF3E7]" />
          </div>
          <h1 className="text-2xl font-black text-[#17201C] tracking-tight">Sign In to FoodLens</h1>
          <p className="text-xs text-[#5A6561] font-semibold">Enter your credentials to access your profile & scans</p>
        </div>

        {error && (
          <div className="card-coral p-3 text-xs font-extrabold text-[#E8785D] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-extrabold text-[#17201C] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5A6561] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="deep@foodlens.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-[#F8F8F4] border border-[#E5E9E6] text-xs font-semibold text-[#17201C] focus:outline-none focus:border-[#164B3A]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-extrabold text-[#17201C] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5A6561] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-[#F8F8F4] border border-[#E5E9E6] text-xs font-semibold text-[#17201C] focus:outline-none focus:border-[#164B3A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-[16px] font-extrabold bg-[#164B3A] text-white hover:bg-[#0F3629] transition-all text-xs shadow-md"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-4 border-t border-[#E5E9E6] text-center text-xs text-[#5A6561] font-semibold">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="font-extrabold text-[#164B3A] hover:underline"
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
};
