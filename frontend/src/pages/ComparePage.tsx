import React, { useEffect, useState } from 'react';
import { productService, historyService } from '../services/api';
import type { Product, ScanResult } from '../types';
import { ScoreBadge } from '../components/ScoreBadge';
import { GitCompare, Trophy, Check } from 'lucide-react';

interface ComparePageProps {
  onNavigate?: (tab: string, data?: any) => void;
}

export const ComparePage: React.FC<ComparePageProps> = () => {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [comparisonData, setComparisonData] = useState<any | null>(null);

  useEffect(() => {
    historyService.getHistory().then((data) => {
      setHistory(data);
      if (data.length >= 2) {
        setSelectedIds([data[0].product.id, data[1].product.id]);
      }
    });
  }, []);

  const handleRunComparison = async (ids: number[]) => {
    if (ids.length < 2) return;
    try {
      const res = await productService.compareProducts(ids);
      setComparisonData(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedIds.length >= 2) {
      handleRunComparison(selectedIds);
    }
  }, [selectedIds]);

  const toggleSelectProduct = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-teal-500/10 text-teal-400 mb-2">
          <GitCompare className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Product Comparison Matrix</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Compare up to 4 food products side-by-side to evaluate calories, sugar, protein, sodium, and personalized suitability scores.
        </p>
      </div>

      {/* Product Selector Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Scanned Products to Compare</h3>
        
        {history.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {history.map((scan) => {
              const isSelected = selectedIds.includes(scan.product.id);
              return (
                <button
                  key={scan.scan_id}
                  onClick={() => toggleSelectProduct(scan.product.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'border-teal-500 bg-teal-500/20 text-teal-300 shadow-lg shadow-teal-500/10'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {scan.product.name}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500">Scan at least 2 food products to compare them!</p>
        )}
      </div>

      {/* Winner Summary Banner */}
      {comparisonData && (
        <div className="glass-panel-glow p-6 rounded-3xl border border-teal-500/40 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 shrink-0">
            <Trophy className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-200 leading-relaxed">
            {comparisonData.comparison_summary}
          </p>
        </div>
      )}

      {/* Comparison Grid */}
      {comparisonData && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {comparisonData.products.map((prod: Product, idx: number) => {
            const score = comparisonData.scores[idx];
            const isWinner = comparisonData.winner_product_id === prod.id;
            return (
              <div
                key={prod.id}
                className={`glass-panel p-6 rounded-3xl border space-y-4 relative ${
                  isWinner ? 'border-teal-500 bg-teal-500/10' : 'border-slate-800'
                }`}
              >
                {isWinner && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-teal-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-teal-500/20">
                    <Trophy className="w-3 h-3" /> Best Choice
                  </span>
                )}

                <div className="space-y-1 text-center pt-2">
                  <h4 className="font-bold text-white text-base line-clamp-1">{prod.name}</h4>
                  <p className="text-xs text-slate-400">{prod.brand}</p>
                </div>

                <div className="flex justify-center">
                  <ScoreBadge score={score.personalized_score} size="md" />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-400">Calories</span>
                    <span className="font-mono text-white font-bold">{prod.nutrition?.energy_kcal ?? 'N/A'} kcal</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-400">Sugars</span>
                    <span className="font-mono text-amber-400 font-bold">{prod.nutrition?.sugars_g ?? 'N/A'} g</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/50">
                    <span className="text-slate-400">Protein</span>
                    <span className="font-mono text-emerald-400 font-bold">{prod.nutrition?.protein_g ?? 'N/A'} g</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Sodium</span>
                    <span className="font-mono text-teal-400 font-bold">{prod.nutrition?.sodium_mg ?? 'N/A'} mg</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
