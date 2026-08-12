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
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header */}
      <div className="card-fresh p-6 sm:p-8 flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-[#164B3A] text-[#DDF3E7] font-black text-2xl flex items-center justify-center shadow-md shrink-0">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#17201C] tracking-tight">{user?.name}</h1>
          <p className="text-xs text-[#5A6561] font-semibold">{user?.email}</p>
          <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#DDF3E7] text-[#164B3A] border border-[#164B3A]/20">
            Active Goal: {dietaryGoal.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Health Goal Setting */}
      <div className="card-fresh p-6 space-y-4">
        <h3 className="text-sm font-black text-[#17201C] uppercase tracking-wider flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-[#164B3A]" /> Primary Dietary / Health Goal
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {goalsList.map((g) => {
            const isSelected = dietaryGoal === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setDietaryGoal(g.id)}
                className={`p-3.5 rounded-[16px] text-xs font-extrabold text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#164B3A] text-white shadow-xs'
                    : 'bg-[#F8F8F4] border border-[#E5E9E6] text-[#5A6561] hover:text-[#17201C]'
                }`}
              >
                {g.title}
                {isSelected && <Check className="w-4 h-4 text-[#DDF3E7]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Allergies Setting */}
      <div className="card-fresh p-6 space-y-4">
        <h3 className="text-sm font-black text-[#17201C] uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#E8785D]" /> Flagged Allergens
        </h3>
        <div className="flex flex-wrap gap-2">
          {commonAllergies.map((alg) => {
            const clean = alg.toLowerCase();
            const isSelected = selectedAllergies.includes(clean);
            return (
              <button
                key={alg}
                onClick={() => toggleAllergy(alg)}
                className={`px-3.5 py-2 rounded-full text-xs font-extrabold transition-all ${
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

      {/* Save CTA */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-3.5 rounded-[18px] font-extrabold text-xs flex items-center gap-2 transition-all shadow-md ${
            saved
              ? 'bg-[#164B3A] text-white'
              : 'bg-[#164B3A] text-white hover:bg-[#0F3629]'
          }`}
        >
          <Save className="w-4 h-4 text-[#DDF3E7]" />
          {saved ? 'Settings Saved!' : loading ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </div>

    </div>
  );
};
