import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dumbbell, Plus, Trash2, CheckCircle2, Clock, Calendar, User } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export default function WorkoutManager() {
  const [searchParams] = useSearchParams();
  const initialMemberId = searchParams.get('memberId') || '';

  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(initialMemberId);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Workout Plan Form
  const [planForm, setPlanForm] = useState({
    title: 'Muscle Strength & Hypertrophy Split',
    goal: 'Build lean mass and improve compound lifts',
    notes: 'Warm up 10 mins with dynamic movements before each session.',
    exercises: [
      { dayOfWeek: 'Monday', exerciseName: 'Barbell Bench Press', muscleGroup: 'Chest', sets: 4, repetitions: '8-10', durationMins: 15, restSeconds: 90, instructions: 'Retract scapula, slow eccentric descent.' },
      { dayOfWeek: 'Monday', exerciseName: 'Incline Dumbbell Press', muscleGroup: 'Chest', sets: 3, repetitions: '10-12', durationMins: 12, restSeconds: 60, instructions: '30 degree bench angle.' },
      { dayOfWeek: 'Tuesday', exerciseName: 'Barbell Deadlift', muscleGroup: 'Back', sets: 4, repetitions: '6-8', durationMins: 20, restSeconds: 120, instructions: 'Maintain neutral lumbar spine.' },
      { dayOfWeek: 'Wednesday', exerciseName: 'Barbell Back Squat', muscleGroup: 'Legs', sets: 4, repetitions: '8-10', durationMins: 20, restSeconds: 90, instructions: 'Hit parallel depth, push through midfoot.' },
      { dayOfWeek: 'Thursday', exerciseName: 'Overhead Shoulder Press', muscleGroup: 'Shoulders', sets: 4, repetitions: '8-10', durationMins: 15, restSeconds: 90, instructions: 'Strict vertical press.' }
    ]
  });

  const { success, error } = useNotification();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMemberId) {
      fetchMemberWorkout(selectedMemberId);
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

  const fetchMemberWorkout = (memberId) => {
    setLoading(true);
    api.get(`/workouts/member/${memberId}`)
      .then((res) => {
        if (res.data.success) {
          setCurrentPlan(res.data.workoutPlan);
          setExercises(res.data.exercises || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleAddExerciseRow = () => {
    setPlanForm({
      ...planForm,
      exercises: [
        ...planForm.exercises,
        { dayOfWeek: 'Monday', exerciseName: '', muscleGroup: 'Full Body', sets: 3, repetitions: '10-12', durationMins: 10, restSeconds: 60, instructions: '' }
      ]
    });
  };

  const handleUpdateExercise = (index, field, val) => {
    const updated = [...planForm.exercises];
    updated[index][field] = val;
    setPlanForm({ ...planForm, exercises: updated });
  };

  const handleRemoveExercise = (index) => {
    const updated = planForm.exercises.filter((_, idx) => idx !== index);
    setPlanForm({ ...planForm, exercises: updated });
  };

  const handleSaveWorkout = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) {
      error('Please select a member.');
      return;
    }

    try {
      const res = await api.post('/workouts', {
        memberId: parseInt(selectedMemberId, 10),
        ...planForm
      });
      if (res.data.success) {
        success('Personalized workout routine assigned successfully!');
        fetchMemberWorkout(selectedMemberId);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save workout routine.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">Workout Routine Builder</h2>
        <p className="text-xs text-slate-400">Design and assign specialized training routines for RV Fitness members.</p>
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

        {currentPlan && (
          <div className="text-xs text-slate-400">
            Currently Assigned: <strong className="text-emerald-400">{currentPlan.title}</strong>
          </div>
        )}
      </div>

      {/* Currently Active Routine Preview */}
      {currentPlan && (
        <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                Active Client Routine
              </span>
              <h3 className="text-lg font-black text-white mt-1">{currentPlan.title}</h3>
              <p className="text-xs text-slate-400">Goal: {currentPlan.goal}</p>
            </div>
            <span className="text-xs text-slate-500">Coach: {currentPlan.trainer_name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((ex) => (
              <div key={ex.id} className="p-4 rounded-xl bg-dark-800 border border-slate-750 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-brand-400 uppercase tracking-wider text-[11px]">{ex.day_of_week}</span>
                  <span className="text-slate-400 text-[10px]">{ex.muscle_group}</span>
                </div>
                <h4 className="font-bold text-white text-sm">{ex.exercise_name}</h4>
                <div className="flex justify-between text-slate-300 font-mono text-[11px] pt-1 border-t border-slate-700/60">
                  <span>Sets: {ex.sets}</span>
                  <span>Reps: {ex.repetitions}</span>
                  <span>Rest: {ex.rest_seconds}s</span>
                </div>
                {ex.instructions && (
                  <p className="text-[11px] text-slate-400 italic mt-1 leading-snug">"{ex.instructions}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workout Routine Builder Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-dark-850 border border-slate-800 space-y-6">
        <div>
          <h3 className="text-lg font-black text-white">Create & Overwrite Client Split Routine</h3>
          <p className="text-xs text-slate-400">This will update the workout card visible on the member's portal.</p>
        </div>

        <form onSubmit={handleSaveWorkout} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Routine Title *</label>
              <input
                type="text"
                required
                value={planForm.title}
                onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Fitness Goal</label>
              <input
                type="text"
                value={planForm.goal}
                onChange={(e) => setPlanForm({ ...planForm, goal: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Coach Notes & Warm-up Instructions</label>
            <input
              type="text"
              value={planForm.notes}
              onChange={(e) => setPlanForm({ ...planForm, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs"
            />
          </div>

          {/* Exercise Rows */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-white uppercase tracking-wider">Exercise List ({planForm.exercises.length})</label>
              <button
                type="button"
                onClick={handleAddExerciseRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-slate-700 text-brand-400 text-xs font-semibold transition border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exercise</span>
              </button>
            </div>

            <div className="space-y-3">
              {planForm.exercises.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-dark-800 border border-slate-750 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-2">
                    <select
                      value={ex.dayOfWeek}
                      onChange={(e) => handleUpdateExercise(idx, 'dayOfWeek', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs"
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      required
                      placeholder="Exercise Name"
                      value={ex.exerciseName}
                      onChange={(e) => handleUpdateExercise(idx, 'exerciseName', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Muscle Group"
                      value={ex.muscleGroup}
                      onChange={(e) => handleUpdateExercise(idx, 'muscleGroup', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="number"
                      placeholder="Sets"
                      value={ex.sets}
                      onChange={(e) => handleUpdateExercise(idx, 'sets', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs text-center"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      placeholder="Reps"
                      value={ex.repetitions}
                      onChange={(e) => handleUpdateExercise(idx, 'repetitions', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs text-center"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Instructions"
                      value={ex.instructions}
                      onChange={(e) => handleUpdateExercise(idx, 'instructions', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-dark-850 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(idx)}
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
              className="px-8 py-3 rounded-xl font-bold text-xs bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition"
            >
              Assign Routine to Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
