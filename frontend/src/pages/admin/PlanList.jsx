import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, CheckCircle, Clock, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, getStatusBadgeClass } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';

export default function PlanList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    planType: 'Monthly',
    durationDays: 30,
    price: '',
    description: '',
    benefitsStr: 'Full gym access, Locker room access, General trainer guidance'
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = () => {
    setLoading(true);
    api.get('/membership-plans')
      .then((res) => {
        if (res.data.success) {
          setPlans(res.data.plans);
        }
      })
      .catch(() => error('Failed to load plans.'))
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = async (planId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.patch(`/membership-plans/${planId}/status`, { status: newStatus });
      if (res.data.success) {
        success(res.data.message);
        fetchPlans();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update plan status.');
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      const benefits = formData.benefitsStr.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await api.post('/membership-plans', {
        ...formData,
        price: parseFloat(formData.price),
        benefits
      });
      if (res.data.success) {
        success(res.data.message);
        setModalOpen(false);
        setFormData({
          name: '',
          planType: 'Monthly',
          durationDays: 30,
          price: '',
          description: '',
          benefitsStr: 'Full gym access, Locker room access, General trainer guidance'
        });
        fetchPlans();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create plan.');
    }
  };

  const handleEditPlan = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    try {
      const benefits = typeof selectedPlan.benefitsStr === 'string'
        ? selectedPlan.benefitsStr.split(',').map((s) => s.trim()).filter(Boolean)
        : selectedPlan.benefits;

      const res = await api.put(`/membership-plans/${selectedPlan.id}`, {
        ...selectedPlan,
        price: parseFloat(selectedPlan.price),
        benefits
      });
      if (res.data.success) {
        success('Plan updated successfully.');
        setEditModalOpen(false);
        fetchPlans();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update plan.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Membership Plans Catalog</h2>
          <p className="text-xs text-slate-400">Configure pricing, durations, benefits, and activation status.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading membership packages...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const benefits = Array.isArray(p.benefits) ? p.benefits : [];
            return (
              <div key={p.id} className="p-6 rounded-3xl bg-dark-850 border border-slate-800 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded border border-brand-500/20">
                      {p.plan_type}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(p.id, p.status)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${getStatusBadgeClass(p.status)}`}
                    >
                      {p.status}
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">{p.name}</h3>
                    <p className="text-xs text-slate-400">{p.duration_days} Days Duration</p>
                  </div>

                  <div className="my-2">
                    <span className="text-3xl font-black text-white">{formatCurrency(p.price)}</span>
                    <span className="text-xs text-slate-500 ml-1">/ pkg</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Features:</span>
                    {benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedPlan({
                        ...p,
                        benefitsStr: Array.isArray(p.benefits) ? p.benefits.join(', ') : ''
                      });
                      setEditModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Plan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE PLAN MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark-850 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-dark-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Create Membership Plan</h3>
                <p className="text-xs text-slate-400">Adds plan to billing catalog and public pricing page.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 6-Month Hardcore Transformation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Plan Type</label>
                  <select
                    value={formData.planType}
                    onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Days *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Target audience or description..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Benefits (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.benefitsStr}
                  onChange={(e) => setFormData({ ...formData, benefitsStr: e.target.value })}
                  placeholder="Gym floor access, Lockers, Diet chart"
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
                  Publish Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PLAN MODAL */}
      {editModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark-850 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-dark-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Edit Plan: {selectedPlan.name}</h3>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditPlan} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={selectedPlan.name}
                  onChange={(e) => setSelectedPlan({ ...selectedPlan, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration Days</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={selectedPlan.duration_days}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, duration_days: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={selectedPlan.price}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-xs focus:border-brand-500 focus:outline-none font-mono"
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
