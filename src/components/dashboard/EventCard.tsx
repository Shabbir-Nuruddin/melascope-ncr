'use client';

import React from 'react';
import { MelaEvent, UserStatus } from '@/types';
import {
  Calendar,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  IndianRupee,
  ChevronRight,
  Layers,
  Navigation,
  Sparkles,
} from 'lucide-react';

interface EventCardProps {
  event: MelaEvent;
  isSelected: boolean;
  onSelect: () => void;
  onOpenDetails: () => void;
  onStatusChange: (newStatus: UserStatus) => void;
}

export default function EventCard({
  event,
  isSelected,
  onSelect,
  onOpenDetails,
  onStatusChange,
}: EventCardProps) {
  // Format dates in Asia/Kolkata
  const startDate = new Date(event.start_at).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: 'numeric',
  });
  const endDate = new Date(event.end_at).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: 'numeric',
  });

  const isVerified = event.verification_status === 'verified';
  const isUnverified = event.verification_status === 'unverified';

  const hasBookingUrl = Boolean(
    event.vendor_booking_url &&
    event.booking_url_type !== 'none' &&
    event.booking_url_type !== 'venue_website'
  );

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-[#f0fdf4] border-[#059669] ring-2 ring-[#059669]/20 shadow-lg'
          : 'bg-white hover:bg-[#fafdfb] border-[#e2ece6] hover:border-[#a7f3d0] shadow-sm hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Badges & Pipeline Status Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Verification Badge */}
            {isVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            ) : isUnverified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#fffbeb] text-[#b45309] border border-[#fde68a]">
                <AlertTriangle className="w-3 h-3" />
                Lead
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#f1f5f9] text-[#64748b] border border-[#cbd5e1]">
                Partial
              </span>
            )}

            {/* Type Badge */}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f8faf8] text-[#52796f] border border-[#e2ece6] uppercase tracking-wider font-semibold">
              {event.event_type.replace('_', ' ')}
            </span>

            {/* Floor Plan Indicator */}
            {event.has_floor_plan && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                <Layers className="w-3 h-3" /> Layout Plan
              </span>
            )}
          </div>

          {/* User Pipeline Status Dropdown */}
          <select
            value={event.user_status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStatusChange(e.target.value as UserStatus)}
            className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border cursor-pointer focus:outline-none transition ${
              event.user_status === 'saved'
                ? 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
                : event.user_status === 'applied'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : event.user_status === 'booked'
                ? 'bg-[#059669] text-white border-[#059669]'
                : event.user_status === 'contacted'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-[#f8faf8] text-[#52796f] border-[#e2ece6]'
            }`}
          >
            <option value="new">New</option>
            <option value="saved">Saved</option>
            <option value="contacted">Contacted</option>
            <option value="applied">Applied</option>
            <option value="booked">Booked</option>
            <option value="rejected">Passed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Title */}
        <h3 className="font-black text-lg text-[#0f291e] group-hover:text-[#059669] transition leading-snug mb-1.5">
          {event.title}
        </h3>

        {/* Venue & Locality with directions click */}
        <div className="flex items-center justify-between text-xs text-[#52796f] mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
            <span className="truncate font-medium">{event.venue_name}, {event.locality}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f8faf8] text-[#52796f] border border-[#e2ece6]">
              {event.city}
            </span>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded text-[#52796f] hover:text-[#059669] hover:bg-[#ecfdf5] transition flex-shrink-0"
            title="Directions in Google Maps"
          >
            <Navigation className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Date & Stall Fee Highlight Box */}
        <div className="p-3 rounded-xl bg-[#f8faf8] border border-[#e2ece6] mb-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#0f291e]">
              <Calendar className="w-3.5 h-3.5 text-[#059669]" />
              <span className="font-semibold">{startDate === endDate ? startDate : `${startDate} – ${endDate}`}</span>
            </div>

            <div className="flex items-center gap-1 font-black text-sm text-[#059669]">
              <IndianRupee className="w-3.5 h-3.5 text-[#059669]" />
              {event.stall_fee_max ? (
                <span>
                  {event.stall_fee_min && event.stall_fee_min !== event.stall_fee_max
                    ? `₹${event.stall_fee_min.toLocaleString('en-IN')} – ₹${event.stall_fee_max.toLocaleString('en-IN')}`
                    : `₹${event.stall_fee_max.toLocaleString('en-IN')}`}
                </span>
              ) : (
                <span className="text-[#64748b] font-normal italic text-xs">Fee unannounced</span>
              )}
            </div>
          </div>

          {/* Quick Fit Score Progress Bar */}
          <div className="space-y-1 pt-1.5 border-t border-[#e2ece6]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#52796f] font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#059669]" /> Commercial Fit Score
              </span>
              <span className="font-bold text-[#0f291e]">
                <span className={event.fit_score >= 80 ? 'text-[#059669]' : event.fit_score >= 65 ? 'text-[#65a30d]' : 'text-[#64748b]'}>
                  {event.fit_score}
                </span>
                <span className="text-[10px] text-[#64748b] font-normal"> / 100</span>
              </span>
            </div>
            <div className="w-full bg-[#e2ece6] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  event.fit_score >= 80
                    ? 'bg-[#059669]'
                    : event.fit_score >= 65
                    ? 'bg-[#65a30d]'
                    : 'bg-[#64748b]'
                }`}
                style={{ width: `${event.fit_score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Audience / Context Summary */}
        <p className="text-xs text-[#52796f] line-clamp-2 mb-3 leading-relaxed">
          {event.recommendation || event.description || `Commercial opportunity at ${event.venue_name}.`}
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#e2ece6] text-xs">
        <span className="text-[11px] text-[#52796f]">
          Organiser: <strong className="text-[#0f291e] font-semibold">{event.organizer_name}</strong>
        </span>

        <div className="flex items-center gap-2">
          {hasBookingUrl && (
            <a
              href={event.vendor_booking_url!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-lg text-xs shadow-sm shadow-[#059669]/20 transition"
              title="Open Official Vendor Application Form"
            >
              <span>Book Stall</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-[#f0fdf4] text-[#0f291e] border border-[#e2ece6] hover:border-[#a7f3d0] text-xs font-semibold transition shadow-xs"
          >
            <span>Intel</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#059669]" />
          </button>
        </div>
      </div>
    </div>
  );
}
