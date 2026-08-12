import React from 'react';
import { CircularScoreRing } from './CircularScoreRing';

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  goalBadge?: string;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ 
  score, 
  label = 'FoodLens Score', 
  size = 'md',
  goalBadge,
}) => {
  return (
    <CircularScoreRing 
      score={score} 
      label={label} 
      size={size} 
      goalBadge={goalBadge} 
    />
  );
};
