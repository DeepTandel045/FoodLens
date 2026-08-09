import { ShieldCheck } from 'lucide-react';

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ 
  score, 
  label = 'Score', 
  size = 'md',
}) => {
  // Determine gradient color based on score value
  let gradientClass = 'score-gradient-high text-slate-950 shadow-emerald-500/20';
  let borderClass = 'border-emerald-500/40 text-emerald-400';
  let categoryLabel = 'Excellent Choice';

  if (score < 55) {
    gradientClass = 'score-gradient-low text-white shadow-red-500/20';
    borderClass = 'border-red-500/40 text-red-400';
    categoryLabel = 'Exercise Caution';
  } else if (score < 75) {
    gradientClass = 'score-gradient-medium text-slate-950 shadow-amber-500/20';
    borderClass = 'border-amber-500/40 text-amber-400';
    categoryLabel = 'Moderate Quality';
  }

  const dimensions = {
    sm: { badge: 'w-10 h-10 text-sm font-bold', container: 'gap-2' },
    md: { badge: 'w-16 h-16 text-xl font-extrabold', container: 'gap-3' },
    lg: { badge: 'w-24 h-24 text-3xl font-black', container: 'gap-4' },
  }[size];

  return (
    <div className={`flex items-center ${dimensions.container}`}>
      <div className={`${dimensions.badge} ${gradientClass} rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105`}>
        {score}
      </div>
      <div>
        <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider block">
          {label}
        </span>
        <div className={`text-xs font-semibold px-2 py-0.5 mt-0.5 rounded-full inline-flex items-center gap-1 border ${borderClass} bg-slate-900/60`}>
          <ShieldCheck className="w-3 h-3" />
          {categoryLabel}
        </div>
      </div>
    </div>
  );
};
