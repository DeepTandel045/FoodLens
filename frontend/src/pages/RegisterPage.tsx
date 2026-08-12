import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, AlertCircle } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (tab: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    
    if (cleanName.length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.') || cleanEmail.length < 5) {
      setError("Please enter a valid email address (e.g. deep@foodlens.ai).");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(cleanName, cleanEmail, password);
      onNavigate('onboarding');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      let msg = 'Registration failed. Email may already exist.';
      if (typeof detail === 'string') {
        msg = detail.replace(/^Value error,\s*/i, '');
      } else if (Array.isArray(detail)) {
        msg = detail.map((d: any) => {
          const raw = d.msg || JSON.stringify(d);
          return raw.replace(/^Value error,\s*/i, '');
        }).join('. ');
      } else if (detail && typeof detail === 'object') {
        msg = JSON.stringify(detail);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md card-fresh p-8 space-y-6 bg-white shadow-xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#164B3A] text-white flex items-center justify-center font-black mx-auto">
            <Sparkles className="w-6 h-6 text-[#DDF3E7]" />
          </div>
          <h1 className="text-2xl font-black text-[#17201C] tracking-tight">Create FoodLens Account</h1>
          <p className="text-xs text-[#5A6561] font-semibold">Join FoodLens for personalized food intelligence</p>
        </div>

        {error && (
          <div className="card-coral p-3 text-xs font-extrabold text-[#E8785D] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-extrabold text-[#17201C] uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#5A6561] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Deep Tandel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-[#F8F8F4] border border-[#E5E9E6] text-xs font-semibold text-[#17201C] focus:outline-none focus:border-[#164B3A]"
              />
            </div>
          </div>

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
            {loading ? 'Creating Account...' : 'Continue to Personalization'}
          </button>
        </form>

        <div className="pt-4 border-t border-[#E5E9E6] text-center text-xs text-[#5A6561] font-semibold">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-extrabold text-[#164B3A] hover:underline"
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
};
