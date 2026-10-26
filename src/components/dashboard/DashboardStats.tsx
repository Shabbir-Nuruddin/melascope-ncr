'use client';

import React from 'react';
import { MelaEvent } from '@/types';
import {
  ShieldCheck,
  Sparkles,
  Layers,
  Clock,
  HelpCircle,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  Search,
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
    <div className="bg-[#060b08]/80 border-b border-[#1c3327] px-4 py-3 backdrop-blur-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Widget 1: Verified Upcoming */}
        <div className="bg-[#0c1510] border border-[#1c3327] rounded-xl p-3 flex flex-col justify-between hover:border-[#00df81]/40 transition">
          <div className="flex items-center justify-between text-[#6e8a7b] text-[11px] mb-1">
            <span className="font-medium">Verified Events</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#00df81]" />
          </div>
          <div className="text-xl font-black text-white leading-none">
            {verifiedCount}
            <span className="text-xs font-normal text-[#6e8a7b] ml-1">/ {events.length}</span>
          </div>
        </div>

        {/* Widget 2: Deadlines Closing Soon */}
        <div
          onClick={onFilterDeadlines}
          className="bg-[#0c1510] hover:bg-[#121e17] border border-[#1c3327] hover:border-[#a3e635]/60 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-[#6e8a7b] text-[11px] mb-1">
            <span className="font-medium group-hover:text-[#a3e635] transition">Deadlines &lt; 7 Days</span>
            <Clock className="w-3.5 h-3.5 text-[#a3e635]" />
          </div>
          <div className="text-xl font-black text-[#a3e635] leading-none">
            {deadlinesClosingCount}
          </div>
        </div>

        {/* Widget 3: Floor Plans Available */}
        <div
          onClick={onFilterFloorPlans}
          className="bg-[#0c1510] hover:bg-[#121e17] border border-[#1c3327] hover:border-[#00df81]/60 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-[#6e8a7b] text-[11px] mb-1">
            <span className="font-medium group-hover:text-[#00df81] transition">Floor Plans Ready</span>
            <Layers className="w-3.5 h-3.5 text-[#00df81]" />
          </div>
          <div className="text-xl font-black text-[#00df81] leading-none">
            {withFloorPlansCount}
          </div>
        </div>

        {/* Widget 4: Missing Stall Fees */}
        <div
          onClick={onFilterMissingPrices}
          className="bg-[#0c1510] hover:bg-[#121e17] border border-[#1c3327] hover:border-[#6e8a7b] rounded-xl p-3 flex flex-col justify-between cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-[#6e8a7b] text-[11px] mb-1">
            <span className="font-medium">Fee Unannounced</span>
            <HelpCircle className="w-3.5 h-3.5 text-[#6e8a7b]" />
          </div>
          <div className="text-xl font-black text-[#6e8a7b] leading-none">
            {missingPricesCount}
          </div>
        </div>

        {/* Widget 5: Coverage Horizon */}
        <div className="bg-[#0c1510] border border-[#1c3327] rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#6e8a7b] text-[11px] mb-1">
            <span className="font-medium">Discovery Window</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#00df81]" />
          </div>
          <div className="text-sm font-bold text-white leading-none">
            Nov – Dec 23
            <span className="block text-[10px] text-[#6e8a7b] font-normal mt-0.5">Peak NCR Season</span>
          </div>
        </div>

        {/* Widget 6: AI Quick Scout Button */}
        <button
          onClick={onScoutNow}
          disabled={isScouting}
          className="bg-gradient-to-br from-[#0c1510] to-[#15241c] hover:from-[#15241c] hover:to-[#1c3327] border border-[#00df81]/40 hover:border-[#00df81] rounded-xl p-3 flex flex-col justify-between transition group text-left cursor-pointer shadow-lg shadow-[#00df81]/5"
        >
          <div className="flex items-center justify-between text-[11px] text-[#00df81]">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#00df81]" />
              TETR Scout
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00df81] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
          <div className="text-xs font-bold text-white leading-tight">
            {isScouting ? 'Scouting Live...' : 'Run Auto-Discovery'}
          </div>
        </button>
      </div>
    </div>
  );
}
