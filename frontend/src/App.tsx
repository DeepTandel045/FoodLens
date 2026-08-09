import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScanPage } from './pages/ScanPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ComparePage } from './pages/ComparePage';
import { BasketPage } from './pages/BasketPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import type { ScanResult } from './types';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedScanResult, setSelectedScanResult] = useState<ScanResult | null>(null);

  const handleNavigate = (tab: string, data?: any) => {
    if (tab === 'product_details' && data) {
      setSelectedScanResult(data);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Redirect logged-in users landing page access to dashboard automatically
  React.useEffect(() => {
    if (user && (activeTab === 'landing' || activeTab === 'login' || activeTab === 'register')) {
      setActiveTab('dashboard');
    } else if (!user && activeTab !== 'landing' && activeTab !== 'login' && activeTab !== 'register' && activeTab !== 'scan') {
      setActiveTab('landing');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold">Initializing FoodLens...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={handleNavigate} />
      
      <main className="flex-1 pb-16">
        {activeTab === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {activeTab === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {activeTab === 'register' && <RegisterPage onNavigate={handleNavigate} />}
        {activeTab === 'onboarding' && <OnboardingPage onNavigate={handleNavigate} />}
        {activeTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        {activeTab === 'scan' && <ScanPage onNavigate={handleNavigate} />}
        {activeTab === 'product_details' && selectedScanResult && (
          <ProductDetailsPage scanResult={selectedScanResult} onNavigate={handleNavigate} />
        )}
        {activeTab === 'compare' && <ComparePage onNavigate={handleNavigate} />}
        {activeTab === 'basket' && <BasketPage onNavigate={handleNavigate} />}
        {activeTab === 'history' && <HistoryPage onNavigate={handleNavigate} />}
        {activeTab === 'profile' && <ProfilePage />}
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FoodLens — AI-Powered Food Intelligence Platform (SRS v1.0)</span>
          <span className="text-slate-600">Decision-Support System — Educational Purpose Only</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
