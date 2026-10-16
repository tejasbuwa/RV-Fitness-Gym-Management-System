import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { success } = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();
    success('Thank you for contacting RV Fitness Narsobawadi! Our team will call you back shortly.');
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16 bg-[#0a0a0a] text-zinc-100">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
          Connect With Our Desk
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          GET IN TOUCH WITH <br />
          <span className="text-gold-gradient">RV FITNESS NARSOBAWADI</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
          Have queries regarding personal coaching, membership plans, or booking a personal tour of the facility? Our front desk is ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="glass-gold p-8 rounded-3xl border border-amber-500/20 space-y-6 bg-zinc-950/80">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Gym Headquarters</span>
            </h3>

            <div className="space-y-5 text-sm text-zinc-300">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-base">RV FITNESS NARSOBAWADI</p>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Main Bazaar Road, Near Narsimha Mandir Chowk, Narsobawadi, Dist. Kolhapur, Maharashtra – 416104
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">+91 98220 12345 / +91 98234 45566</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Calling & WhatsApp line open daily 5:30 AM – 10:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">contact@rvfitness.com</p>
                  <p className="text-xs text-zinc-400 mt-0.5">For corporate inquiries, sponsorships & coaching requests</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-gold p-8 rounded-3xl border border-amber-500/20 space-y-4 bg-zinc-950/80">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-white text-base">Daily Workout Schedule</h4>
            </div>
            <div className="text-xs text-zinc-300 space-y-3 pt-3 border-t border-zinc-800">
              <div className="flex justify-between items-center py-1 border-b border-zinc-900">
                <span className="font-semibold text-zinc-300">Morning Shift:</span>
                <span className="text-amber-300 font-bold">05:30 AM – 10:00 AM (Mon – Sat)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-900">
                <span className="font-semibold text-zinc-300">Evening Shift:</span>
                <span className="text-amber-300 font-bold">04:30 PM – 10:00 PM (Mon – Sat)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold text-zinc-300">Sunday Special Session:</span>
                <span className="text-zinc-400 font-medium">06:00 AM – 09:30 AM (Cardio & Mobility)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Inquiry Form */}
        <div className="glass-gold p-8 sm:p-10 rounded-3xl border border-amber-500/20 bg-zinc-950/90 shadow-2xl space-y-6">
          <div>
            <h3 className="text-2xl font-black text-white">Send Us An Inquiry</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Leave your details below and a coach will reach out to you within a few hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Inquiry Received!</h4>
              <p className="text-xs text-zinc-300">
                Thank you for contacting RV Fitness Narsobawadi. We have logged your request and our trainer will call you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-gold-outline px-6 py-2 rounded-xl text-xs font-bold mt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohit Patil"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9822012345"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rohit@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Fitness Goals & Questions *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tell us what you want to achieve (e.g. Muscle hypertrophy, Weight loss, General fitness, Personal trainer inquiries)..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm transition"
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-gold w-full py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-4 h-4 text-black" />
                <span>Submit Inquiry to RV Fitness Desk</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
