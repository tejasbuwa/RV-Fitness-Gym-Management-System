import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { success } = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();
    success('Thank you for contacting RV Fitness Narsobawadi! We will respond shortly.');
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Reach Out</span>
        <h1 className="text-4xl font-black text-white">Contact RV Fitness Narsobawadi</h1>
        <p className="text-sm text-slate-400">
          Have queries regarding personal coaching, rates, or facility tours? Connect with our reception desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact info cards */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Gym Headquarters</h3>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">RV FITNESS NARSOBAWADI</p>
                  <p className="text-xs text-slate-400">Main Bazaar Road, Near Narsimha Mandir, Narsobawadi, Dist. Kolhapur, Maharashtra - 416104</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-500 shrink-0" />
                <div>
                  <p className="text-white">+91 98220 12345 / +91 98220 54321</p>
                  <p className="text-[11px] text-slate-400">Calling desk open daily 5:30 AM to 10:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-500 shrink-0" />
                <p className="text-white">contact@rvfitness.com</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-850 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-500" />
              <h4 className="font-bold text-white text-sm">Operating Shifts</h4>
            </div>
            <div className="text-xs text-slate-300 space-y-1.5 border-t border-slate-800 pt-3">
              <div className="flex justify-between">
                <span>Morning Batch:</span>
                <span className="font-semibold text-white">05:30 AM – 10:00 AM (Mon – Sat)</span>
              </div>
              <div className="flex justify-between">
                <span>Evening Batch:</span>
                <span className="font-semibold text-white">05:00 PM – 10:00 PM (Mon – Sat)</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday Open Hours:</span>
                <span className="font-semibold text-amber-400">06:00 AM – 10:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 rounded-3xl bg-dark-850 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6">Send an Inquiry</h3>
          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-emerald-300 text-sm">Message Delivered!</h4>
              <p className="text-xs text-emerald-200">Our desk executive will phone you back today.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 9822011223"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@email.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry / Message</label>
                <textarea
                  rows="4"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="I would like to inquire about personal training packages..."
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-800 border border-slate-700 text-white text-sm focus:border-brand-500 focus:outline-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition"
              >
                Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
