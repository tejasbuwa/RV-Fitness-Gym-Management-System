import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Utensils, Plus, Trash2, CheckCircle2, Clock, Flame, User } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function DietManager() {
  const [searchParams] = useSearchParams();
  const initialMemberId = searchParams.get('memberId') || '';

  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(initialMemberId);
  const [currentDiet, setCurrentDiet] = useState(null);
  const [meals, setMeals] = useState([]);

  // Diet Form
  const [dietForm, setDietForm] = useState({
    title: 'High-Protein Lean Muscle Plan',
    targetCalories: 2400,
    dailyProteinG: 150,
    dailyCarbsG: 250,
    dailyFatG: 60,
    notes: 'Drink 3.5 liters of clean water daily. Avoid carbonated sodas.',
    meals: [
      { mealName: 'Breakfast', timing: '07:30 AM', foodItems: '4 Boiled Egg Whites + 2 Whole Eggs + Rolled Oats with Milk', quantity: '1 Plate', calories: 520, proteinG: 32, notes: 'Albumin & complex carbs' },
      { mealName: 'Mid-Morning', timing: '10:30 AM', foodItems: '1 Banana + 1 scoop Whey Protein with Water', quantity: '1 Shake', calories: 240, proteinG: 26, notes: 'Glycogen & amino acids' },
      { mealName: 'Lunch', timing: '01:30 PM', foodItems: '150g Grilled Chicken Breast or Paneer Bhurji + 2 Rotis + Dal', quantity: '1 Thali', calories: 650, proteinG: 45, notes: 'Balanced meal' },
      { mealName: 'Pre-Workout Snack', timing: '05:00 PM', foodItems: '2 Slices Brown Bread with Peanut Butter + Black Coffee', quantity: '2 Toast', calories: 260, proteinG: 10, notes: '45 mins before gym' },
      { mealName: 'Dinner', timing: '08:30 PM', foodItems: 'Brown Rice + Fish Curry or Soya Chunks + Salad', quantity: '1 Bowl', calories: 550, proteinG: 38, notes: 'Night muscle recovery' }
    ]
  });

  const { success, error } = useNotification();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMemberId) {
      fetchMemberDiet(selectedMemberId);
    }
  }, [selectedMemberId]);

  const fetchMembers = () => {
    api.get('/members')
      .then((res) => {
        if (res.data.success) {
          setMembers(res.data.members);
          if (!selectedMemberId && res.data.members.length > 0) {
            setSelectedMemberId(res.data.members[0].id);
          }
        }
      })
      .catch(() => {});
  };

  const fetchMemberDiet = (memberId) => {
    api.get(`/diets/member/${memberId}`)
      .then((res) => {
        if (res.data.success) {
          setCurrentDiet(res.data.dietPlan);
          setMeals(res.data.meals || []);
        }
      })
      .catch(() => {});
  };

  const handleAddMealRow = () => {
    setDietForm({
      ...dietForm,
      meals: [
        ...dietForm.meals,
        { mealName: 'Snack', timing: '04:00 PM', foodItems: '', quantity: '1 portion', calories: 200, proteinG: 15, notes: '' }
      ]
    });
  };

  const handleUpdateMeal = (index, field, val) => {
    const updated = [...dietForm.meals];
    updated[index][field] = val;
    setDietForm({ ...dietForm, meals: updated });
  };

  const handleRemoveMeal = (index) => {
    const updated = dietForm.meals.filter((_, idx) => idx !== index);
    setDietForm({ ...dietForm, meals: updated });
  };

  const handleSaveDiet = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) {
      error('Please select a member.');
      return;
    }

    try {
      const res = await api.post('/diets', {
        memberId: parseInt(selectedMemberId, 10),
        ...dietForm
      });
      if (res.data.success) {
        success('Diet and nutrition schedule assigned successfully!');
        fetchMemberDiet(selectedMemberId);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save diet plan.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">Diet & Nutrition Plan Builder</h2>
        <p className="text-xs text-slate-400">Prescribe structured daily meal routines, calorie targets and macro distributions.</p>
      </div>

      {/* Select Client Card */}
      <div className="p-5 rounded-2xl bg-dark-850 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <User className="w-5 h-5 text-brand-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Select Client:</span>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs font-semibold focus:border-brand-500 focus:outline-none"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name} ({m.member_code})
              </option>
            ))}
          </select>
        </div>

        {currentDiet && (
          <div className="text-xs text-slate-400">
            Currently Assigned: <strong className="text-emerald-400">{currentDiet.title} ({currentDiet.target_calories} kcal)</strong>
          </div>
        )}
      </div>

      {/* Currently Active Diet Preview */}
      {currentDiet && (
        <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                Active Client Nutrition Plan
              </span>
              <h3 className="text-lg font-black text-white mt-1">{currentDiet.title}</h3>
              <p className="text-xs text-slate-400">Target Calories: {currentDiet.target_calories} kcal</p>
            </div>
            <span className="text-xs text-slate-500">Coach: {currentDiet.trainer_name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meals.map((m) => (
              <div key={m.id} className="p-4 rounded-xl bg-dark-800 border border-slate-750 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">{m.meal_name}</span>
                  <span className="text-slate-400 text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{m.timing}</span>
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{m.food_items}</h4>
                <div className="flex justify-between text-slate-300 font-mono text-[11px] pt-1 border-t border-slate-700/60">
                  <span>Portion: {m.quantity}</span>
                  <span>{m.calories} kcal</span>
                </div>
                {m.notes && <p className="text-[11px] text-slate-400 italic">"{m.notes}"</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diet Plan Builder Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-dark-850 border border-slate-800 space-y-6">
        <div>
          <h3 className="text-lg font-black text-white">Create New Nutrition Schedule</h3>
          <p className="text-xs text-slate-400">Calculated portions to complement strength and cardio sessions.</p>
        </div>

        <form onSubmit={handleSaveDiet} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Plan Title *</label>
              <input
                type="text"
                required
                value={dietForm.title}
                onChange={(e) => setDietForm({ ...dietForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Calories (kcal)</label>
              <input
                type="number"
                value={dietForm.targetCalories}
                onChange={(e) => setDietForm({ ...dietForm, targetCalories: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Protein (g)</label>
              <input
                type="number"
                value={dietForm.dailyProteinG}
                onChange={(e) => setDietForm({ ...dietForm, dailyProteinG: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hydration & Supplement Advice</label>
            <input
              type="text"
              value={dietForm.notes}
              onChange={(e) => setDietForm({ ...dietForm, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
            />
          </div>

          {/* Meals Table / Rows */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-white uppercase tracking-wider">Meal Schedule ({dietForm.meals.length})</label>
              <button
                type="button"
                onClick={handleAddMealRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Meal</span>
              </button>
            </div>

            <div className="space-y-3">
              {dietForm.meals.map((meal, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-dark-800 border border-slate-750 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Meal Name"
                      value={meal.mealName}
                      onChange={(e) => handleUpdateMeal(idx, 'mealName', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Timing (08:00 AM)"
                      value={meal.timing}
                      onChange={(e) => handleUpdateMeal(idx, 'timing', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      required
                      placeholder="Food Items Description"
                      value={meal.foodItems}
                      onChange={(e) => handleUpdateMeal(idx, 'foodItems', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Calories"
                      value={meal.calories}
                      onChange={(e) => handleUpdateMeal(idx, 'calories', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs text-center font-mono"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="number"
                      placeholder="Pro (g)"
                      value={meal.proteinG}
                      onChange={(e) => handleUpdateMeal(idx, 'proteinG', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs text-center font-mono"
                    />
                  </div>
                  <div className="sm:col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveMeal(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg transition"
            >
              Assign Nutrition Plan to Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
