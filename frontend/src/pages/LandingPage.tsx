import React from 'react';
import { Sparkles, Scan, HeartPulse, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 py-10">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center py-16 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/15 blur-[120px] rounded-full -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs mb-8 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> AI-Powered Food Intelligence Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white max-w-4xl mx-auto leading-tight tracking-tight">
          We don't just show you the label—we <span className="gradient-text">explain it, personalize it</span>, and remember it.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Instantly scan barcodes or package labels to unpack ingredients, INS additives, allergens, and get tailored nutritional suitability scores tailored to your health goals.
        </p>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
          <button
            onClick={() => onNavigate('register')}
            className="px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all flex items-center gap-2 text-base"
          >
            Start Free Personalization <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('scan')}
            className="px-8 py-4 rounded-2xl font-bold glass-panel border border-slate-700 text-white hover:bg-slate-800 transition-all flex items-center gap-2 text-base"
          >
            <Scan className="w-5 h-5 text-emerald-400" /> Try Instant Scanner Demo
          </button>
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Scan className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Multi-Layer Scanning</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Barcode lookup via Open Food Facts with automatic computer vision OpenCV + Tesseract OCR fallback for unlisted or custom packaged labels.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-teal-500/30 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <HeartPulse className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Personalized Suitability Engine</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Deterministic Nutri-Score algorithm customized for your goals: Diabetes-oriented eating, High Protein, Low Sodium, Low Sugar, or Vegan profiles.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-purple-500/30 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Ingredient Intelligence</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Decodes technical INS additive numbers (INS 322, INS 415), flags allergens, and explains complex emulsifiers in simple plain language.
          </p>
        </div>

      </section>

      {/* Detailed Workflow Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-panel-glow rounded-3xl p-10 md:p-14 border border-emerald-500/30 relative overflow-hidden">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Designed for your everyday food decisions
            </h2>
            <p className="text-slate-300 text-base mb-8 leading-relaxed">
              FoodLens converts raw packaged nutrition tables into actionable, explainable insights so you always know what you're buying.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 text-sm font-medium text-slate-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Side-by-side Product Matrix
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Virtual Grocery Basket Aggregator
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Healthy Next-Step Recommendations
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Recharts Intake Trends & Analytics
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => onNavigate('register')}
                className="px-6 py-3.5 rounded-xl font-bold bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
              >
                Create Your Account Now
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
