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
  Bookmark,
  CheckCircle,
  FileText,
  Layers,
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

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-[#15241c] border-[#00df81] ring-2 ring-[#00df81]/30 shadow-xl shadow-[#00df81]/10'
          : 'bg-[#0f1a14] hover:bg-[#121e17] border-[#1c3327] hover:border-[#284b39] shadow-sm'
      }`}
    >
      {/* Top Bar: Verification, Event Type, Pipeline Status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Verification Badge */}
          {isVerified ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00df81]/15 text-[#00df81] border border-[#00df81]/30">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          ) : isUnverified ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/80">
              <AlertTriangle className="w-3 h-3" />
              Unverified Lead
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0c1510] text-[#6e8a7b] border border-[#1c3327]">
              Partially Verified
            </span>
          )}

          {/* Type Badge */}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#0c1510] text-[#6e8a7b] border border-[#1c3327] uppercase tracking-wider">
            {event.event_type.replace('_', ' ')}
          </span>

          {/* Floor Plan Indicator */}
          {event.has_floor_plan && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#00df81]/10 text-[#00df81] border border-[#00df81]/25">
              <Layers className="w-2.5 h-2.5" /> Plan
            </span>
          )}
        </div>

        {/* User Pipeline Status Dropdown */}
        <select
          value={event.user_status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStatusChange(e.target.value as UserStatus)}
          className={`text-[11px] font-semibold rounded-md px-2 py-0.5 border cursor-pointer focus:outline-none transition ${
            event.user_status === 'saved'
              ? 'bg-[#15241c] text-[#00df81] border-[#00df81]/40'
              : event.user_status === 'applied'
              ? 'bg-blue-950/80 text-blue-300 border-blue-800'
              : event.user_status === 'booked'
              ? 'bg-[#00df81]/20 text-[#00df81] border-[#00df81]'
              : event.user_status === 'contacted'
              ? 'bg-purple-950/80 text-purple-300 border-purple-800'
              : 'bg-[#060b08] text-[#6e8a7b] border-[#1c3327]'
          }`}
        >
          <option value="new">New Lead</option>
          <option value="saved">Saved</option>
          <option value="contacted">Contacted</option>
          <option value="applied">Applied</option>
          <option value="booked">Booked</option>
          <option value="rejected">Passed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Event Title */}
      <h3 className="font-bold text-base text-white group-hover:text-[#00df81] transition leading-snug mb-1">
        {event.title}
      </h3>

      {/* Venue & Locality */}
      <div className="flex items-center gap-1.5 text-xs text-[#6e8a7b] mb-2.5">
        <MapPin className="w-3.5 h-3.5 text-[#00df81] flex-shrink-0" />
        <span className="truncate">{event.venue_name}, {event.locality}</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0c1510] text-[#6e8a7b] border border-[#1c3327]">
          {event.city}
        </span>
      </div>

      {/* Date & Stall Fee Row */}
      <div className="grid grid-cols-2 gap-2 py-2 border-t border-b border-[#1c3327] my-2 text-xs">
        {/* Date Window */}
        <div className="flex items-center gap-1.5 text-[#f0fdf4]">
          <Calendar className="w-3.5 h-3.5 text-[#00df81]" />
          <span>{startDate === endDate ? startDate : `${startDate} - ${endDate}`}</span>
        </div>

        {/* Stall Fee */}
        <div className="flex items-center gap-1 text-[#f0fdf4] font-medium justify-end">
          <IndianRupee className="w-3.5 h-3.5 text-[#00df81]" />
          {event.stall_fee_max ? (
            <span>
              {event.stall_fee_min && event.stall_fee_min !== event.stall_fee_max
                ? `₹${event.stall_fee_min.toLocaleString('en-IN')} - ₹${event.stall_fee_max.toLocaleString('en-IN')}`
                : `₹${event.stall_fee_max.toLocaleString('en-IN')}`}
            </span>
          ) : (
            <span className="text-[#6e8a7b] italic text-[11px]">Fee unannounced</span>
          )}
        </div>
      </div>

      {/* Bottom Bar: AI Fit Score & Action Links */}
      <div className="flex items-center justify-between pt-1 text-xs">
        {/* AI Fit Score */}
        <div className="flex items-center gap-2">
          <div
            className={`px-2 py-1 rounded-lg font-black text-xs flex items-center gap-1 border ${
              event.fit_score >= 80
                ? 'bg-[#00df81]/15 text-[#00df81] border-[#00df81]/40 shadow-sm shadow-[#00df81]/20'
                : event.fit_score >= 65
                ? 'bg-[#a3e635]/15 text-[#a3e635] border-[#a3e635]/40'
                : 'bg-[#0c1510] text-[#6e8a7b] border-[#1c3327]'
            }`}
          >
            <span>Fit:</span>
            <span>{event.fit_score}/100</span>
          </div>

          <span className="text-[10px] text-[#6e8a7b] capitalize hidden sm:inline">
            {event.overall_confidence} conf.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {hasBookingUrl && (
            <a
              href={event.vendor_booking_url!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00df81] hover:text-[#00ff87] hover:underline"
              title="Open Official Vendor Application Form"
            >
              <span>Book</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0c1510] hover:bg-[#1c3327] text-[#f0fdf4] border border-[#1c3327] hover:border-[#00df81]/50 text-xs font-semibold transition"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#00df81]" />
          </button>
        </div>
      </div>
    </div>
  );
}
