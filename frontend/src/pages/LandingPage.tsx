import React from 'react';
import { Sparkles, Scan, HeartPulse, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-8 px-4 max-w-6xl mx-auto">
      
      {/* Hero Section (Section 13 spec: "FOODLENS — Understand what's really in your food.") */}
      <section className="text-center py-12 px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DDF3E7] border border-[#164B3A]/20 text-[#164B3A] font-extrabold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#164B3A]" /> Fresh Intelligence Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-[#17201C] max-w-4xl mx-auto leading-tight tracking-tight">
          Understand what's <span className="text-[#164B3A] underline decoration-[#DDF3E7] decoration-wavy">really</span> in your food.
        </h1>

        <p className="text-base sm:text-lg text-[#5A6561] max-w-2xl mx-auto leading-relaxed font-semibold">
          Discover the truth behind the labels. Scan barcodes or ingredient lists for instant AI-powered analysis, personalized health scores, and clear explanations.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('register')}
            className="px-8 py-4 rounded-[18px] font-extrabold bg-[#164B3A] text-white shadow-lg hover:bg-[#0F3629] transition-all flex items-center gap-2 text-sm"
          >
            Start Personalization <ArrowRight className="w-4 h-4 text-[#DDF3E7]" />
          </button>

          <button
            onClick={() => onNavigate('scan')}
            className="px-8 py-4 rounded-[18px] font-extrabold bg-[#DDF3E7] text-[#164B3A] hover:bg-[#cbebd9] transition-all flex items-center gap-2 text-sm"
          >
            <Scan className="w-4 h-4 text-[#164B3A]" /> Try Camera Scanner
          </button>
        </div>
      </section>

      {/* Core Platform Capabilities Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        
        <div className="card-fresh p-8 space-y-4 hover:border-[#164B3A]/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#DDF3E7] text-[#164B3A] flex items-center justify-center font-black">
            <Scan className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#17201C]">Barcode + OCR Fallback</h3>
          <p className="text-[#5A6561] text-xs font-semibold leading-relaxed">
            Scan via Open Food Facts or utilize fallback OpenCV AI OCR image recognition for custom packaged labels.
          </p>
        </div>

        <div className="card-fresh p-8 space-y-4 hover:border-[#164B3A]/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#DDF3E7] text-[#164B3A] flex items-center justify-center font-black">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#17201C]">Goal Suitability Engine</h3>
          <p className="text-[#5A6561] text-xs font-semibold leading-relaxed">
            Deterministic scoring engine tailored to Diabetes-Oriented, High Protein, Low Sodium, or Vegan profile goals.
          </p>
        </div>

        <div className="card-fresh p-8 space-y-4 hover:border-[#164B3A]/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#DDF3E7] text-[#164B3A] flex items-center justify-center font-black">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#17201C]">Ingredient Intelligence</h3>
          <p className="text-[#5A6561] text-xs font-semibold leading-relaxed">
            Decodes technical INS additive codes (INS 322, INS 415), flags allergens, and explains complex ingredients clearly.
          </p>
        </div>

      </section>

      {/* Feature Highlights Banner */}
      <section>
        <div className="card-forest p-8 sm:p-12 space-y-6 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Designed for your everyday food decisions
            </h2>
            <p className="text-[#DDF3E7] text-sm leading-relaxed font-medium">
              FoodLens converts raw packaged nutrition tables into actionable, explainable insights so you always know what you're buying.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 text-xs font-extrabold text-white pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DDF3E7]" /> Side-by-side Product Matrix
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DDF3E7]" /> Virtual Grocery Basket Aggregator
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DDF3E7]" /> Healthy Next-Step Insights
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DDF3E7]" /> Recharts Intake Trends & Analytics
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('register')}
                className="px-6 py-3.5 rounded-[16px] font-extrabold bg-[#DDF3E7] text-[#164B3A] hover:bg-white transition-colors text-xs"
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
