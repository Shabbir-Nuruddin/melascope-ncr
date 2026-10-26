'use client';

import React from 'react';
import { MelaEvent, UserStatus } from '@/types';
import {
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Layers,
  MapPin,
  Calendar,
  IndianRupee,
  Navigation,
  ChevronRight,
} from 'lucide-react';

interface EventTableViewProps {
  events: MelaEvent[];
  selectedEvent: MelaEvent | null;
  onSelectEvent: (event: MelaEvent) => void;
  onOpenDetails: (event: MelaEvent) => void;
  onStatusChange: (eventId: string, newStatus: UserStatus) => void;
}

export default function EventTableView({
  events,
  selectedEvent,
  onSelectEvent,
  onOpenDetails,
  onStatusChange,
}: EventTableViewProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#1c3327] bg-[#0c1510] shadow-xl">
      <table className="w-full text-left text-xs text-[#f0fdf4]">
        <thead className="bg-[#060b08] text-[11px] text-[#6e8a7b] uppercase font-mono tracking-wider border-b border-[#1c3327]">
          <tr>
            <th className="py-3 px-3">Fit</th>
            <th className="py-3 px-4 min-w-[240px]">Opportunity & Venue</th>
            <th className="py-3 px-3 min-w-[130px]">Dates (NCR)</th>
            <th className="py-3 px-3 min-w-[140px]">Stall Fee</th>
            <th className="py-3 px-3">Status / Verified</th>
            <th className="py-3 px-3 min-w-[130px]">Pipeline</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1c3327]">
          {events.map((ev) => {
            const isSelected = selectedEvent?.id === ev.id;
            const startDate = new Date(ev.start_at).toLocaleDateString('en-IN', {
              timeZone: 'Asia/Kolkata',
              month: 'short',
              day: 'numeric',
            });
            const endDate = new Date(ev.end_at).toLocaleDateString('en-IN', {
              timeZone: 'Asia/Kolkata',
              month: 'short',
              day: 'numeric',
            });

            const hasBooking = Boolean(
              ev.vendor_booking_url &&
              ev.booking_url_type !== 'none' &&
              ev.booking_url_type !== 'venue_website'
            );

            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${ev.latitude},${ev.longitude}`;

            return (
              <tr
                key={ev.id}
                onClick={() => onSelectEvent(ev)}
                className={`transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#15241c] text-white font-medium'
                    : 'hover:bg-[#121e17]'
                }`}
              >
                {/* Fit Score Pill */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <div
                    className={`inline-flex items-center justify-center font-black px-2 py-1 rounded-lg border text-xs ${
                      ev.fit_score >= 80
                        ? 'bg-[#00df81]/15 text-[#00df81] border-[#00df81]/40'
                        : ev.fit_score >= 65
                        ? 'bg-[#a3e635]/15 text-[#a3e635] border-[#a3e635]/40'
                        : 'bg-[#15241c] text-[#6e8a7b] border-[#1c3327]'
                    }`}
                  >
                    {ev.fit_score}
                  </div>
                </td>

                {/* Title & Venue */}
                <td className="py-3 px-4">
                  <div className="font-bold text-sm text-white group-hover:text-[#00df81] leading-snug">
                    {ev.title}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6e8a7b] mt-0.5">
                    <MapPin className="w-3 h-3 text-[#00df81] flex-shrink-0" />
                    <span>{ev.venue_name}, {ev.locality} ({ev.city})</span>
                    {ev.has_floor_plan && (
                      <span className="text-[10px] px-1 rounded bg-[#00df81]/15 text-[#00df81] border border-[#00df81]/30 flex items-center gap-0.5">
                        <Layers className="w-2.5 h-2.5" /> Plan
                      </span>
                    )}
                  </div>
                </td>

                {/* Dates */}
                <td className="py-3 px-3 whitespace-nowrap text-[#f0fdf4]">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-[#00df81]" />
                    <span>{startDate === endDate ? startDate : `${startDate} – ${endDate}`}</span>
                  </div>
                </td>

                {/* Stall Fee */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {ev.stall_fee_max ? (
                    <div className="font-semibold text-[#00df81]">
                      {ev.stall_fee_min && ev.stall_fee_min !== ev.stall_fee_max
                        ? `₹${ev.stall_fee_min.toLocaleString('en-IN')} – ₹${ev.stall_fee_max.toLocaleString('en-IN')}`
                        : `₹${ev.stall_fee_max.toLocaleString('en-IN')}`}
                    </div>
                  ) : (
                    <span className="text-[#6e8a7b] italic text-[11px]">Unannounced</span>
                  )}
                </td>

                {/* Verification Status */}
                <td className="py-3 px-3 whitespace-nowrap">
                  {ev.verification_status === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00df81]/15 text-[#00df81] border border-[#00df81]/30">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  ) : ev.verification_status === 'unverified' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/80">
                      <AlertTriangle className="w-3 h-3" /> Unverified
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#15241c] text-[#6e8a7b] border border-[#1c3327]">
                      Partial
                    </span>
                  )}
                </td>

                {/* Pipeline Status Selector */}
                <td className="py-3 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={ev.user_status}
                    onChange={(e) => onStatusChange(ev.id, e.target.value as UserStatus)}
                    className="text-[11px] font-semibold rounded-md px-2 py-1 bg-[#060b08] border border-[#1c3327] text-[#f0fdf4] focus:outline-none focus:border-[#00df81]"
                  >
                    <option value="new">New Lead</option>
                    <option value="saved">Saved</option>
                    <option value="contacted">Contacted</option>
                    <option value="applied">Applied</option>
                    <option value="booked">Booked</option>
                    <option value="rejected">Passed</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>

                {/* Action Buttons */}
                <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    {hasBooking && (
                      <a
                        href={ev.vendor_booking_url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-[#00df81] hover:bg-[#00ff87] text-[#060b08] font-black text-[11px] transition shadow"
                        title="Book stall directly"
                      >
                        Book
                      </a>
                    )}

                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-lg bg-[#0f1a14] hover:bg-[#15241c] text-[#6e8a7b] hover:text-[#00df81] border border-[#1c3327] transition"
                      title="Google Maps Directions"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => onOpenDetails(ev)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] border border-[#1c3327] hover:border-[#00df81]/40 text-xs font-semibold transition"
                    >
                      <span>Intel</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#00df81]" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
