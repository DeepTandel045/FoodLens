import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/api';
import type { DashboardData } from '../types';
import { CircularScoreRing } from '../components/CircularScoreRing';
import { 
  Scan, 
  TrendingUp, 
  Sparkles, 
  Activity,
  ChevronRight,
  Camera,
  ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

interface DashboardPageProps {
  onNavigate: (tab: string, data?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[#5A6561]">
          <div className="w-12 h-12 border-4 border-[#164B3A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-extrabold text-[#164B3A]">Loading your FoodLens Dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = data?.user_name || 'Deep';

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8">
      
      {/* 1. HERO GREETING & HEADER (Section 3 spec) */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-[#17201C] tracking-tight">
          Good morning, {userName} 👋
        </h1>
        <p className="text-sm text-[#5A6561] font-semibold">
          Eat smarter today. Goal: <span className="text-[#164B3A] bg-[#DDF3E7] px-2 py-0.5 rounded-full text-xs font-extrabold uppercase">{data?.dietary_goal?.replace('_', ' ') || 'General Healthy'}</span>
        </p>
      </div>

      {/* 2. HERO SCORE & SCAN CTA CARDS GRID (Section 3 spec) */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Today's Score Soft Card */}
        <div className="card-fresh p-6 sm:p-8 flex flex-col items-center justify-between space-y-4 text-center relative overflow-hidden bg-white">
          <span className="text-xs font-black uppercase tracking-wider text-[#5A6561]">
            Today's FoodLens Score
          </span>

          <CircularScoreRing 
            score={data?.average_today_score || 78} 
            size="hero" 
            sublabel="Optimal Range"
          />

          <div className="inline-flex items-center gap-1 text-xs font-extrabold text-[#164B3A] bg-[#DDF3E7] px-3.5 py-1.5 rounded-full">
            <ArrowUpRight className="w-4 h-4" /> ↑ 6 from yesterday
          </div>
        </div>

        {/* Scan Food CTA Card (VISUALLY DOMINANT - Section 3 spec) */}
        <div className="card-forest p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xl">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#DDF3E7] flex items-center justify-center font-black">
              <Camera className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              📷 Scan Food Product
            </h2>
            <p className="text-xs text-[#DDF3E7]/90 leading-relaxed font-medium">
              Scan barcode or nutrition label to instantly decode ingredients, sugar content, and personalized suitability scores.
            </p>
          </div>

          <button
            onClick={() => onNavigate('scan')}
            className="w-full py-4 rounded-[18px] font-extrabold bg-[#DDF3E7] text-[#164B3A] hover:bg-white transition-all shadow-lg text-base flex items-center justify-center gap-2 group"
          >
            <Scan className="w-5 h-5 text-[#164B3A] group-hover:scale-110 transition-transform" />
            Scan Barcode or Label
          </button>
        </div>

      </div>

      {/* 3. FOODLENS AI INSIGHT / HEALTHY NEXT-STEP PLANNER (Section 9 spec) */}
      <div className="card-mint p-6 flex items-start gap-4 shadow-xs">
        <div className="w-10 h-10 rounded-2xl bg-[#164B3A] text-[#DDF3E7] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-black text-[#164B3A] uppercase tracking-wider">
            ✦ FoodLens Intelligence Insight
          </h3>
          <p className="text-sm text-[#17201C] leading-relaxed font-medium">
            {data?.healthy_next_step_insight || "Your current food selections demonstrate balanced macro intake. Consider increasing fiber-rich alternatives for your upcoming meals."}
          </p>
        </div>
      </div>

      {/* 4. ANALYTICS & TREND CHARTS GRID (Section 11 spec) */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Weekly Score Trend Line Chart */}
        <div className="card-fresh p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#17201C] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#164B3A]" /> Weekly Score Trend
            </h3>
            <span className="text-xs font-bold text-[#5A6561]">Past 7 Days</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.weekly_score_trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9E6" />
                <XAxis dataKey="day" stroke="#5A6561" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#5A6561" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#17201C', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="personalized_score" stroke="#164B3A" strokeWidth={3} name="Personalized Score" />
                <Line type="monotone" dataKey="general_score" stroke="#F2B84B" strokeWidth={2} strokeDasharray="4 4" name="General Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Nutrient Intake Bar Chart */}
        <div className="card-fresh p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#17201C] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#164B3A]" /> Sugar & Protein Balance
            </h3>
            <span className="text-xs font-bold text-[#5A6561]">Nutrient Breakdown</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.nutrient_trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9E6" />
                <XAxis dataKey="day" stroke="#5A6561" fontSize={11} tickLine={false} />
                <YAxis stroke="#5A6561" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#17201C', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="sugar" fill="#F2B84B" name="Sugar (g)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="protein" fill="#164B3A" name="Protein (g)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 5. RECENT SCANS LIST (Section 3 spec) */}
      <div className="card-fresh p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-[#17201C]">Recent Scans</h3>
            <p className="text-xs text-[#5A6561] font-semibold">Latest products analyzed for your goal</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-extrabold text-[#164B3A] hover:underline flex items-center gap-1"
          >
            View History <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {data?.recent_scans && data.recent_scans.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recent_scans.map((scan) => {
              const scoreVal = scan.score.personalized_score;
              let scoreBg = 'bg-[#164B3A] text-white';
              if (scoreVal < 50) scoreBg = 'bg-[#E8785D] text-white';
              else if (scoreVal < 75) scoreBg = 'bg-[#F2B84B] text-[#17201C]';

              return (
                <div
                  key={scan.scan_id}
                  onClick={() => onNavigate('product_details', scan)}
                  className="p-4 rounded-[18px] border border-[#E5E9E6] bg-[#F8F8F4] hover:bg-white hover:border-[#164B3A]/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E9E6] flex items-center justify-center shrink-0 overflow-hidden">
                      {scan.product.image_url ? (
                        <img src={scan.product.image_url} alt={scan.product.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <Scan className="w-6 h-6 text-[#5A6561]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase text-[#5A6561]">
                        {scan.scan_method}
                      </span>
                      <h4 className="text-xs font-extrabold text-[#17201C] group-hover:text-[#164B3A] transition-colors truncate">
                        {scan.product.name}
                      </h4>
                      <p className="text-[10px] text-[#5A6561] truncate font-medium">{scan.product.brand}</p>
                    </div>
                  </div>

                  <div className={`w-10 h-10 rounded-xl ${scoreBg} flex items-center justify-center font-black text-sm shrink-0 shadow-xs`}>
                    {scoreVal}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center text-[#5A6561] text-xs space-y-3">
            <Scan className="w-10 h-10 mx-auto text-[#164B3A]/40" />
            <p className="font-bold">No food scans recorded yet today.</p>
            <button
              onClick={() => onNavigate('scan')}
              className="px-5 py-2.5 rounded-[14px] text-xs font-extrabold bg-[#164B3A] text-white hover:bg-[#0F3629]"
            >
              Scan Your First Food Product
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
