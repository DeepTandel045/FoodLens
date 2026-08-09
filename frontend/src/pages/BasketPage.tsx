import React, { useEffect, useState } from 'react';
import { basketService } from '../services/api';
import type { BasketAnalysis } from '../types';
import { ScoreBadge } from '../components/ScoreBadge';
import { ShoppingBag, Trash2, ShieldAlert, Sparkles } from 'lucide-react';

interface BasketPageProps {
  onNavigate: (tab: string, data?: any) => void;
}

export const BasketPage: React.FC<BasketPageProps> = ({ onNavigate }) => {
  const [basket, setBasket] = useState<BasketAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBasket = () => {
    basketService.getBasket()
      .then(setBasket)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBasket();
  }, []);

  const handleRemove = async (itemId: number) => {
    try {
      await basketService.removeItem(itemId);
      fetchBasket();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-2">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Virtual Shopping Basket Analysis</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Evaluate aggregate nutritional load and average suitability scores across your planned grocery items.
        </p>
      </div>

      {basket && basket.items.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Basket Items List */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-white">Basket Products ({basket.item_count})</h3>
            
            {basket.items.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-base">{item.product.name}</h4>
                  <p className="text-xs text-slate-400">{item.product.brand}</p>
                  <p className="text-xs text-emerald-400 font-mono">
                    Sugar: {item.product.nutrition?.sugars_g ?? 0}g | Sodium: {item.product.nutrition?.sodium_mg ?? 0}mg
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-900 text-slate-300 border border-slate-800">
                    Qty: {item.quantity}
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Aggregate Nutrition & Score Panel */}
          <div className="space-y-6">
            
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Average Basket Score</h3>
              <ScoreBadge score={basket.average_personalized_score} label="Average Suitability" size="lg" />
            </div>

            {/* Warnings */}
            {basket.basket_warnings.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <ShieldAlert className="w-4 h-4" /> Basket Concerns
                </div>
                {basket.basket_warnings.map((w, idx) => (
                  <p key={idx}>• {w}</p>
                ))}
              </div>
            )}

            {/* AI Basket Recommendation */}
            <div className="glass-panel-glow p-5 rounded-2xl border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" /> FoodLens Recommendation
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {basket.ai_basket_recommendation}
              </p>
            </div>

          </div>

        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-white">Your Shopping Basket is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Scan food products and click "Add to Basket" on product detail pages to aggregate your nutritional intake!
          </p>
          <button
            onClick={() => onNavigate('scan')}
            className="px-6 py-3 rounded-xl font-bold bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
          >
            Scan Food Products Now
          </button>
        </div>
      )}

    </div>
  );
};
