'use client';

import React, { useState } from 'react';
import { MelaEvent, UserStatus } from '@/types';
import {
  Bookmark,
  Calendar,
  MapPin,
  IndianRupee,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Download,
  AlertTriangle,
} from 'lucide-react';

interface PipelineViewProps {
  events: MelaEvent[];
  onSelectEvent: (event: MelaEvent) => void;
  onStatusChange: (eventId: string, newStatus: UserStatus) => void;
  onOpenDetails: (event: MelaEvent) => void;
  onExportCsv: () => void;
}

const PIPELINE_STATUSES: { id: UserStatus | 'all'; label: string; countColor: string }[] = [
  { id: 'all', label: 'All Opportunities', countColor: 'text-[#f0fdf4]' },
  { id: 'saved', label: 'Saved', countColor: 'text-[#00df81]' },
  { id: 'contacted', label: 'Contacted', countColor: 'text-purple-400' },
  { id: 'applied', label: 'Applied', countColor: 'text-blue-400' },
  { id: 'booked', label: 'Booked / Confirmed', countColor: 'text-[#00ff87]' },
  { id: 'rejected', label: 'Passed / Rejected', countColor: 'text-red-400' },
  { id: 'archived', label: 'Archived', countColor: 'text-[#6e8a7b]' },
];

export default function PipelineView({
  events,
  onSelectEvent,
  onStatusChange,
  onOpenDetails,
  onExportCsv,
}: PipelineViewProps) {
  const [activeTab, setActiveTab] = useState<UserStatus | 'all'>('saved');

  const filteredEvents = activeTab === 'all'
    ? events
    : events.filter((e) => e.user_status === activeTab);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#060b08] p-4 sm:p-6 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1c3327]">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#00df81]" />
            <span>TETR Commercial Pipeline Tracker</span>
          </h2>
          <p className="text-xs text-[#6e8a7b]">
            Track stall applications, organiser communications, and confirmed bookings across Delhi NCR.
          </p>
        </div>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] border border-[#1c3327] rounded-lg text-xs font-medium self-start sm:self-auto transition"
        >
          <Download className="w-4 h-4 text-[#6e8a7b]" />
          <span>Export Pipeline CSV</span>
        </button>
      </div>

      {/* Pipeline Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-[#0c1510] p-1.5 rounded-xl border border-[#1c3327] text-xs">
        {PIPELINE_STATUSES.map((tab) => {
          const count = tab.id === 'all'
            ? events.length
            : events.filter((e) => e.user_status === tab.id).length;

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 transition ${
                isActive
                  ? 'bg-[#15241c] text-[#f0fdf4] border border-[#00df81]/40 shadow-sm font-semibold'
                  : 'text-[#6e8a7b] hover:text-[#f0fdf4] hover:bg-[#0f1a14]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[11px] font-bold ${tab.countColor}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 text-[#6e8a7b] space-y-2">
            <Bookmark className="w-10 h-10 mx-auto text-[#1c3327]" />
            <p className="text-sm">No opportunities currently in "{activeTab}" status.</p>
            <p className="text-xs text-[#6e8a7b]">
              Browse the Map Dashboard to discover and bookmark upcoming Delhi NCR events.
            </p>
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              className="bg-[#0c1510] border border-[#1c3327] hover:border-[#284b39] p-4 rounded-xl shadow-sm transition flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
            >
              {/* Left Column: Event details */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0f1a14] text-[#6e8a7b] uppercase border border-[#1c3327]">
                    {ev.event_type.replace('_', ' ')}
                  </span>
                  {ev.verification_status === 'verified' && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00df81]/15 text-[#00df81] border border-[#00df81]/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                  <span className="text-xs text-[#6e8a7b]">{ev.locality}, {ev.city}</span>
                </div>

                <h3 className="text-base font-bold text-white hover:text-[#00df81] transition">
                  {ev.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-[#6e8a7b] flex-wrap">
                  <div className="flex items-center gap-1 text-[#f0fdf4]">
                    <Calendar className="w-3.5 h-3.5 text-[#00df81]" />
                    <span>
                      {new Date(ev.start_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[#f0fdf4]">
                    <IndianRupee className="w-3.5 h-3.5 text-[#00df81]" />
                    <span>
                      {ev.stall_fee_max ? `₹${ev.stall_fee_min?.toLocaleString('en-IN')} - ₹${ev.stall_fee_max?.toLocaleString('en-IN')}` : 'Undisclosed'}
                    </span>
                  </div>

                  {ev.application_deadline && (
                    <div className="flex items-center gap-1 text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Deadline: {new Date(ev.application_deadline).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                </div>

                {/* Notes preview */}
                {ev.user_notes && (
                  <p className="text-xs text-[#6e8a7b] bg-[#060b08] border border-[#1c3327] p-2 rounded-lg italic line-clamp-1">
                    "{ev.user_notes}"
                  </p>
                )}
              </div>

              {/* Right Column: Status changer & actions */}
              <div
                className="flex items-center gap-3 self-end md:self-center"
                onClick={(e) => e.stopPropagation()}
              >
                <select
                  value={ev.user_status}
                  onChange={(e) => onStatusChange(ev.id, e.target.value as UserStatus)}
                  className="bg-[#060b08] border border-[#1c3327] text-xs font-semibold rounded-lg px-2.5 py-1.5 text-[#f0fdf4] focus:outline-none focus:border-[#00df81]"
                >
                  <option value="new">New</option>
                  <option value="saved">Saved</option>
                  <option value="contacted">Contacted</option>
                  <option value="applied">Applied</option>
                  <option value="booked">Booked</option>
                  <option value="rejected">Passed</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  onClick={() => onOpenDetails(ev)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#0f1a14] hover:bg-[#15241c] text-[#00df81] border border-[#00df81]/30 rounded-lg text-xs font-semibold transition"
                >
                  <span>Intel</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
