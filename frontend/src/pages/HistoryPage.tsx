import React, { useEffect, useState } from 'react';
import { historyService } from '../services/api';
import type { ScanResult } from '../types';
import { ScoreBadge } from '../components/ScoreBadge';
import { History as HistoryIcon, Search, Calendar, ChevronRight } from 'lucide-react';

interface HistoryPageProps {
  onNavigate: (tab: string, data?: any) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    historyService.getHistory()
      .then(setScans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredScans = scans.filter(s => 
    s.product.name.toLowerCase().includes(search.toLowerCase()) ||
    s.product.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Scan History</h1>
          <p className="text-slate-400 text-sm">Chronological log of your food product scans and suitability scores</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading scan history...</div>
      ) : filteredScans.length > 0 ? (
        <div className="space-y-4">
          {filteredScans.map((scan) => (
            <div
              key={scan.scan_id}
              onClick={() => onNavigate('product_details', scan)}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                    {scan.scan_method}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(scan.scanned_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                  {scan.product.name}
                </h3>
                <p className="text-xs text-slate-400">{scan.product.brand}</p>
              </div>

              <div className="flex items-center gap-4">
                <ScoreBadge score={scan.score.personalized_score} size="sm" />
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
          <HistoryIcon className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-slate-400 text-sm">No food scan history found matching your query.</p>
        </div>
      )}

    </div>
  );
};
