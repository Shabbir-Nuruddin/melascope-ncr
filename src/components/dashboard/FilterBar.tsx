'use client';

import React from 'react';
import { EventFilters } from '@/types';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  ShieldCheck,
  Link as LinkIcon,
  RotateCcw,
  Download,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

interface FilterBarProps {
  filters: EventFilters;
  onFilterChange: (updates: Partial<EventFilters>) => void;
  onResetFilters: () => void;
  onExportCsv: () => void;
  onOpenAddEvent: () => void;
  onOpenResearch: () => void;
  totalCount: number;
}

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  onExportCsv,
  onOpenAddEvent,
  onOpenResearch,
  totalCount,
}: FilterBarProps) {
  return (
    <div className="bg-[#0c1510] border-b border-[#1c3327] p-4 sticky top-16 z-30 shadow-lg shadow-black/30">
      {/* Top Row: Search + Action Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6e8a7b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by mela name, venue (e.g. Dilli Haat, Sunder Nursery), organiser, locality..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-14 py-2 bg-[#060b08] border border-[#1c3327] rounded-lg text-sm text-[#f0fdf4] placeholder-[#6e8a7b] focus:outline-none focus:ring-2 focus:ring-[#00df81]/40 focus:border-[#00df81] transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6e8a7b] hover:text-[#00df81] transition font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenResearch}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#00df81] to-[#059669] hover:from-[#00ff87] hover:to-[#10b981] text-[#060b08] font-black rounded-lg text-xs shadow-md shadow-[#00df81]/20 transition transform active:scale-95"
            title="Launch Natural Language AI Research"
          >
            <Sparkles className="w-4 h-4 text-[#060b08]" />
            <span>AI Discover</span>
          </button>

          <button
            onClick={onOpenAddEvent}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] border border-[#1c3327] hover:border-[#284b39] rounded-lg text-xs font-medium transition"
            title="Manually Add Event or Opportunity"
          >
            <PlusCircle className="w-4 h-4 text-[#00df81]" />
            <span>Add Event</span>
          </button>

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] border border-[#1c3327] hover:border-[#284b39] rounded-lg text-xs font-medium transition"
            title="Export Filtered Events to CSV"
          >
            <Download className="w-4 h-4 text-[#6e8a7b]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Second Row: Detailed Filter Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 items-center text-xs">
        {/* Locality Selector */}
        <div className="flex flex-col">
          <label className="text-[10px] text-[#6e8a7b] font-medium mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#00df81]" /> Locality / City
          </label>
          <select
            value={filters.city || ''}
            onChange={(e) => onFilterChange({ city: e.target.value || undefined })}
            className="bg-[#060b08] border border-[#1c3327] text-[#f0fdf4] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#00df81] focus:border-[#00df81] outline-none"
          >
            <option value="">All Delhi NCR</option>
            <option value="Delhi">Delhi (All Zones)</option>
            <option value="South Delhi">South Delhi</option>
            <option value="Central Delhi">Central Delhi</option>
            <option value="West Delhi">West Delhi</option>
            <option value="East Delhi">East Delhi</option>
            <option value="Gurugram">Gurugram</option>
            <option value="Noida">Noida</option>
            <option value="Greater Noida">Greater Noida</option>
            <option value="Ghaziabad">Ghaziabad</option>
            <option value="Faridabad">Faridabad</option>
          </select>
        </div>

        {/* Event Type Filter */}
        <div className="flex flex-col">
          <label className="text-[10px] text-[#6e8a7b] font-medium mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-[#00df81]" /> Event Type
          </label>
          <select
            value={filters.eventType || ''}
            onChange={(e) => onFilterChange({ eventType: e.target.value || undefined })}
            className="bg-[#060b08] border border-[#1c3327] text-[#f0fdf4] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#00df81] focus:border-[#00df81] outline-none"
          >
            <option value="">All Types</option>
            <option value="mela">Mela / Fair</option>
            <option value="festive_market">Festive Market (Diwali/Christmas)</option>
            <option value="flea_market">Flea Market</option>
            <option value="exhibition">Exhibition / Expo</option>
            <option value="society_event">RWA / Society Event</option>
            <option value="artisan_bazaar">Artisan Bazaar</option>
            <option value="food_festival">Food / Lifestyle Festival</option>
          </select>
        </div>

        {/* Min Fit Score */}
        <div className="flex flex-col">
          <label className="text-[10px] text-[#6e8a7b] font-medium mb-1 flex items-center justify-between">
            <span>Min Fit Score</span>
            <span className="text-[#00df81] font-bold">{filters.minFitScore || 0}+</span>
          </label>
          <select
            value={filters.minFitScore || 0}
            onChange={(e) => onFilterChange({ minFitScore: Number(e.target.value) })}
            className="bg-[#060b08] border border-[#1c3327] text-[#f0fdf4] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#00df81] focus:border-[#00df81] outline-none"
          >
            <option value={0}>Any Score</option>
            <option value={50}>50+ Viable</option>
            <option value={65}>65+ Strong Fit</option>
            <option value={75}>75+ High Commercial</option>
            <option value={85}>85+ Top Tier Fit</option>
          </select>
        </div>

        {/* Max Stall Fee */}
        <div className="flex flex-col">
          <label className="text-[10px] text-[#6e8a7b] font-medium mb-1 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-[#00df81]" /> Max Fee (₹)
          </label>
          <select
            value={filters.maxStallFee || ''}
            onChange={(e) => onFilterChange({ maxStallFee: e.target.value ? Number(e.target.value) : undefined })}
            className="bg-[#060b08] border border-[#1c3327] text-[#f0fdf4] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#00df81] focus:border-[#00df81] outline-none"
          >
            <option value="">Any Stall Budget</option>
            <option value={10000}>Under ₹10,000</option>
            <option value={20000}>Under ₹20,000</option>
            <option value={40000}>Under ₹40,000</option>
            <option value={80000}>Under ₹80,000</option>
          </select>
        </div>

        {/* Verified-Only Checkbox */}
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer bg-[#060b08] border border-[#1c3327] hover:border-[#00df81]/40 rounded-lg px-2.5 py-1.5 transition">
            <input
              type="checkbox"
              checked={filters.verifiedOnly || false}
              onChange={(e) => onFilterChange({ verifiedOnly: e.target.checked })}
              className="rounded bg-[#0f1a14] border-[#1c3327] text-[#00df81] focus:ring-[#00df81]"
            />
            <span className="text-[11px] text-[#f0fdf4] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00df81]" /> Verified Only
            </span>
          </label>
        </div>

        {/* Has Booking Link Checkbox */}
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer bg-[#060b08] border border-[#1c3327] hover:border-[#00df81]/40 rounded-lg px-2.5 py-1.5 transition">
            <input
              type="checkbox"
              checked={filters.hasBookingLink || false}
              onChange={(e) => onFilterChange({ hasBookingLink: e.target.checked })}
              className="rounded bg-[#0f1a14] border-[#1c3327] text-[#00df81] focus:ring-[#00df81]"
            />
            <span className="text-[11px] text-[#f0fdf4] font-medium flex items-center gap-1">
              <LinkIcon className="w-3 h-3 text-[#00df81]" /> Booking Link
            </span>
          </label>
        </div>

        {/* Sort By Selector */}
        <div className="flex flex-col">
          <label className="text-[10px] text-[#6e8a7b] font-medium mb-1">Sort By</label>
          <select
            value={filters.sortBy || 'fit_score'}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="bg-[#060b08] border border-[#1c3327] text-[#f0fdf4] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#00df81] focus:border-[#00df81] outline-none"
          >
            <option value="fit_score">Fit Score (High → Low)</option>
            <option value="start_at">Event Date (Earliest)</option>
            <option value="stall_fee">Stall Fee (Low → High)</option>
            <option value="confidence">Confidence Level</option>
          </select>
        </div>
      </div>

      {/* Filter Status Summary & Reset */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#1c3327]/60 text-[11px] text-[#6e8a7b]">
        <div>
          Showing <span className="font-bold text-[#00df81]">{totalCount}</span> NCR mela opportunities matching criteria
        </div>

        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-[#6e8a7b] hover:text-[#00df81] transition font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
}
