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
          ? 'bg-slate-800/90 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
          : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700 shadow-sm'
      }`}
    >
      {/* Top Bar: Verification, Event Type, Pipeline Status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Verification Badge */}
          {isVerified ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          ) : isUnverified ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/80">
              <AlertTriangle className="w-3 h-3" />
              Unverified Lead
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              Partially Verified
            </span>
          )}

          {/* Type Badge */}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 uppercase tracking-wider">
            {event.event_type.replace('_', ' ')}
          </span>
        </div>

        {/* User Pipeline Status Dropdown */}
        <select
          value={event.user_status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStatusChange(e.target.value as UserStatus)}
          className={`text-[11px] font-semibold rounded-md px-2 py-0.5 border cursor-pointer focus:outline-none transition ${
            event.user_status === 'saved'
              ? 'bg-amber-950/80 text-amber-300 border-amber-800'
              : event.user_status === 'applied'
              ? 'bg-blue-950/80 text-blue-300 border-blue-800'
              : event.user_status === 'booked'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : event.user_status === 'contacted'
              ? 'bg-purple-950/80 text-purple-300 border-purple-800'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <option value="new">Status: New</option>
          <option value="saved">Saved</option>
          <option value="contacted">Contacted</option>
          <option value="applied">Applied</option>
          <option value="booked">Booked</option>
          <option value="rejected">Rejected</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Main Row: Title & Score Badge */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-amber-400 transition">
          {event.title}
        </h3>

        {/* AI Fit Score Pill */}
        <div
          className={`flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl border text-center shadow-inner ${
            event.fit_score >= 80
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-400'
              : event.fit_score >= 65
              ? 'bg-amber-950/50 border-amber-500/60 text-amber-400'
              : 'bg-slate-800/80 border-slate-700 text-slate-400'
          }`}
          title={`AI Fit Score: ${event.fit_score}/100 (${event.overall_confidence} confidence)`}
        >
          <span className="font-black text-sm leading-none">{event.fit_score}</span>
          <span className="text-[9px] uppercase tracking-tighter opacity-80 mt-0.5">FIT</span>
        </div>
      </div>

      {/* Venue & Locality */}
      <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1.5">
        <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span className="font-medium text-slate-200">{event.venue_name}</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-400">{event.locality}, {event.city}</span>
      </div>

      {/* Date & Hours */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2.5">
        <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        <span>{startDate} – {endDate}</span>
        {event.opening_hours && (
          <>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400">{event.opening_hours}</span>
          </>
        )}
      </div>

      {/* Commercials: Stall Fee & Booking Readiness */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-800 text-xs">
        {/* Stall Fee */}
        <div className="flex items-center gap-1">
          <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
          {event.stall_fee_max ? (
            <span className="font-semibold text-slate-200">
              ₹{event.stall_fee_min?.toLocaleString('en-IN') || 0} – ₹{event.stall_fee_max?.toLocaleString('en-IN')}
            </span>
          ) : (
            <span className="text-slate-500 italic">Fee unannounced</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {hasBookingUrl && (
            <a
              href={event.vendor_booking_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow transition"
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
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition"
          >
            <span>Details</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
