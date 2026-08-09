import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Check, ArrowRight } from 'lucide-react';

interface OnboardingPageProps {
  onNavigate: (tab: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  const { user, updateProfile } = useAuth();
  const [dietaryGoal, setDietaryGoal] = useState('general_healthy_eating');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedPrefs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const goalsList = [
    { id: 'general_healthy_eating', title: 'General Healthy Eating', desc: 'Balanced nutrition analysis across all food groups' },
    { id: 'diabetes_oriented', title: 'Diabetes-Oriented', desc: 'Focus on low-glycemic foods, low sugar, and fiber balance' },
    { id: 'weight_management', title: 'Weight Management', desc: 'Caloric density control, low sugar, and satiety metrics' },
    { id: 'high_protein', title: 'High Protein / Fitness', desc: 'Muscle building emphasis and high protein density' },
    { id: 'low_sodium', title: 'Low Sodium / Blood Pressure', desc: 'Sodium caps and salt warning indicators' },
    { id: 'heart_conscious', title: 'Heart Conscious', desc: 'Saturated & trans-fat reduction' },
    { id: 'vegetarian', title: 'Vegetarian', desc: 'Exclude meat, poultry, fish, and animal gelatin' },
    { id: 'vegan', title: 'Vegan', desc: 'Exclude all animal products including dairy & eggs' },
  ];

  const commonAllergies = ['Peanuts', 'Gluten / Wheat', 'Milk / Dairy', 'Soy', 'Eggs', 'Tree Nuts', 'Shellfish', 'Sesame'];

  const toggleAllergy = (allergen: string) => {
    const clean = allergen.split('/')[0].trim().toLowerCase();
    if (selectedAllergies.includes(clean)) {
      setSelectedAllergies(selectedAllergies.filter(a => a !== clean));
    } else {
      setSelectedAllergies([...selectedAllergies, clean]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateProfile({
        dietary_goal: dietaryGoal,
        allergies: selectedAllergies,
        preferences: selectedPrefs
      });
      onNavigate('dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">
          Personalize Your <span className="gradient-text">FoodLens Profile</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Welcome {user?.name || ''}! Select your primary nutritional goals and allergy restrictions so FoodLens can calculate tailored suitability scores.
        </p>
      </div>

      {/* Step 1: Select Primary Goal */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">1</div>
          <div>
            <h3 className="text-lg font-bold text-white">Choose Your Primary Health / Dietary Goal</h3>
            <p className="text-xs text-slate-400">Scores will dynamically weight nutritional factors against this goal</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {goalsList.map((g) => {
            const isSelected = dietaryGoal === g.id;
            return (
              <div
                key={g.id}
                onClick={() => setDietaryGoal(g.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className={`font-bold text-sm ${isSelected ? 'text-emerald-400' : 'text-white'}`}>{g.title}</h4>
                  {isSelected && <Check className="w-5 h-5 text-emerald-400 shrink-0" />}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{g.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Select Allergens */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 font-bold">2</div>
          <div>
            <h3 className="text-lg font-bold text-white">Select Any Known Allergies or Exclusions</h3>
            <p className="text-xs text-slate-400">Products containing selected allergens will trigger critical score penalties</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {commonAllergies.map((alg) => {
            const clean = alg.split('/')[0].trim().toLowerCase();
            const isSelected = selectedAllergies.includes(clean);
            return (
              <button
                key={alg}
                onClick={() => toggleAllergy(alg)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'border-red-500 bg-red-500/20 text-red-300 shadow-lg shadow-red-500/10'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                {alg}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all flex items-center gap-2 text-base"
        >
          {loading ? 'Saving Profile...' : 'Complete Onboarding & Go to Dashboard'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
