import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Scan, 
  LayoutDashboard, 
  ShoppingBag, 
  History as HistoryIcon, 
  User as UserIcon, 
  LogOut, 
  Sparkles,
  GitCompare,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, authRequired: true },
    { id: 'scan', label: 'Scan Food', icon: Scan, authRequired: false },
    { id: 'compare', label: 'Compare', icon: GitCompare, authRequired: true },
    { id: 'basket', label: 'Basket', icon: ShoppingBag, authRequired: true },
    { id: 'history', label: 'History', icon: HistoryIcon, authRequired: true },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-700/50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight gradient-text">FoodLens</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AI Intelligence
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            if (item.authRequired && !user) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right User Status & Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm transition-all ${
                  activeTab === 'profile'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-700 bg-slate-800/40 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{user.name}</span>
              </button>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-xl border border-slate-700 hover:border-red-500/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('login')}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2">
          {navItems.map((item) => {
            if (item.authRequired && !user) return null;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-medium ${
                  activeTab === item.id ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
          {user ? (
            <>
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm text-emerald-400 hover:bg-slate-800"
              >
                <UserIcon className="w-5 h-5" />
                Profile ({user.name})
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm text-red-400 hover:bg-slate-800"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-medium text-slate-200 bg-slate-800 rounded-xl"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-bold text-slate-950 bg-emerald-500 rounded-xl"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
