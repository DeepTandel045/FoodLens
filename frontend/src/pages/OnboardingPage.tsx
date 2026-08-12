import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

interface OnboardingPageProps {
  onNavigate: (tab: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  const { updateProfile } = useAuth();
  const [dietaryGoal, setDietaryGoal] = useState('diabetes_oriented');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const goalsList = [
    { id: 'general_healthy_eating', title: 'General Healthy Eating', desc: 'Standard balanced dietary guidelines.' },
    { id: 'diabetes_oriented', title: 'Diabetes-Oriented', desc: 'Focus on low glycemic index, low sugar, & high fiber.' },
    { id: 'weight_management', title: 'Weight Management', desc: 'Calorie conscious with optimal protein density.' },
    { id: 'high_protein', title: 'High Protein / Fitness', desc: 'Maximizes protein intake per serving.' },
    { id: 'low_sodium', title: 'Low Sodium', desc: 'Strictly penalizes high sodium content for heart health.' },
  ];

  const commonAllergies = ['Peanuts', 'Gluten', 'Milk', 'Soy', 'Eggs', 'Tree Nuts', 'Shellfish', 'Sesame'];

  const toggleAllergy = (alg: string) => {
    const clean = alg.toLowerCase();
    if (allergies.includes(clean)) {
      setAllergies(allergies.filter(a => a !== clean));
    } else {
      setAllergies([...allergies, clean]);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await updateProfile({
        dietary_goal: dietaryGoal,
        allergies: allergies
      });
      onNavigate('dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#164B3A] text-white flex items-center justify-center font-black mx-auto">
          <Sparkles className="w-6 h-6 text-[#DDF3E7]" />
        </div>
        <h1 className="text-3xl font-black text-[#17201C] tracking-tight">Personalize Your FoodLens Engine</h1>
        <p className="text-xs text-[#5A6561] font-semibold">Select your health goals so our scoring algorithm can tailor product scores for you.</p>
      </div>

      {/* Goal Selection */}
      <div className="card-fresh p-6 space-y-4">
        <h3 className="text-xs font-black text-[#17201C] uppercase tracking-wider">Select Primary Goal</h3>
        <div className="space-y-3">
          {goalsList.map((g) => {
            const isSelected = dietaryGoal === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setDietaryGoal(g.id)}
                className={`w-full p-4 rounded-[16px] text-left transition-all border flex items-center justify-between ${
                  isSelected
                    ? 'border-2 border-[#164B3A] bg-[#DDF3E7]/40 text-[#17201C]'
                    : 'border-[#E5E9E6] bg-[#F8F8F4] text-[#5A6561] hover:text-[#17201C]'
                }`}
              >
                <div>
                  <h4 className="font-extrabold text-sm text-[#17201C]">{g.title}</h4>
                  <p className="text-xs text-[#5A6561] font-medium">{g.desc}</p>
                </div>
                {isSelected && <Check className="w-5 h-5 text-[#164B3A]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Allergies Selection */}
      <div className="card-fresh p-6 space-y-4">
        <h3 className="text-xs font-black text-[#17201C] uppercase tracking-wider">Allergens to Exclude</h3>
        <div className="flex flex-wrap gap-2">
          {commonAllergies.map((alg) => {
            const clean = alg.toLowerCase();
            const isSelected = allergies.includes(clean);
            return (
              <button
                key={alg}
                onClick={() => toggleAllergy(alg)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                  isSelected
                    ? 'bg-[#FEF2F2] border border-[#E8785D] text-[#E8785D]'
                    : 'bg-[#F8F8F4] border border-[#E5E9E6] text-[#5A6561]'
                }`}
              >
                {alg}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleFinish}
        disabled={loading}
        className="w-full py-4 rounded-[18px] font-extrabold bg-[#164B3A] text-white hover:bg-[#0F3629] transition-all text-sm flex items-center justify-center gap-2 shadow-lg"
      >
        {loading ? 'Setting up Profile...' : 'Complete & Launch Dashboard'} <ArrowRight className="w-4 h-4 text-[#DDF3E7]" />
      </button>

    </div>
  );
};
