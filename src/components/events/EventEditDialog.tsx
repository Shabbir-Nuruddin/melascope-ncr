'use client';

import React, { useState } from 'react';
import { MelaEvent, EventType, VenueContext, VerificationStatus, BookingUrlType, PricingBasis } from '@/types';
import { X, Save, Edit, AlertCircle } from 'lucide-react';
import { classifyBookingUrlType } from '@/lib/validation';

interface EventEditDialogProps {
  event: Partial<MelaEvent> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Partial<MelaEvent>) => void;
}

export default function EventEditDialog({
  event,
  isOpen,
  onClose,
  onSave,
}: EventEditDialogProps) {
  if (!isOpen) return null;

  const [form, setForm] = useState<Partial<MelaEvent>>(
    event || {
      title: '',
      event_type: 'festive_market',
      venue_name: '',
      address: '',
      locality: '',
      city: 'Delhi',
      state: 'Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      start_at: new Date().toISOString(),
      end_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      organizer_name: '',
      organizer_phone: '',
      organizer_email: '',
      official_event_url: '',
      vendor_booking_url: '',
      booking_url_type: 'none',
      stall_fee_min: null,
      stall_fee_max: null,
      pricing_basis: 'per_event',
      stall_width_ft: 8,
      stall_depth_ft: 6,
      venue_context: 'destination',
      venue_context_rationale: '',
      verification_status: 'verified',
    }
  );

  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title?.trim() || !form.venue_name?.trim()) {
      setError('Title and Venue Name are required.');
      return;
    }

    onSave(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-[#e2ece6] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e2ece6] bg-[#f8faf8]">
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#059669]" />
            <h3 className="font-bold text-[#0f291e] text-base">
              {form.id ? 'Edit Opportunity' : 'Add Opportunity Manually'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#4b6354] hover:text-[#0f291e] rounded-lg bg-[#f0f7f3] border border-[#e2ece6] hover:bg-[#e2ece6] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-[#1b382b] font-medium block mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={form.title || ''}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#1b382b] font-medium block mb-1">Event Type</label>
              <select
                value={form.event_type || 'mela'}
                onChange={(e) => setForm({ ...form, event_type: e.target.value as EventType })}
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              >
                <option value="festive_market">Festive Market / Utsav</option>
                <option value="flea_market">Flea Market / Pop-Up</option>
                <option value="mela">Mela / Fair</option>
                <option value="craft_market">Craft Bazaar</option>
                <option value="society_event">Society / RWA Event</option>
                <option value="exhibition">Exhibition / Expo</option>
                <option value="food_festival">Food Festival</option>
              </select>
            </div>

            <div>
              <label className="text-[#1b382b] font-medium block mb-1">Verification Status</label>
              <select
                value={form.verification_status || 'verified'}
                onChange={(e) =>
                  setForm({ ...form, verification_status: e.target.value as VerificationStatus })
                }
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              >
                <option value="verified">Verified (Official Source)</option>
                <option value="partially_verified">Partially Verified</option>
                <option value="unverified">Unverified Lead</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#1b382b] font-medium block mb-1">Venue Name *</label>
              <input
                type="text"
                required
                value={form.venue_name || ''}
                onChange={(e) => setForm({ ...form, venue_name: e.target.value })}
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="text-[#1b382b] font-medium block mb-1">Locality & City</label>
              <input
                type="text"
                value={form.locality || ''}
                onChange={(e) => setForm({ ...form, locality: e.target.value })}
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[#1b382b] font-medium block mb-1">City</label>
              <select
                value={form.city || 'Delhi'}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              >
                <option value="Delhi">Delhi</option>
                <option value="Gurugram">Gurugram</option>
                <option value="Noida">Noida</option>
                <option value="Greater Noida">Greater Noida</option>
                <option value="Ghaziabad">Ghaziabad</option>
                <option value="Faridabad">Faridabad</option>
              </select>
            </div>

            <div>
              <label className="text-[#1b382b] font-medium block mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={form.latitude ?? 28.6139}
                onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="text-[#1b382b] font-medium block mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={form.longitude ?? 77.2090}
                onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#1b382b] font-medium block mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
                value={form.start_at ? form.start_at.slice(0, 16) : ''}
                onChange={(e) => setForm({ ...form, start_at: new Date(e.target.value).toISOString() })}
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="text-[#1b382b] font-medium block mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                value={form.end_at ? form.end_at.slice(0, 16) : ''}
                onChange={(e) => setForm({ ...form, end_at: new Date(e.target.value).toISOString() })}
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>
          </div>

          {/* Pricing & Booking */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[#1b382b] font-medium block mb-1">Min Stall Fee (₹)</label>
              <input
                type="number"
                value={form.stall_fee_min ?? ''}
                onChange={(e) =>
                  setForm({ ...form, stall_fee_min: e.target.value ? Number(e.target.value) : null })
                }
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="text-[#1b382b] font-medium block mb-1">Max Stall Fee (₹)</label>
              <input
                type="number"
                value={form.stall_fee_max ?? ''}
                onChange={(e) =>
                  setForm({ ...form, stall_fee_max: e.target.value ? Number(e.target.value) : null })
                }
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="text-[#1b382b] font-medium block mb-1">Pricing Basis</label>
              <select
                value={form.pricing_basis || 'per_event'}
                onChange={(e) => setForm({ ...form, pricing_basis: e.target.value as PricingBasis })}
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              >
                <option value="per_event">Per Event</option>
                <option value="per_day">Per Day</option>
                <option value="per_sqft">Per Sq Ft</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[#1b382b] font-medium block mb-1">Vendor Booking URL</label>
            <input
              type="url"
              value={form.vendor_booking_url || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  vendor_booking_url: e.target.value,
                  booking_url_type: classifyBookingUrlType(e.target.value),
                })
              }
              placeholder="https://forms.gle/... or direct stall booking page"
              className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[#1b382b] font-medium block mb-1">Organiser Name</label>
              <input
                type="text"
                value={form.organizer_name || ''}
                onChange={(e) => setForm({ ...form, organizer_name: e.target.value })}
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>

            <div>
              <label className="text-[#1b382b] font-medium block mb-1">Organiser Phone / WhatsApp</label>
              <input
                type="text"
                value={form.organizer_phone || ''}
                onChange={(e) => setForm({ ...form, organizer_phone: e.target.value })}
                className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e2ece6]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#f0f7f3] hover:bg-[#e2ece6] text-[#2d4a3e] border border-[#d8e5dd] rounded-xl font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow-sm transition"
            >
              Save Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
