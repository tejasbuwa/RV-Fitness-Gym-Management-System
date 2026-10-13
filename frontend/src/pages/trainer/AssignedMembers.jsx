import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Dumbbell, Utensils, Activity, Search, Phone, Eye } from 'lucide-react';
import api from '../../services/api';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';

export default function AssignedMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAssignedMembers();
  }, [search]);

  const fetchAssignedMembers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    api.get(`/members?${params.toString()}`)
      .then((res) => {
        if (res.data.success) {
          setMembers(res.data.members);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">My Assigned Clients</h2>
          <p className="text-xs text-slate-400">Members under your dedicated personal coaching in Narsobawadi.</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, mobile or RVF ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-dark-850 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-dark-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-3 px-4">Client ID & Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Fitness Goal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500 text-xs">
                    Loading your assigned clients...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500 text-xs">
                    No assigned clients found.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="hover:bg-dark-800/40 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{m.full_name}</p>
                      <p className="font-mono text-[11px] text-brand-400 font-bold">{m.member_code}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-200">{m.phone}</p>
                      <p className="text-[10px] text-slate-500">{m.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                      {m.fitness_goal || 'General Health'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(m.status)}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/trainer/workouts?memberId=${m.id}`}
                          title="Assign Workout Split"
                          className="p-1.5 rounded-lg bg-dark-800 hover:bg-slate-700 text-brand-400 hover:text-brand-300 transition"
                        >
                          <Dumbbell className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/trainer/diets?memberId=${m.id}`}
                          title="Assign Diet Routine"
                          className="p-1.5 rounded-lg bg-dark-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition"
                        >
                          <Utensils className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/trainer/progress?memberId=${m.id}`}
                          title="Log Progress Check-in"
                          className="p-1.5 rounded-lg bg-dark-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition"
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
