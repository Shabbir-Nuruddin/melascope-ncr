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
  MessageSquare,
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
          ? 'bg-[#15241c] border-[#00df81] ring-2 ring-[#00df81]/30 shadow-2xl shadow-[#00df81]/15'
          : 'bg-[#0c1510] hover:bg-[#0f1a14] border-[#1c3327] hover:border-[#284b39] shadow-md hover:shadow-xl'
      }`}
    >
      <div>
        {/* Top Badges & Pipeline Status Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Verification Badge */}
            {isVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#00df81]/15 text-[#00df81] border border-[#00df81]/30">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            ) : isUnverified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/80">
                <AlertTriangle className="w-3 h-3" />
                Lead
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#15241c] text-[#6e8a7b] border border-[#1c3327]">
                Partial
              </span>
            )}

            {/* Type Badge */}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#060b08] text-[#6e8a7b] border border-[#1c3327] uppercase tracking-wider">
              {event.event_type.replace('_', ' ')}
            </span>

            {/* Floor Plan Indicator */}
            {event.has_floor_plan && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00df81]/15 text-[#00df81] border border-[#00df81]/30">
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
                ? 'bg-[#15241c] text-[#00df81] border-[#00df81]/40'
                : event.user_status === 'applied'
                ? 'bg-blue-950/80 text-blue-300 border-blue-800'
                : event.user_status === 'booked'
                ? 'bg-[#00df81]/25 text-[#00df81] border-[#00df81]'
                : event.user_status === 'contacted'
                ? 'bg-purple-950/80 text-purple-300 border-purple-800'
                : 'bg-[#060b08] text-[#6e8a7b] border-[#1c3327]'
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
        <h3 className="font-black text-lg text-white group-hover:text-[#00df81] transition leading-snug mb-1.5">
          {event.title}
        </h3>

        {/* Venue & Locality with directions click */}
        <div className="flex items-center justify-between text-xs text-[#6e8a7b] mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#00df81] flex-shrink-0" />
            <span className="truncate">{event.venue_name}, {event.locality}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#060b08] text-[#6e8a7b] border border-[#1c3327]">
              {event.city}
            </span>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded text-[#6e8a7b] hover:text-[#00df81] hover:bg-[#15241c] transition flex-shrink-0"
            title="Directions in Google Maps"
          >
            <Navigation className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Date & Stall Fee Highlight Box */}
        <div className="p-3 rounded-xl bg-[#060b08] border border-[#1c3327] mb-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#f0fdf4]">
              <Calendar className="w-3.5 h-3.5 text-[#00df81]" />
              <span className="font-medium">{startDate === endDate ? startDate : `${startDate} – ${endDate}`}</span>
            </div>

            <div className="flex items-center gap-1 font-black text-sm text-[#00df81]">
              <IndianRupee className="w-3.5 h-3.5 text-[#00df81]" />
              {event.stall_fee_max ? (
                <span>
                  {event.stall_fee_min && event.stall_fee_min !== event.stall_fee_max
                    ? `₹${event.stall_fee_min.toLocaleString('en-IN')} – ₹${event.stall_fee_max.toLocaleString('en-IN')}`
                    : `₹${event.stall_fee_max.toLocaleString('en-IN')}`}
                </span>
              ) : (
                <span className="text-[#6e8a7b] font-normal italic text-xs">Fee unannounced</span>
              )}
            </div>
          </div>

          {/* Quick Fit Score Progress Bar */}
          <div className="space-y-1 pt-1 border-t border-[#1c3327]/60">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#6e8a7b] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#00df81]" /> Commercial Fit Score
              </span>
              <span className="font-bold text-white">
                <span className={event.fit_score >= 80 ? 'text-[#00df81]' : event.fit_score >= 65 ? 'text-[#a3e635]' : 'text-[#6e8a7b]'}>
                  {event.fit_score}
                </span>
                <span className="text-[10px] text-[#6e8a7b] font-normal"> / 100</span>
              </span>
            </div>
            <div className="w-full bg-[#15241c] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  event.fit_score >= 80
                    ? 'bg-[#00df81]'
                    : event.fit_score >= 65
                    ? 'bg-[#a3e635]'
                    : 'bg-[#6e8a7b]'
                }`}
                style={{ width: `${event.fit_score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Audience / Context Summary */}
        <p className="text-xs text-[#6e8a7b] line-clamp-2 mb-3">
          {event.recommendation || event.description || `Commercial opportunity at ${event.venue_name}.`}
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#1c3327] text-xs">
        <span className="text-[11px] text-[#6e8a7b]">
          Organiser: <strong className="text-[#f0fdf4] font-medium">{event.organizer_name}</strong>
        </span>

        <div className="flex items-center gap-2">
          {hasBookingUrl && (
            <a
              href={event.vendor_booking_url!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#00df81] hover:bg-[#00ff87] text-[#060b08] font-black rounded-lg text-xs shadow-md shadow-[#00df81]/20 transition"
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
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] border border-[#1c3327] hover:border-[#00df81]/40 text-xs font-semibold transition"
          >
            <span>Intel</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#00df81]" />
          </button>
        </div>
      </div>
    </div>
  );
}
