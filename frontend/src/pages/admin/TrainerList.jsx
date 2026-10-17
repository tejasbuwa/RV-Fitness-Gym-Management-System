import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Edit,
  Phone,
  Mail,
  Award,
  CheckCircle,
  XCircle,
  X,
  Dumbbell,
  Sparkles,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import api from '../../services/api';
import { getStatusBadgeClass } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';

const PRESET_TRAINER_PHOTOS = [
  { label: 'Side Chest & Vascularity Peak (RV Fitness)', url: '/images/client/rv-gym-side-chest-pose.jpg' },
  { label: 'Back Lat & Arena Pose (RV Fitness)', url: '/images/client/rv-gym-branding-back-pose.jpg' },
  { label: 'Front Biceps & Conditioning (RV Fitness)', url: '/images/client/rv-gym-front-biceps-warrior.jpg' },
  { label: 'Championship Bodybuilder (RV Fitness)', url: '/images/client/rv-gym-hero-bodybuilder.jpg' },
  { label: 'Warrior Silhouette & Focus', url: '/images/client/rv-gym-warrior-pose.jpg' },
  { label: 'Classic Aesthetic Physique', url: '/images/client/rv-gym-physique-monochrome.jpg' },
  { label: 'Strength & Bodybuilding Coach', url: '/images/gym/trainer_vikram.jpg' },
  { label: 'CrossFit & Conditioning Coach', url: '/images/gym/trainer_sneha.jpg' },
  { label: 'Hypertrophy & Dumbbells Coach', url: '/images/gym/trainer_rahul.jpg' },
  { label: 'Fitness & Mobility Coach', url: '/images/gym/trainer_diya.jpg' },
  { label: 'Olympic Barbell & Heavy Plates', url: '/images/gym/trainer_equipment_barbell.jpg' },
  { label: 'Commercial Dumbbell Rack', url: '/images/gym/trainer_equipment_dumbbells.jpg' },
  { label: 'Free Weights & Power Racks', url: '/images/gym/facility_weights.jpg' },
  { label: 'Functional & CrossFit Turf', url: '/images/gym/facility_crossfit.jpg' }
];

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
    experienceYears: 3,
    specialization: 'Strength & Conditioning',
    bio: '',
    photoUrl: '/images/gym/trainer_equipment_barbell.jpg'
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

  const getTrainerDisplayPhoto = (trainer, index) => {
    if (trainer.photo_url && trainer.photo_url.trim() !== '') {
      return trainer.photo_url;
    }
    const nameLower = (trainer.full_name || '').toLowerCase();
    if (nameLower.includes('vikram')) return '/images/client/rv-gym-side-chest-pose.jpg';
    if (nameLower.includes('sneha')) return '/images/gym/trainer_sneha.jpg';
    if (nameLower.includes('rahul')) return '/images/gym/trainer_rahul.jpg';
    if (nameLower.includes('diya')) return '/images/gym/trainer_diya.jpg';

    // Fallback to distinct equipment photo based on index
    const fallbacks = [
      '/images/gym/trainer_equipment_barbell.jpg',
      '/images/gym/trainer_equipment_dumbbells.jpg',
      '/images/gym/facility_weights.jpg',
      '/images/gym/facility_crossfit.jpg'
    ];
    return fallbacks[index % fallbacks.length];
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
        success(res.data.message || 'Trainer profile created successfully.');
        setModalOpen(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: 'Trainer@123',
          experienceYears: 3,
          specialization: 'Strength & Conditioning',
          bio: '',
          photoUrl: '/images/gym/trainer_equipment_barbell.jpg'
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
        success('Trainer profile and photo updated successfully.');
        setEditModalOpen(false);
        fetchTrainers();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update trainer.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white">Trainer Management</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
              Coaching Staff
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage certified fitness mentors, specialized workout allocations, and profile photos.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-gold inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-gold-glow"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Add New Trainer</span>
        </button>
      </div>

      {/* Trainer Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-zinc-400 text-xs">Loading trainer profiles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainers.map((t, idx) => {
            const photoSrc = getTrainerDisplayPhoto(t, idx);
            return (
              <div
                key={t.id}
                className="glass-gold p-6 sm:p-7 rounded-3xl border border-gold-500/20 hover:border-gold-500/40 bg-zinc-950/90 shadow-xl transition-all duration-300 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Trainer Profile Photo */}
                    <div className="relative group shrink-0">
                      <img
                        src={photoSrc}
                        alt={t.full_name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/gym/trainer_equipment_barbell.jpg';
                        }}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover object-center ring-2 ring-gold-500/40 shadow-lg shadow-gold-500/10 bg-zinc-900 group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => { setSelectedTrainer(t); setEditModalOpen(true); }}
                        title="Change Photo"
                        className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-black/90 border border-gold-500/40 text-gold-400 hover:text-white transition shadow"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-white">{t.full_name}</h3>
                      <p className="text-xs font-bold text-amber-400 mt-0.5">{t.specialization}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {t.experience_years} Years Exp
                        </span>
                        <span className="text-[11px] text-zinc-500">RV Fitness Narsobawadi</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(t.id, t.status)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${getStatusBadgeClass(t.status)}`}
                  >
                    {t.status}
                  </button>
                </div>

                <div className="pt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed bg-zinc-900/40 p-3 rounded-xl border border-zinc-850">
                  {t.bio || 'Certified strength and personal conditioning coach at RV Fitness Narsobawadi.'}
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <p className="text-zinc-300 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.phone}</span>
                    </p>
                    <p className="text-zinc-400 text-[11px] flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{t.email}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-amber-400 font-mono">{t.active_members_count || 0}</span>
                    <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Active Clients</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex justify-end">
                  <button
                    onClick={() => { setSelectedTrainer(t); setEditModalOpen(true); }}
                    className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold flex items-center gap-2 transition"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Profile & Photo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE TRAINER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-amber-500/30 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Add New Trainer</h3>
                <p className="text-xs text-zinc-400">Creates trainer profile and staff login credentials.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-zinc-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrainer} className="p-6 space-y-4">
              {/* Photo Preview and Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Trainer Profile Photo
                </label>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 mb-3">
                  <img
                    src={formData.photoUrl || '/images/gym/trainer_equipment_barbell.jpg'}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover object-center ring-2 ring-amber-500/40 shrink-0"
                  />
                  <div className="text-xs text-zinc-400">
                    <p className="font-semibold text-white">Selected Profile Photo</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Choose from gym presets below or enter a custom photo URL.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {PRESET_TRAINER_PHOTOS.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setFormData({ ...formData, photoUrl: preset.url })}
                      className={`p-1.5 rounded-xl border text-left transition flex flex-col items-center gap-1.5 ${
                        formData.photoUrl === preset.url
                          ? 'border-amber-400 bg-amber-500/20 ring-1 ring-amber-400'
                          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-12 h-12 rounded-lg object-cover object-center"
                      />
                      <span className="text-[9px] text-zinc-300 line-clamp-1 text-center font-medium">
                        {preset.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="Or enter custom image URL / path (e.g. /images/gym/...)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Vikram Patil"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="coach@rvfitness.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9822012345"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Strength / CrossFit / Bodybuilding"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Bio / Profile Summary</label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Specialized coaching background..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold text-black shadow-gold-glow"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-amber-500/30 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Edit Trainer: {selectedTrainer.full_name}</h3>
                <p className="text-xs text-zinc-400">Update photo, coaching specialty, and contact details.</p>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="p-1.5 text-zinc-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditTrainer} className="p-6 space-y-4">
              {/* Photo Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 mb-3">
                  <img
                    src={selectedTrainer.photo_url || '/images/gym/trainer_equipment_barbell.jpg'}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover object-center ring-2 ring-amber-500/40 shrink-0"
                  />
                  <div className="text-xs text-zinc-400">
                    <p className="font-semibold text-white">Current Profile Photo</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Select a fitness photo or barbell equipment preset below.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {PRESET_TRAINER_PHOTOS.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setSelectedTrainer({ ...selectedTrainer, photo_url: preset.url })}
                      className={`p-1.5 rounded-xl border text-left transition flex flex-col items-center gap-1.5 ${
                        selectedTrainer.photo_url === preset.url
                          ? 'border-amber-400 bg-amber-500/20 ring-1 ring-amber-400'
                          : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-12 h-12 rounded-lg object-cover object-center"
                      />
                      <span className="text-[9px] text-zinc-300 line-clamp-1 text-center font-medium">
                        {preset.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={selectedTrainer.photo_url || ''}
                  onChange={(e) => setSelectedTrainer({ ...selectedTrainer, photo_url: e.target.value })}
                  placeholder="Or enter custom image path (e.g. /images/gym/...)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={selectedTrainer.full_name}
                  onChange={(e) => setSelectedTrainer({ ...selectedTrainer, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={selectedTrainer.phone}
                    onChange={(e) => setSelectedTrainer({ ...selectedTrainer, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    value={selectedTrainer.specialization}
                    onChange={(e) => setSelectedTrainer({ ...selectedTrainer, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    value={selectedTrainer.experience_years || 1}
                    onChange={(e) => setSelectedTrainer({ ...selectedTrainer, experience_years: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Status</label>
                  <select
                    value={selectedTrainer.status}
                    onChange={(e) => setSelectedTrainer({ ...selectedTrainer, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Bio / Profile Summary</label>
                <textarea
                  rows="3"
                  value={selectedTrainer.bio || ''}
                  onChange={(e) => setSelectedTrainer({ ...selectedTrainer, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-xs focus:border-amber-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold text-black shadow-gold-glow"
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
