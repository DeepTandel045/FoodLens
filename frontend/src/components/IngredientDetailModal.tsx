import React from 'react';
import { X, Info, ShieldCheck, AlertTriangle } from 'lucide-react';

export interface IngredientDetail {
  name: string;
  code?: string;
  category: string;
  description: string;
  purpose: string;
  profileImpact: string;
  isConcern?: boolean;
}

interface IngredientDetailModalProps {
  ingredient: IngredientDetail | null;
  onClose: () => void;
}

export const IngredientDetailModal: React.FC<IngredientDetailModalProps> = ({ ingredient, onClose }) => {
  if (!ingredient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-white rounded-[24px] border border-[#E5E9E6] p-6 shadow-2xl space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#5A6561] hover:bg-[#F8F8F4] hover:text-[#17201C] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDF3E7] text-[#164B3A]">
              {ingredient.code || 'INGREDIENT'}
            </span>
            <span className="text-xs font-semibold text-[#5A6561]">{ingredient.category}</span>
          </div>
          <h2 className="text-2xl font-black text-[#17201C] tracking-tight">{ingredient.name}</h2>
        </div>

        {/* Structured Intelligence Cards */}
        <div className="space-y-4">
          
          {/* What is it? */}
          <div className="p-4 rounded-[18px] bg-[#F8F8F4] border border-[#E2E7E3] space-y-1">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#164B3A] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#164B3A]" /> What is it?
            </h4>
            <p className="text-sm text-[#17201C] leading-relaxed font-medium">
              {ingredient.description}
            </p>
          </div>

          {/* Why is it here? */}
          <div className="p-4 rounded-[18px] bg-[#F8F8F4] border border-[#E2E7E3] space-y-1">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#164B3A]">
              Why is it here?
            </h4>
            <p className="text-sm text-[#17201C] leading-relaxed font-medium">
              {ingredient.purpose}
            </p>
          </div>

          {/* For your profile */}
          <div className={`p-4 rounded-[18px] border space-y-1 ${
            ingredient.isConcern 
              ? 'bg-[#FEF2F2] border-[#E8785D]/30 text-[#17201C]' 
              : 'bg-[#DDF3E7]/60 border-[#164B3A]/20 text-[#17201C]'
          }`}>
            <h4 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              {ingredient.isConcern ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-[#E8785D]" />
                  <span className="text-[#E8785D]">For Your Goal Profile</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#164B3A]" />
                  <span className="text-[#164B3A]">For Your Goal Profile</span>
                </>
              )}
            </h4>
            <p className="text-sm leading-relaxed font-medium">
              {ingredient.profileImpact}
            </p>
          </div>

        </div>

        {/* Bottom CTA */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-[18px] font-extrabold bg-[#164B3A] text-white hover:bg-[#0F3629] transition-all shadow-md text-sm"
        >
          Got it
        </button>

      </div>
    </div>
  );
};
