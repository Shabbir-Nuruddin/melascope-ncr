'use client';

import React, { useState } from 'react';
import { MelaEvent, UserStatus, FloorPlan } from '@/types';
import FloorPlanViewer from './FloorPlanViewer';
import EnquiryDraftModal from './EnquiryDraftModal';
import {
  X,
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Edit3,
  Bookmark,
  Share2,
  Navigation,
  Info,
  Phone,
  Mail,
  HelpCircle,
  Sparkles,
  Link2,
  Layers,
  MessageSquare,
  Users,
  Ruler,
} from 'lucide-react';

interface EventDetailModalProps {
  event: MelaEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (eventId: string, newStatus: UserStatus) => void;
  onSaveNotes: (eventId: string, notes: string, nextActionAt?: string | null) => void;
  onRefreshSources: (eventId: string) => Promise<void>;
  onEdit: (event: MelaEvent) => void;
  onDelete: (eventId: string) => void;
  onAttachFloorPlan?: (eventId: string, floorPlan: FloorPlan) => void;
}

export default function EventDetailModal({
  event,
  isOpen,
  onClose,
  onStatusChange,
  onSaveNotes,
  onRefreshSources,
  onEdit,
  onDelete,
  onAttachFloorPlan,
}: EventDetailModalProps) {
  if (!isOpen || !event) return null;

  const [notes, setNotes] = useState(event.user_notes || '');
  const [nextActionDate, setNextActionDate] = useState(
    event.next_action_at ? event.next_action_at.slice(0, 10) : ''
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const startDateFormatted = new Date(event.start_at).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const endDateFormatted = new Date(event.end_at).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;

  const isVerified = event.verification_status === 'verified';
  const isUnverified = event.verification_status === 'unverified';

  const hasBookingUrl = Boolean(
    event.vendor_booking_url &&
    event.booking_url_type !== 'none' &&
    event.booking_url_type !== 'venue_website'
  );

  async function handleRefresh() {
    if (!event) return;
    setIsRefreshing(true);
    try {
      await onRefreshSources(event.id);
    } finally {
      setIsRefreshing(false);
    }
  }

  function handleSaveNotesSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;
    onSaveNotes(
      event.id,
      notes,
      nextActionDate ? new Date(nextActionDate).toISOString() : null
    );
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  }

  const breakdown = event.fit_breakdown || {};

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#060b08]/85 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-[#0c1510] border border-[#1c3327] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-start justify-between gap-4 p-5 border-b border-[#1c3327] bg-[#060b08]/70 sticky top-0 z-10 backdrop-blur">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                {/* Verification status pill */}
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#00df81]/15 text-[#00df81] border border-[#00df81]/30">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Event
                  </span>
                ) : isUnverified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/80">
                    <AlertTriangle className="w-3.5 h-3.5" /> Unverified Lead
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0f1a14] text-[#6e8a7b] border border-[#1c3327]">
                    Partially Verified
                  </span>
                )}

                {event.is_demo && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#15241c] text-[#00df81] border border-[#00df81]/30 uppercase tracking-wider">
                    Official Verified Seed
                  </span>
                )}

                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#0f1a14] text-[#6e8a7b] border border-[#1c3327] uppercase tracking-wider">
                  {event.event_type.replace('_', ' ')}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0f1a14] text-[#00df81] border border-[#1c3327]">
                  Context: {event.venue_context.toUpperCase()}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {event.title}
              </h2>

              <div className="flex items-center gap-2 text-xs text-[#6e8a7b] mt-1">
                <span>Organised by: <strong className="text-[#f0fdf4]">{event.organizer_name}</strong></span>
                <span>•</span>
                <span>Last verified: {new Date(event.last_verified_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Close & Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(event)}
                className="p-2 text-[#6e8a7b] hover:text-[#00df81] bg-[#0f1a14] hover:bg-[#15241c] border border-[#1c3327] rounded-lg transition"
                title="Edit Event"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this event?')) {
                    onDelete(event.id);
                    onClose();
                  }
                }}
                className="p-2 text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/80 border border-red-900/60 rounded-lg transition"
                title="Delete Event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[#6e8a7b] hover:text-white bg-[#0f1a14] hover:bg-[#15241c] border border-[#1c3327] rounded-lg transition"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
            {/* Key Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#060b08] border border-[#1c3327]">
              {/* Direct Booking / Registration CTA */}
              <div className="flex flex-wrap items-center gap-2.5">
                {hasBookingUrl ? (
                  <a
                    href={event.vendor_booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00df81] to-[#059669] hover:from-[#00ff87] hover:to-[#10b981] text-[#060b08] font-black rounded-xl text-sm shadow-lg shadow-[#00df81]/25 transition active:scale-95"
                  >
                    <span>Book Stall / Apply Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : event.booking_url_type === 'venue_website' && event.official_event_url ? (
                  <a
                    href={event.official_event_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] border border-[#1c3327] rounded-xl text-xs font-semibold"
                  >
                    <span>Open Venue Website (Not Booking Form)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <div className="text-xs text-amber-300 bg-amber-950/40 border border-amber-900/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>No direct booking form link published. Contact organiser directly.</span>
                  </div>
                )}

                {/* Request Missing Details Action */}
                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0f1a14] hover:bg-[#15241c] text-[#00df81] border border-[#00df81]/40 rounded-xl text-xs font-semibold transition"
                  title="Generate tailored WhatsApp or Email enquiry for missing details"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Request Missing Details</span>
                </button>

                {/* Google Maps Directions */}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] border border-[#1c3327] rounded-xl text-xs font-medium transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#00df81]" />
                  <span>Directions</span>
                </a>
              </div>

              {/* Re-verify Sources Action */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#0f1a14] hover:bg-[#15241c] text-[#6e8a7b] hover:text-[#f0fdf4] rounded-lg text-xs font-medium border border-[#1c3327] transition"
                title="Re-check event source URLs and update verified timestamp"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-[#00df81] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Re-checking...' : 'Re-verify Sources'}</span>
              </button>
            </div>

            {/* AI Fit Intelligence & Score Breakdown */}
            <div className="rounded-xl border border-[#1c3327] bg-[#060b08] p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#1c3327]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#00df81]" />
                    <h3 className="font-bold text-white text-base">
                      TETR Fit Assessment & Commercial Viability
                    </h3>
                  </div>
                  <p className="text-xs text-[#6e8a7b] max-w-xl">
                    Evaluated against your active product profile with transparent criteria weights.
                  </p>
                </div>

                {/* Total Score Display */}
                <div className="flex items-center gap-3 bg-[#0c1510] border border-[#00df81]/40 px-4 py-2 rounded-xl">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-[#6e8a7b]">Overall Fit</div>
                    <div className="text-xs font-semibold text-[#00df81] capitalize">{event.overall_confidence} Confidence</div>
                  </div>
                  <div className={`text-2xl font-black ${
                    event.fit_score >= 80 ? 'text-[#00df81]' : event.fit_score >= 65 ? 'text-[#a3e635]' : 'text-[#6e8a7b]'
                  }`}>
                    {event.fit_score}<span className="text-xs font-normal text-[#6e8a7b]">/100</span>
                  </div>
                </div>
              </div>

              {/* AI Recommendation Banner */}
              {event.recommendation && (
                <div className="mb-5 p-3.5 rounded-lg bg-[#0c1510] border border-[#00df81]/40 text-xs text-[#f0fdf4] leading-relaxed">
                  <strong className="text-[#00df81] font-bold block mb-1">Commercial Recommendation:</strong>
                  {event.recommendation}
                </div>
              )}

              {/* 6 Criteria Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-lg bg-[#0c1510] border border-[#1c3327]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">1. Product / Category Fit</span>
                    <span className="font-bold text-[#00df81]">{breakdown.product_fit?.score || 0} / {breakdown.product_fit?.max || 25}</span>
                  </div>
                  <p className="text-[11px] text-[#6e8a7b] leading-normal mb-1.5">{breakdown.product_fit?.rationale || 'Category matching.'}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0c1510] border border-[#1c3327]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">2. Audience & Spending Intent</span>
                    <span className="font-bold text-[#00df81]">{breakdown.audience_intent?.score || 0} / {breakdown.audience_intent?.max || 20}</span>
                  </div>
                  <p className="text-[11px] text-[#6e8a7b] leading-normal mb-1.5">{breakdown.audience_intent?.rationale || 'Audience profile analysis.'}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0c1510] border border-[#1c3327]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">3. Location & Logistics Context</span>
                    <span className="font-bold text-[#00df81]">{breakdown.location_context?.score || 0} / {breakdown.location_context?.max || 15}</span>
                  </div>
                  <p className="text-[11px] text-[#6e8a7b] leading-normal mb-1.5">{breakdown.location_context?.rationale || 'Venue reachability.'}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0c1510] border border-[#1c3327]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">4. Event Relevance & Evidence</span>
                    <span className="font-bold text-[#00df81]">{breakdown.event_relevance?.score || 0} / {breakdown.event_relevance?.max || 15}</span>
                  </div>
                  <p className="text-[11px] text-[#6e8a7b] leading-normal mb-1.5">{breakdown.event_relevance?.rationale || 'Verification level.'}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0c1510] border border-[#1c3327]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">5. Economics & Stall Fee Cap</span>
                    <span className="font-bold text-[#00df81]">{breakdown.economics?.score || 0} / {breakdown.economics?.max || 15}</span>
                  </div>
                  <p className="text-[11px] text-[#6e8a7b] leading-normal mb-1.5">{breakdown.economics?.rationale || 'Stall fee assessment.'}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0c1510] border border-[#1c3327]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">6. Booking Channel Readiness</span>
                    <span className="font-bold text-[#00df81]">{breakdown.booking_readiness?.score || 0} / {breakdown.booking_readiness?.max || 10}</span>
                  </div>
                  <p className="text-[11px] text-[#6e8a7b] leading-normal mb-1.5">{breakdown.booking_readiness?.rationale || 'Application channel analysis.'}</p>
                </div>
              </div>
            </div>

            {/* CORE REQUIREMENT: VENUE MAP AND INTERNAL FLOOR PLAN SECTION */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00df81]" />
                <span>Venue & Layout Intelligence</span>
              </h3>

              {/* Internal Floor Plan Viewer */}
              <FloorPlanViewer
                event={event}
                onAttachFloorPlan={(evId, plan) => {
                  if (onAttachFloorPlan) onAttachFloorPlan(evId, plan);
                }}
                onRequestFloorPlan={() => setIsEnquiryModalOpen(true)}
              />
            </div>

            {/* Event Details & Logistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left: Venue & Footfall */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#060b08] border border-[#1c3327] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e8a7b]">Venue & Location</h4>
                  <div className="flex items-start gap-2 text-xs">
                    <MapPin className="w-4 h-4 text-[#00df81] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-[#f0fdf4]">{event.venue_name}</div>
                      <div className="text-[#6e8a7b]">{event.address}</div>
                      <div className="text-[#6e8a7b]">{event.locality}, {event.city}, {event.state}</div>
                    </div>
                  </div>
                </div>

                {/* Footfall & Audience Intelligence */}
                <div className="p-4 rounded-xl bg-[#060b08] border border-[#1c3327] space-y-2 text-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e8a7b] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#00df81]" />
                    <span>Footfall & Audience Intelligence</span>
                  </h4>
                  <div className="text-[#f0fdf4]">
                    <strong>Expected Attendance:</strong> {event.expected_footfall_text || 'Unknown — ask organiser'}
                  </div>
                  {event.historical_attendance_info && (
                    <div className="text-[#6e8a7b] text-[11px]">
                      <strong>Historical Record:</strong> {event.historical_attendance_info}
                    </div>
                  )}
                  {event.target_audience_demographics && (
                    <div className="text-[#6e8a7b] text-[11px]">
                      <strong>Audience Profile:</strong> {event.target_audience_demographics}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Stall Dimensions & Commercials */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#060b08] border border-[#1c3327] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e8a7b] flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-[#00df81]" />
                    <span>Stall Specifications & Commercials</span>
                  </h4>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6e8a7b]">Stall Fee Range:</span>
                    <span className="text-[#00df81] font-bold text-sm">
                      {event.stall_fee_max ? `₹${event.stall_fee_min?.toLocaleString('en-IN')} – ₹${event.stall_fee_max?.toLocaleString('en-IN')}` : 'Undisclosed'}
                    </span>
                  </div>

                  {event.stall_width_ft && event.stall_depth_ft && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6e8a7b]">Stall Dimensions:</span>
                      <span className="text-[#f0fdf4] font-semibold">
                        {event.stall_width_ft} ft × {event.stall_depth_ft} ft ({event.stall_area_sqft || event.stall_width_ft * event.stall_depth_ft} sq ft)
                      </span>
                    </div>
                  )}

                  {event.security_deposit && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6e8a7b]">Refundable Deposit:</span>
                      <span className="text-[#f0fdf4]">₹{event.security_deposit.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {event.included_facilities && event.included_facilities.length > 0 && (
                    <div className="pt-2 border-t border-[#1c3327]">
                      <span className="text-[11px] text-[#6e8a7b] block mb-1">Included Facilities:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {event.included_facilities.map((fac, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#0f1a14] text-[#00df81] border border-[#1c3327]">
                            ✓ {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Organiser Contact Details */}
                <div className="p-4 rounded-xl bg-[#060b08] border border-[#1c3327] space-y-2 text-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e8a7b]">Organiser Contacts</h4>
                  <div className="text-white font-medium">{event.organizer_name}</div>
                  {event.organizer_phone && (
                    <div className="flex items-center gap-1.5 text-[#f0fdf4]">
                      <Phone className="w-3.5 h-3.5 text-[#00df81]" />
                      <span>{event.organizer_phone}</span>
                    </div>
                  )}
                  {event.organizer_email && (
                    <div className="flex items-center gap-1.5 text-[#f0fdf4]">
                      <Mail className="w-3.5 h-3.5 text-[#00df81]" />
                      <span>{event.organizer_email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Notes & Personal Pipeline Tracker */}
            <div className="p-4 rounded-xl bg-[#060b08] border border-[#1c3327] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e8a7b] flex items-center justify-between">
                <span>Personal Pipeline Tracker & Notes</span>
                {notesSaved && <span className="text-[#00df81] text-xs font-normal">✓ Saved successfully</span>}
              </h4>

              <form onSubmit={handleSaveNotesSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-[#6e8a7b] block mb-1">Opportunity Status</label>
                    <select
                      value={event.user_status}
                      onChange={(e) => onStatusChange(event.id, e.target.value as UserStatus)}
                      className="w-full bg-[#0c1510] border border-[#1c3327] rounded-lg p-2 text-[#f0fdf4] focus:outline-none focus:border-[#00df81]"
                    >
                      <option value="new">New Opportunity</option>
                      <option value="saved">Saved / Bookmarked</option>
                      <option value="contacted">Contacted Organiser</option>
                      <option value="applied">Application Submitted</option>
                      <option value="booked">Stall Confirmed / Booked</option>
                      <option value="rejected">Passed / Rejected</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#6e8a7b] block mb-1">Next Action Date</label>
                    <input
                      type="date"
                      value={nextActionDate}
                      onChange={(e) => setNextActionDate(e.target.value)}
                      className="w-full bg-[#0c1510] border border-[#1c3327] rounded-lg p-2 text-[#f0fdf4] focus:outline-none focus:border-[#00df81]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#6e8a7b] block mb-1">Internal Notes & Reminders</label>
                  <textarea
                    rows={2}
                    placeholder="Record discussions with organisers, table requirements, electrical power needs, fee negotiations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#0c1510] border border-[#1c3327] rounded-lg p-2 text-xs text-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#00df81] focus:border-[#00df81]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#00df81] hover:bg-[#00ff87] text-[#060b08] font-bold rounded-lg text-xs shadow transition"
                  >
                    Save Tracker Notes
                  </button>
                </div>
              </form>
            </div>

            {/* Source Citations & Audit Trail */}
            <div className="p-4 rounded-xl bg-[#060b08] border border-[#1c3327] space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e8a7b]">
                Verified Source Citations ({event.source_urls?.length || 0})
              </h4>
              <div className="space-y-2">
                {event.source_urls?.map((src, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-[#0c1510] border border-[#1c3327] text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#00df81] hover:underline flex items-center gap-1 truncate"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{src.title || src.url}</span>
                      </a>
                      <span className="text-[10px] text-[#6e8a7b] flex-shrink-0">
                        Type: {src.source_type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Draft Modal */}
      <EnquiryDraftModal
        event={event}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        onApplyReplyText={(reply) => {
          onSaveNotes(event.id, `${notes}\n\n[Organiser Reply Received]: ${reply}`);
        }}
      />
    </>
  );
}
