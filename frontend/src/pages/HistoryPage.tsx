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
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#17201C] tracking-tight">Scan History</h1>
          <p className="text-[#5A6561] text-xs font-semibold">Chronological record of your scanned products</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#5A6561] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-white border border-[#E5E9E6] text-[#17201C] text-xs placeholder-[#5A6561] focus:outline-none focus:border-[#164B3A]"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[#5A6561] text-xs font-bold">Loading scan history...</div>
      ) : filteredScans.length > 0 ? (
        <div className="space-y-3">
          {filteredScans.map((scan) => (
            <div
              key={scan.scan_id}
              onClick={() => onNavigate('product_details', scan)}
              className="card-fresh p-5 hover:border-[#164B3A]/40 transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-[#DDF3E7] text-[#164B3A]">
                    {scan.scan_method}
                  </span>
                  <span className="text-xs text-[#5A6561] font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#164B3A]" /> {new Date(scan.scanned_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-extrabold text-[#17201C] text-base group-hover:text-[#164B3A] transition-colors">
                  {scan.product.name}
                </h3>
                <p className="text-xs text-[#5A6561] font-medium">{scan.product.brand}</p>
              </div>

              <div className="flex items-center gap-4">
                <ScoreBadge score={scan.score.personalized_score} size="sm" />
                <ChevronRight className="w-5 h-5 text-[#5A6561] group-hover:text-[#164B3A] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-fresh p-12 text-center space-y-3">
          <HistoryIcon className="w-10 h-10 mx-auto text-[#164B3A]/30" />
          <p className="text-[#5A6561] text-xs font-bold">No food scan history found matching your query.</p>
        </div>
      )}

    </div>
  );
};
