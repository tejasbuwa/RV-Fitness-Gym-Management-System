import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  UserCheck,
  Phone,
  AlertCircle,
  X
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [trainerFilter, setTrainerFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const { success, error } = useNotification();

  // Form state for creating member
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: 'Member@123',
    gender: 'Male',
    dob: '',
    address: '',
    emergencyContact: '',
    assignedTrainerId: '',
    heightCm: '',
    weightKg: '',
    fitnessGoal: 'Muscle Hypertrophy & Strength'
  });

  useEffect(() => {
    fetchMembers();
    fetchTrainers();
  }, [search, statusFilter, trainerFilter]);

  const fetchMembers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (statusFilter) params.append('status', statusFilter);
    if (trainerFilter) params.append('trainerId', trainerFilter);

    api.get(`/members?${params.toString()}`)
      .then((res) => {
        if (res.data.success) {
          setMembers(res.data.members);
        }
      })
      .catch(() => error('Failed to load member records.'))
      .finally(() => setLoading(false));
  };

  const fetchTrainers = () => {
    api.get('/trainers')
      .then((res) => {
        if (res.data.success) setTrainers(res.data.trainers);
      })
      .catch(() => {});
  };

  const handleToggleStatus = async (memberId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.patch(`/members/${memberId}/status`, { status: newStatus });
      if (res.data.success) {
        success(res.data.message);
        fetchMembers();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update member status.');
    }
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/members', formData);
      if (res.data.success) {
        success(res.data.message);
        setModalOpen(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: 'Member@123',
          gender: 'Male',
          dob: '',
          address: '',
          emergencyContact: '',
          assignedTrainerId: '',
          heightCm: '',
          weightKg: '',
          fitnessGoal: 'Muscle Hypertrophy & Strength'
        });
        fetchMembers();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create member.');
    }
  };

  const handleEditMemberSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    try {
      const res = await api.put(`/members/${selectedMember.id}`, selectedMember);
      if (res.data.success) {
        success('Member updated successfully.');
        setEditModalOpen(false);
        fetchMembers();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update member.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Members Directory</h2>
          <p className="text-xs text-slate-400">Manage member profiles, membership status, and trainer allocations.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-dark-850 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, RVF-xxxx, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
          >
            <option value="">All Member Statuses</option>
            <option value="active">Active Members</option>
            <option value="inactive">Inactive Members</option>
            <option value="pending">Pending Members</option>
          </select>
        </div>
        <div className="sm:col-span-4">
          <select
            value={trainerFilter}
            onChange={(e) => setTrainerFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
          >
            <option value="">All Assigned Trainers</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>{t.full_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-2xl bg-dark-850 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-dark-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-3 px-4">Member ID & Name</th>
                <th className="py-3 px-4">Phone & Gender</th>
                <th className="py-3 px-4">Assigned Trainer</th>
                <th className="py-3 px-4">Membership Plan Status</th>
                <th className="py-3 px-4">Pending Dues</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 text-xs">
                    Fetching member records...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 text-xs">
                    No members found matching your search filters.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="hover:bg-dark-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center font-bold text-brand-400 text-xs shrink-0">
                          {m.full_name[0]}
                        </div>
                        <div>
                          <Link to={`/admin/members/${m.id}`} className="font-bold text-white hover:text-brand-400">
                            {m.full_name}
                          </Link>
                          <p className="font-mono text-[11px] font-bold text-brand-400">{m.member_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-200">{m.phone}</p>
                      <p className="text-[11px] text-slate-500">{m.gender}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {m.trainer_name ? (
                        <span className="font-medium text-slate-200">{m.trainer_name}</span>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {m.current_membership_status ? (
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadgeClass(m.current_membership_status)}`}>
                            {m.current_membership_status}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">Expires: {formatDate(m.membership_expiry_date)}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">No active plan</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {parseFloat(m.total_pending_balance) > 0 ? (
                        <span className="text-rose-400">{formatCurrency(m.total_pending_balance)}</span>
                      ) : (
                        <span className="text-emerald-400">₹0.00</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(m.id, m.status)}
                        title="Click to toggle status"
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${getStatusBadgeClass(m.status)}`}
                      >
                        {m.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/members/${m.id}`}
                          title="View 360 Profile"
                          className="p-1.5 rounded-lg bg-dark-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => { setSelectedMember(m); setEditModalOpen(true); }}
                          title="Edit Member"
                          className="p-1.5 rounded-lg bg-dark-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MEMBER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark-850 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-dark-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Register New Member</h3>
                <p className="text-xs text-slate-400">Auto-generates unique RVF-xxxx permanent ID and login credentials.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Anand Kadam"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9822019988"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="anand@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Password</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Trainer</label>
                  <select
                    value={formData.assignedTrainerId}
                    onChange={(e) => setFormData({ ...formData, assignedTrainerId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>{t.full_name} ({t.specialization})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                    placeholder="e.g. 175"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                    placeholder="e.g. 72"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address (Narsobawadi)</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Near Narsimha Mandir, Narsobawadi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                />
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
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark-850 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-dark-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Edit Member: {selectedMember.member_code}</h3>
                <p className="text-xs text-slate-400">{selectedMember.full_name}</p>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditMemberSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={selectedMember.full_name}
                  onChange={(e) => setSelectedMember({ ...selectedMember, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={selectedMember.phone}
                  onChange={(e) => setSelectedMember({ ...selectedMember, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={selectedMember.status}
                    onChange={(e) => setSelectedMember({ ...selectedMember, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Trainer</label>
                  <select
                    value={selectedMember.assigned_trainer_id || ''}
                    onChange={(e) => setSelectedMember({ ...selectedMember, assigned_trainer_id: e.target.value ? parseInt(e.target.value, 10) : null })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>{t.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fitness Goal</label>
                <input
                  type="text"
                  value={selectedMember.fitness_goal || ''}
                  onChange={(e) => setSelectedMember({ ...selectedMember, fitness_goal: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                />
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
