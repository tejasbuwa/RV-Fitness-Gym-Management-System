import React, { useState, useEffect } from 'react';
import { Dumbbell, Calendar, Clock, CheckCircle2, Flame, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function MemberWorkout() {
  const { user } = useAuth();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');

  useEffect(() => {
    if (user?.memberId) {
      api.get(`/workouts/member/${user.memberId}`)
        .then((res) => {
          if (res.data.success) {
            setWorkoutPlan(res.data.workoutPlan);
            setExercises(res.data.exercises || []);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayExercises = exercises.filter((ex) => ex.day_of_week === selectedDay);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">My Personalized Workout Split</h2>
        <p className="text-xs text-slate-400">Assigned by Coach {workoutPlan?.trainer_name || 'RV Fitness'}</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Loading training routine...</div>
      ) : !workoutPlan ? (
        <div className="p-12 rounded-3xl bg-dark-850 border border-slate-800 text-center space-y-3">
          <Dumbbell className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Workout Assigned Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your assigned trainer has not yet configured your workout routine. Please visit the trainer desk on your next visit!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Plan Header Card */}
          <div className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded border border-brand-500/20">
              Active Routine
            </span>
            <h3 className="text-xl font-black text-white">{workoutPlan.title}</h3>
            <p className="text-xs text-slate-300">Goal: {workoutPlan.goal}</p>
            {workoutPlan.notes && (
              <p className="text-xs text-slate-400 italic pt-1 border-t border-slate-800 mt-2">
                Coach Notes: "{workoutPlan.notes}"
              </p>
            )}
          </div>

          {/* Day Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((d) => {
              const count = exercises.filter((ex) => ex.day_of_week === d).length;
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    selectedDay === d
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                      : 'bg-dark-850 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{d}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    selectedDay === d ? 'bg-black/30 text-white' : 'bg-dark-800 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Day Exercises Grid */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              {selectedDay} Exercises ({dayExercises.length})
            </h4>

            {dayExercises.length === 0 ? (
              <div className="p-8 rounded-2xl bg-dark-850 border border-slate-800 text-center text-xs text-slate-500">
                Rest & Active Recovery Day. Do 15 mins of light stretching.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dayExercises.map((ex, idx) => (
                  <div key={ex.id || idx} className="p-5 rounded-2xl bg-dark-850 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                        {ex.muscle_group}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">#{idx + 1}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{ex.exercise_name}</h4>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs font-mono">
                      <div className="p-2 rounded-lg bg-dark-800">
                        <span className="block text-[10px] text-slate-500 uppercase">Sets</span>
                        <span className="font-bold text-white">{ex.sets}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-dark-800">
                        <span className="block text-[10px] text-slate-500 uppercase">Reps</span>
                        <span className="font-bold text-white">{ex.repetitions}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-dark-800">
                        <span className="block text-[10px] text-slate-500 uppercase">Rest</span>
                        <span className="font-bold text-brand-400">{ex.rest_seconds}s</span>
                      </div>
                    </div>

                    {ex.instructions && (
                      <p className="text-[11px] text-slate-400 italic leading-snug">
                        "{ex.instructions}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
