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
  { id: 'all', label: 'All Opportunities', countColor: 'text-slate-300' },
  { id: 'saved', label: 'Saved', countColor: 'text-amber-400' },
  { id: 'contacted', label: 'Contacted', countColor: 'text-purple-400' },
  { id: 'applied', label: 'Applied', countColor: 'text-blue-400' },
  { id: 'booked', label: 'Booked / Confirmed', countColor: 'text-emerald-400' },
  { id: 'rejected', label: 'Passed / Rejected', countColor: 'text-red-400' },
  { id: 'archived', label: 'Archived', countColor: 'text-slate-500' },
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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 p-4 sm:p-6 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <span>Saved Opportunities & Vendor Pipeline</span>
          </h2>
          <p className="text-xs text-slate-400">
            Track stall applications, organiser communications, and confirmed bookings across Delhi NCR.
          </p>
        </div>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-300" />
          <span>Export Pipeline CSV</span>
        </button>
      </div>

      {/* Pipeline Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs">
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
                  ? 'bg-slate-800 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
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
          <div className="text-center py-16 text-slate-500 space-y-2">
            <Bookmark className="w-10 h-10 mx-auto text-slate-700" />
            <p className="text-sm">No opportunities currently in "{activeTab}" status.</p>
            <p className="text-xs text-slate-600">
              Browse the Map Dashboard to discover and bookmark upcoming Delhi NCR events.
            </p>
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl shadow-sm transition flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
            >
              {/* Left Column: Event details */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                    {ev.event_type.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {ev.locality}, {ev.city}
                  </span>
                  {ev.application_deadline && (
                    <span className="text-[10px] font-medium text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Deadline: {new Date(ev.application_deadline).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-white text-base hover:text-amber-400 transition">
                  {ev.title}
                </h4>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {ev.venue_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {new Date(ev.start_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                    {ev.stall_fee_max ? `₹${ev.stall_fee_min?.toLocaleString('en-IN')} – ₹${ev.stall_fee_max?.toLocaleString('en-IN')}` : 'Fee unannounced'}
                  </span>
                </div>

                {ev.user_notes && (
                  <div className="text-xs text-amber-300/80 bg-slate-950/80 p-2 rounded-lg border border-slate-800 italic">
                    "{ev.user_notes}"
                  </div>
                )}
              </div>

              {/* Right Column: Status Selector & View Action */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <select
                  value={ev.user_status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onStatusChange(ev.id, e.target.value as UserStatus)}
                  className="bg-slate-950 border border-slate-700 text-xs text-slate-200 font-semibold rounded-lg p-2"
                >
                  <option value="new">Status: New</option>
                  <option value="saved">Status: Saved</option>
                  <option value="contacted">Status: Contacted</option>
                  <option value="applied">Status: Applied</option>
                  <option value="booked">Status: Booked</option>
                  <option value="rejected">Status: Rejected</option>
                  <option value="archived">Status: Archived</option>
                </select>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(ev);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition"
                >
                  <span>Open</span>
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
