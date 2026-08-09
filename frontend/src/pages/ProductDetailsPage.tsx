import React, { useEffect, useState } from 'react';
import type { ScanResult, Product } from '../types';
import { ScoreBadge } from '../components/ScoreBadge';
import { productService, basketService } from '../services/api';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShoppingBag, 
  GitCompare, 
  ArrowLeft, 
  Package
} from 'lucide-react';

interface ProductDetailsPageProps {
  scanResult: ScanResult;
  onNavigate: (tab: string, data?: any) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ scanResult, onNavigate }) => {
  const { product, score } = scanResult;
  const [alternatives, setAlternatives] = useState<Product[]>([]);
  const [addedToBasket, setAddedToBasket] = useState(false);

  useEffect(() => {
    if (product.id) {
      productService.getAlternatives(product.id)
        .then(setAlternatives)
        .catch(console.error);
    }
  }, [product.id]);

  const handleAddToBasket = async () => {
    try {
      await basketService.addItem(product.id, 1);
      setAddedToBasket(true);
      setTimeout(() => setAddedToBasket(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      
      {/* Navigation Top */}
      <button
        onClick={() => onNavigate('scan')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Scanner
      </button>

      {/* Main Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-2" />
            ) : (
              <Package className="w-12 h-12 text-slate-600" />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {product.brand}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Source: {product.data_source}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{product.name}</h1>
            <p className="text-xs text-slate-400">Category: {product.category}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={handleAddToBasket}
            className={`flex-1 md:flex-none px-5 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              addedToBasket
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {addedToBasket ? 'Added to Basket!' : 'Add to Basket'}
          </button>

          <button
            onClick={() => onNavigate('compare')}
            className="flex-1 md:flex-none px-5 py-3 rounded-2xl font-bold text-sm glass-panel border border-slate-700 text-white hover:bg-slate-800 flex items-center justify-center gap-2"
          >
            <GitCompare className="w-4 h-4 text-teal-400" /> Compare
          </button>
        </div>
      </div>

      {/* Dual Score Section */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* General Score */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">General Nutritional Quality</h3>
          <ScoreBadge score={score.general_score} label="General FoodLens Score" size="lg" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Based on standard Nutri-Score & WHO nutrient profiling formulas.
          </p>
        </div>

        {/* Personalized Score */}
        <div className="glass-panel-glow p-6 rounded-3xl border border-emerald-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Goal Suitability</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              {score.goal_type.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <ScoreBadge score={score.personalized_score} label="Personalized Score" size="lg" />
          <p className="text-xs text-slate-300 leading-relaxed">
            Customized directly for your health goal profile & allergy exclusions.
          </p>
        </div>

      </div>

      {/* AI Plain-English Explanation */}
      {score.ai_explanation && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Sparkles className="w-5 h-5" /> FoodLens AI Explanation
          </div>
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
            {score.ai_explanation}
          </p>
        </div>
      )}

      {/* Factors & Breakdown Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Positive Factors */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Positive Factors
          </h3>
          <div className="space-y-2">
            {score.breakdown.positive.length > 0 ? (
              score.breakdown.positive.map((pos, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-slate-200">
                  <span className="font-semibold">{pos.factor}</span>
                  <span className="text-emerald-400 font-mono">{pos.detail}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No major positive factors identified.</p>
            )}
          </div>
        </div>

        {/* Negative Factors & Goal Warnings */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Negative Factors & Goal Alerts
          </h3>
          <div className="space-y-2">
            {score.breakdown.goal_warnings.map((warn, idx) => (
              <div key={`w-${idx}`} className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">{warn.factor}</strong>
                  <span>{warn.detail}</span>
                </div>
              </div>
            ))}
            {score.breakdown.negative.map((neg, idx) => (
              <div key={`n-${idx}`} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-slate-200">
                <span className="font-semibold">{neg.factor}</span>
                <span className="text-amber-400 font-mono">{neg.detail}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Nutrition Facts Table */}
      {product.nutrition && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Nutrition Facts (per 100g / 100ml)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block uppercase">Energy</span>
              <strong className="text-lg text-white font-mono">{product.nutrition.energy_kcal ?? 'N/A'} kcal</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block uppercase">Sugars</span>
              <strong className="text-lg text-amber-400 font-mono">{product.nutrition.sugars_g ?? 'N/A'} g</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block uppercase">Protein</span>
              <strong className="text-lg text-emerald-400 font-mono">{product.nutrition.protein_g ?? 'N/A'} g</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block uppercase">Sodium</span>
              <strong className="text-lg text-teal-400 font-mono">{product.nutrition.sodium_mg ?? 'N/A'} mg</strong>
            </div>
          </div>
        </div>
      )}

      {/* Healthier Alternatives Recommendations */}
      {alternatives.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" /> Recommended Healthier Alternatives
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {alternatives.map((alt) => (
              <div key={alt.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
                <h4 className="text-sm font-bold text-white">{alt.name}</h4>
                <p className="text-xs text-slate-400">{alt.brand}</p>
                <p className="text-xs text-emerald-400 font-semibold">Sugar: {alt.nutrition?.sugars_g ?? 0}g</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
