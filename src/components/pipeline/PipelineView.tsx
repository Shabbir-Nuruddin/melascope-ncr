'use client';

import React, { useState } from 'react';
import { MelaEvent, UserStatus } from '@/types';
import {
  Bookmark,
  Calendar,
  MapPin,
  IndianRupee,
  Clock,
  ChevronRight,
  ShieldCheck,
  Download,
} from 'lucide-react';

interface PipelineViewProps {
  events: MelaEvent[];
  onSelectEvent: (event: MelaEvent) => void;
  onStatusChange: (eventId: string, newStatus: UserStatus) => void;
  onOpenDetails: (event: MelaEvent) => void;
  onExportCsv: () => void;
}

const PIPELINE_STATUSES: { id: UserStatus | 'all'; label: string; countColor: string }[] = [
  { id: 'all', label: 'All Opportunities', countColor: 'text-[#0f291e]' },
  { id: 'saved', label: 'Saved', countColor: 'text-[#059669]' },
  { id: 'contacted', label: 'Contacted', countColor: 'text-purple-600' },
  { id: 'applied', label: 'Applied', countColor: 'text-blue-600' },
  { id: 'booked', label: 'Booked / Confirmed', countColor: 'text-[#059669]' },
  { id: 'rejected', label: 'Passed / Rejected', countColor: 'text-red-600' },
  { id: 'archived', label: 'Archived', countColor: 'text-[#64748b]' },
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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f8f5] p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2ece6]">
        <div>
          <h2 className="text-xl font-black text-[#0f291e] flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#059669]" />
            <span>TETR Commercial Pipeline Tracker</span>
          </h2>
          <p className="text-xs text-[#52796f]">
            Track stall applications, organiser communications, and confirmed bookings across Delhi NCR.
          </p>
        </div>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f0fdf4] text-[#0f291e] border border-[#e2ece6] rounded-xl text-xs font-semibold self-start sm:self-auto transition shadow-xs"
        >
          <Download className="w-4 h-4 text-[#52796f]" />
          <span>Export Pipeline CSV</span>
        </button>
      </div>

      {/* Pipeline Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border border-[#e2ece6] text-xs shadow-xs">
        {PIPELINE_STATUSES.map((tab) => {
          const count = tab.id === 'all'
            ? events.length
            : events.filter((e) => e.user_status === tab.id).length;

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-2 transition ${
                isActive
                  ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] shadow-xs'
                  : 'text-[#52796f] hover:text-[#0f291e] hover:bg-[#f8faf8]'
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
          <div className="text-center py-20 text-[#52796f] space-y-2 bg-white rounded-2xl border border-[#e2ece6] p-8">
            <Bookmark className="w-10 h-10 mx-auto text-[#cbd5e1]" />
            <p className="text-sm font-semibold text-[#0f291e]">No opportunities currently in "{activeTab}" status.</p>
            <p className="text-xs text-[#52796f]">
              Browse the Opportunities Hub to discover and bookmark upcoming Delhi NCR events.
            </p>
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              className="bg-white border border-[#e2ece6] hover:border-[#a7f3d0] p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
            >
              {/* Left Column: Event details */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f8faf8] text-[#52796f] uppercase border border-[#e2ece6] font-semibold">
                    {ev.event_type.replace('_', ' ')}
                  </span>
                  {ev.verification_status === 'verified' && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                  <span className="text-xs text-[#52796f]">{ev.locality}, {ev.city}</span>
                </div>

                <h3 className="text-base font-bold text-[#0f291e] hover:text-[#059669] transition">
                  {ev.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-[#52796f] flex-wrap">
                  <div className="flex items-center gap-1 text-[#0f291e]">
                    <Calendar className="w-3.5 h-3.5 text-[#059669]" />
                    <span className="font-medium">
                      {new Date(ev.start_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[#059669] font-bold">
                    <IndianRupee className="w-3.5 h-3.5 text-[#059669]" />
                    <span>
                      {ev.stall_fee_max ? `₹${ev.stall_fee_min?.toLocaleString('en-IN')} - ₹${ev.stall_fee_max?.toLocaleString('en-IN')}` : 'Undisclosed'}
                    </span>
                  </div>

                  {ev.application_deadline && (
                    <div className="flex items-center gap-1 text-[#b45309]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Deadline: {new Date(ev.application_deadline).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                </div>

                {/* Notes preview */}
                {ev.user_notes && (
                  <p className="text-xs text-[#52796f] bg-[#f8faf8] border border-[#e2ece6] p-2.5 rounded-xl italic line-clamp-1">
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
                  className="bg-[#f8faf8] border border-[#e2ece6] text-xs font-semibold rounded-xl px-3 py-1.5 text-[#0f291e] focus:outline-none focus:border-[#059669]"
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
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#059669] border border-[#a7f3d0] rounded-xl text-xs font-bold transition shadow-xs"
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
