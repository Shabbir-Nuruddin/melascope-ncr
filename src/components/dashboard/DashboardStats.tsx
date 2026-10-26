'use client';

import React from 'react';
import { MelaEvent } from '@/types';
import {
  ShieldCheck,
  Sparkles,
  Layers,
  Clock,
  HelpCircle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface DashboardStatsProps {
  events: MelaEvent[];
  onFilterMissingPrices: () => void;
  onFilterFloorPlans: () => void;
  onFilterDeadlines: () => void;
  onScoutNow: () => void;
  isScouting: boolean;
}

export default function DashboardStats({
  events,
  onFilterMissingPrices,
  onFilterFloorPlans,
  onFilterDeadlines,
  onScoutNow,
  isScouting,
}: DashboardStatsProps) {
  const verifiedCount = events.filter((e) => e.verification_status === 'verified').length;
  const withFloorPlansCount = events.filter((e) => e.has_floor_plan).length;
  const missingPricesCount = events.filter(
    (e) => e.stall_fee_max === null || e.stall_fee_max === undefined
  ).length;

  // Deadlines within next 7 days
  const nowMs = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const deadlinesClosingCount = events.filter((e) => {
    if (!e.application_deadline) return false;
    const dlMs = new Date(e.application_deadline).getTime();
    return dlMs >= nowMs && dlMs <= nowMs + weekMs;
  }).length;

  return (
    <div className="bg-white border-b border-[#e2ece6] px-4 py-3.5 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-7xl mx-auto">
        {/* Widget 1: Verified Upcoming */}
        <div className="bg-[#f8faf8] border border-[#e2ece6] rounded-xl p-3 flex flex-col justify-between hover:border-[#a7f3d0] transition shadow-xs">
          <div className="flex items-center justify-between text-[#52796f] text-[11px] mb-1">
            <span className="font-semibold">Verified Events</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
          </div>
          <div className="text-xl font-black text-[#0f291e] leading-none">
            {verifiedCount}
            <span className="text-xs font-normal text-[#52796f] ml-1">/ {events.length}</span>
          </div>
        </div>

        {/* Widget 2: Deadlines Closing Soon */}
        <div
          onClick={onFilterDeadlines}
          className="bg-[#fffbeb] hover:bg-[#fef3c7] border border-[#fde68a] rounded-xl p-3 flex flex-col justify-between cursor-pointer transition group shadow-xs"
        >
          <div className="flex items-center justify-between text-[#92400e] text-[11px] mb-1">
            <span className="font-semibold group-hover:text-[#b45309] transition">Deadlines &lt; 7 Days</span>
            <Clock className="w-3.5 h-3.5 text-[#d97706]" />
          </div>
          <div className="text-xl font-black text-[#b45309] leading-none">
            {deadlinesClosingCount}
          </div>
        </div>

        {/* Widget 3: Floor Plans Available */}
        <div
          onClick={onFilterFloorPlans}
          className="bg-[#ecfdf5] hover:bg-[#d1fae5] border border-[#a7f3d0] rounded-xl p-3 flex flex-col justify-between cursor-pointer transition group shadow-xs"
        >
          <div className="flex items-center justify-between text-[#065f46] text-[11px] mb-1">
            <span className="font-semibold group-hover:text-[#047857] transition">Floor Plans Ready</span>
            <Layers className="w-3.5 h-3.5 text-[#059669]" />
          </div>
          <div className="text-xl font-black text-[#059669] leading-none">
            {withFloorPlansCount}
          </div>
        </div>

        {/* Widget 4: Missing Stall Fees */}
        <div
          onClick={onFilterMissingPrices}
          className="bg-[#f8faf8] hover:bg-[#f0fdf4] border border-[#e2ece6] hover:border-[#a7f3d0] rounded-xl p-3 flex flex-col justify-between cursor-pointer transition shadow-xs"
        >
          <div className="flex items-center justify-between text-[#52796f] text-[11px] mb-1">
            <span className="font-semibold">Fee Unannounced</span>
            <HelpCircle className="w-3.5 h-3.5 text-[#52796f]" />
          </div>
          <div className="text-xl font-black text-[#52796f] leading-none">
            {missingPricesCount}
          </div>
        </div>

        {/* Widget 5: Coverage Horizon */}
        <div className="bg-[#f8faf8] border border-[#e2ece6] rounded-xl p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[#52796f] text-[11px] mb-1">
            <span className="font-semibold">Season Horizon</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#059669]" />
          </div>
          <div className="text-sm font-bold text-[#0f291e] leading-none">
            Nov – Dec 23
            <span className="block text-[10px] text-[#52796f] font-normal mt-0.5">Peak NCR Season</span>
          </div>
        </div>

        {/* Widget 6: AI Quick Scout Button */}
        <button
          onClick={onScoutNow}
          disabled={isScouting}
          className="bg-gradient-to-br from-[#ecfdf5] to-[#d1fae5] hover:from-[#d1fae5] hover:to-[#a7f3d0] border border-[#a7f3d0] rounded-xl p-3 flex flex-col justify-between transition group text-left cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-[11px] text-[#059669]">
            <span className="font-black flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#059669]" />
              TETR Scout
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#059669] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
          <div className="text-xs font-bold text-[#0f291e] leading-tight">
            {isScouting ? 'Scouting Live...' : 'Auto-Scout Melas'}
          </div>
        </button>
      </div>
    </div>
  );
}
