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

  const demoCount = events.filter((e) => e.is_demo).length;

  return (
    <div className="bg-slate-950/70 border-b border-slate-800 px-4 py-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Widget 1: Verified Upcoming */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Verified Events</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white leading-none">
            {verifiedCount}
            <span className="text-xs font-normal text-slate-500 ml-1">/ {events.length}</span>
          </div>
        </div>

        {/* Widget 2: Deadlines Closing Soon */}
        <div
          onClick={onFilterDeadlines}
          className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Deadlines &lt; 7 Days</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 leading-none">
            {deadlinesClosingCount}
          </div>
        </div>

        {/* Widget 3: Floor Plans Available */}
        <div
          onClick={onFilterFloorPlans}
          className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Floor Plans Available</span>
            <Layers className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-400 leading-none">
            {withFloorPlansCount}
          </div>
        </div>

        {/* Widget 4: Missing Stall Fees */}
        <div
          onClick={onFilterMissingPrices}
          className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Fees Unannounced</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-slate-300 leading-none">
            {missingPricesCount}
          </div>
        </div>

        {/* Widget 5: Seed / Demo Notice */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Demo Data State</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className="text-xs font-semibold text-slate-300 leading-tight">
            {demoCount > 0 ? (
              <span className="text-amber-400/90 font-mono text-[11px]">
                {demoCount} Demo Records
              </span>
            ) : (
              <span className="text-emerald-400 font-mono text-[11px]">Clean Live DB</span>
            )}
          </div>
        </div>

        {/* Widget 6: Quick "Scout Now" */}
        <div className="bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-900/60 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400/80 text-[11px] font-medium mb-1">
            <span>Directory Scout</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <button
            onClick={onScoutNow}
            disabled={isScouting}
            className="w-full py-1.5 px-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg shadow transition active:scale-95 flex items-center justify-center gap-1"
          >
            <Search className="w-3 h-3" />
            <span>{isScouting ? 'Scouting...' : 'Scout Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
