import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit, Phone, Mail, Award, CheckCircle, XCircle, X } from 'lucide-react';
import api from '../../services/api';
import { getStatusBadgeClass } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';

export default function TrainerList() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: 'Trainer@123',
    experienceYears: 2,
    specialization: 'Strength & Conditioning',
    bio: '',
    photoUrl: ''
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = () => {
    setLoading(true);
    api.get('/trainers')
      .then((res) => {
        if (res.data.success) {
          setTrainers(res.data.trainers);
        }
      })
      .catch(() => error('Failed to load trainers.'))
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = async (trainerId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.patch(`/trainers/${trainerId}/status`, { status: newStatus });
      if (res.data.success) {
        success(res.data.message);
        fetchTrainers();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update trainer status.');
    }
  };

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/trainers', formData);
      if (res.data.success) {
        success(res.data.message);
        setModalOpen(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: 'Trainer@123',
          experienceYears: 2,
          specialization: 'Strength & Conditioning',
          bio: '',
          photoUrl: ''
        });
        fetchTrainers();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to add trainer.');
    }
  };

  const handleEditTrainer = async (e) => {
    e.preventDefault();
    if (!selectedTrainer) return;
    try {
      const res = await api.put(`/trainers/${selectedTrainer.id}`, selectedTrainer);
      if (res.data.success) {
        success('Trainer updated successfully.');
        setEditModalOpen(false);
        fetchTrainers();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update trainer.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Trainer Management</h2>
          <p className="text-xs text-slate-400">Manage certified trainers, specializations, client allocations.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Trainer</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading trainer profiles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainers.map((t) => (
            <div key={t.id} className="p-6 rounded-3xl bg-dark-850 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={t.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={t.full_name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-black text-white">{t.full_name}</h3>
                    <p className="text-xs text-brand-400 font-semibold">{t.specialization}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{t.experience_years} Years Experience</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleStatus(t.id, t.status)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${getStatusBadgeClass(t.status)}`}
                >
                  {t.status}
                </button>
              </div>

              <div className="pt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {t.bio || 'Professional fitness coach at RV Fitness Narsobawadi.'}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-400" />
                    <span>{t.phone}</span>
                  </p>
                  <p className="text-slate-400 text-[11px] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.email}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-white">{t.active_members_count || 0}</span>
                  <span className="block text-[10px] text-slate-500 uppercase">Assigned Clients</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => { setSelectedTrainer(t); setEditModalOpen(true); }}
                  className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE TRAINER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark-850 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-dark-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Add New Trainer</h3>
                <p className="text-xs text-slate-400">Creates trainer profile and staff login credentials.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrainer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Vikram Patil"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="coach@rvfitness.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9822012345"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Strength / CrossFit / Diet"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Profile Summary</label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Specialized coaching background..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-dark-800 border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-lg"
                >
                  Create Trainer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TRAINER MODAL */}
      {editModalOpen && selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark-850 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-dark-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Edit Trainer: {selectedTrainer.full_name}</h3>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditTrainer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={selectedTrainer.full_name}
                  onChange={(e) => setSelectedTrainer({ ...selectedTrainer, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={selectedTrainer.phone}
                    onChange={(e) => setSelectedTrainer({ ...selectedTrainer, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    value={selectedTrainer.specialization}
                    onChange={(e) => setSelectedTrainer({ ...selectedTrainer, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-dark-800 border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
