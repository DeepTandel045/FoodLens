import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, HeartPulse, Check, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [dietaryGoal, setDietaryGoal] = useState(user?.dietary_goal || 'general_healthy_eating');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(user?.allergies || []);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const goalsList = [
    { id: 'general_healthy_eating', title: 'General Healthy Eating' },
    { id: 'diabetes_oriented', title: 'Diabetes-Oriented' },
    { id: 'weight_management', title: 'Weight Management' },
    { id: 'high_protein', title: 'High Protein / Fitness' },
    { id: 'low_sodium', title: 'Low Sodium' },
    { id: 'heart_conscious', title: 'Heart Conscious' },
    { id: 'vegetarian', title: 'Vegetarian' },
    { id: 'vegan', title: 'Vegan' },
  ];

  const commonAllergies = ['Peanuts', 'Gluten', 'Milk', 'Soy', 'Eggs', 'Tree Nuts', 'Shellfish', 'Sesame'];

  const toggleAllergy = (alg: string) => {
    const clean = alg.toLowerCase();
    if (selectedAllergies.includes(clean)) {
      setSelectedAllergies(selectedAllergies.filter(a => a !== clean));
    } else {
      setSelectedAllergies([...selectedAllergies, clean]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        dietary_goal: dietaryGoal,
        allergies: selectedAllergies
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold text-2xl flex items-center justify-center border border-emerald-500/30">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
          <p className="text-xs text-slate-400">{user?.email}</p>
          <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Goal: {dietaryGoal.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Health Goal Setting */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-emerald-400" /> Primary Health / Dietary Goal
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {goalsList.map((g) => {
            const isSelected = dietaryGoal === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setDietaryGoal(g.id)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                {g.title}
                {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Allergies Setting */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" /> Flagged Allergens
        </h3>
        <div className="flex flex-wrap gap-2">
          {commonAllergies.map((alg) => {
            const clean = alg.toLowerCase();
            const isSelected = selectedAllergies.includes(clean);
            return (
              <button
                key={alg}
                onClick={() => toggleAllergy(alg)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'border-red-500 bg-red-500/20 text-red-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400'
                }`}
              >
                {alg}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save CTA */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
            saved
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Settings Saved!' : loading ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </div>

    </div>
  );
};
