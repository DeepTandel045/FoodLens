import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/api';
import type { DashboardData } from '../types';
import { ScoreBadge } from '../components/ScoreBadge';
import { 
  Scan, 
  TrendingUp, 
  Sparkles, 
  Activity,
  ChevronRight
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
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading your FoodLens Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      
      {/* Top Banner Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-xs border border-emerald-500/20">
            <Activity className="w-3.5 h-3.5" /> Goal Profile: {data?.dietary_goal}
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, <span className="gradient-text">{data?.user_name}</span>!
          </h1>
          <p className="text-slate-400 text-sm">
            You scanned <strong className="text-white">{data?.today_scans_count} products</strong> today. Your current average suitability score is maintaining a solid level.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shrink-0">
          <ScoreBadge score={data?.average_today_score || 78} label="Today's Average Score" size="md" />
          <button
            onClick={() => onNavigate('scan')}
            className="px-5 py-3 rounded-xl font-bold bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all flex items-center gap-2 text-sm"
          >
            <Scan className="w-4 h-4" /> Scan Food
          </button>
        </div>
      </div>

      {/* Healthy Next-Step Planner Banner */}
      <div className="glass-panel-glow p-6 rounded-3xl border border-emerald-500/30 flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
            Healthy Next-Step Planner
          </h3>
          <p className="text-slate-200 text-sm leading-relaxed">
            {data?.healthy_next_step_insight}
          </p>
        </div>
      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Weekly Score Trend Line Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Weekly Score Trend
            </h3>
            <span className="text-xs text-slate-400">Past 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.weekly_score_trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="personalized_score" stroke="#10b981" strokeWidth={3} name="Personalized Score" />
                <Line type="monotone" dataKey="general_score" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" name="General Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Nutrient Intake Distribution Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" /> Daily Sugar & Sodium Levels
            </h3>
            <span className="text-xs text-slate-400">Nutrient Intake</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.nutrient_trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="sugar" fill="#f59e0b" name="Sugar (g)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="protein" fill="#3b82f6" name="Protein (g)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Scans Section */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Food Scans</h3>
            <p className="text-xs text-slate-400">Products recently analyzed for your profile</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
          >
            View Full History <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {data?.recent_scans && data.recent_scans.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recent_scans.map((scan) => (
              <div
                key={scan.scan_id}
                onClick={() => onNavigate('product_details', scan)}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/30 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                    {scan.scan_method}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {scan.product.name}
                  </h4>
                  <p className="text-xs text-slate-400">{scan.product.brand}</p>
                </div>
                <ScoreBadge score={scan.score.personalized_score} size="sm" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-sm space-y-3">
            <Scan className="w-10 h-10 mx-auto text-slate-600" />
            <p>No scans recorded yet today.</p>
            <button
              onClick={() => onNavigate('scan')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950"
            >
              Scan Your First Food Product
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
