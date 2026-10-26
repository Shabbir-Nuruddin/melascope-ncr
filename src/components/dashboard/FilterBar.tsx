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
    <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-16 z-30 shadow-md">
      {/* Top Row: Search + Action Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by event, venue (e.g. Dilli Haat), organiser, locality, or keywords..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenResearch}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-festive-600 hover:from-amber-400 hover:to-festive-500 text-slate-950 font-bold rounded-lg text-xs shadow-md transition transform active:scale-95"
            title="Launch Natural Language AI Research"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>AI Discover</span>
          </button>

          <button
            onClick={onOpenAddEvent}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
            title="Manually Add Event or Opportunity"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Add Event</span>
          </button>

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
            title="Export Filtered Events to CSV"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Second Row: Detailed Filter Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 items-center text-xs">
        {/* Locality Selector */}
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-400 font-medium mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" /> Locality / City
          </label>
          <select
            value={filters.locality || 'all'}
            onChange={(e) => onFilterChange({ locality: e.target.value })}
            className="bg-slate-950 border border-slate-700 rounded-md py-1.5 px-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Delhi NCR</option>
            <option value="South Delhi">South Delhi</option>
            <option value="Central Delhi">Central Delhi</option>
            <option value="West Delhi">West Delhi</option>
            <option value="North Delhi">North Delhi</option>
            <option value="East Delhi">East Delhi</option>
            <option value="Gurugram">Gurugram</option>
            <option value="Noida">Noida</option>
            <option value="Greater Noida">Greater Noida</option>
            <option value="Ghaziabad">Ghaziabad</option>
            <option value="Faridabad">Faridabad</option>
          </select>
        </div>

        {/* Event Type */}
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-400 font-medium mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-400" /> Event Type
          </label>
          <select
            value={filters.eventType || 'all'}
            onChange={(e) => onFilterChange({ eventType: e.target.value })}
            className="bg-slate-950 border border-slate-700 rounded-md py-1.5 px-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">All Types</option>
            <option value="festive_market">Festive Market / Utsav</option>
            <option value="flea_market">Flea Market / Pop-Up</option>
            <option value="mela">Mela / Fair</option>
            <option value="craft_market">Craft Bazaar</option>
            <option value="society_event">Society / RWA Carnival</option>
            <option value="exhibition">Exhibition / Expo</option>
          </select>
        </div>

        {/* Venue Context */}
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-400 font-medium mb-1">Venue Context</label>
          <select
            value={filters.venueContext || 'all'}
            onChange={(e) => onFilterChange({ venueContext: e.target.value })}
            className="bg-slate-950 border border-slate-700 rounded-md py-1.5 px-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Any Context</option>
            <option value="destination">Destination Hub</option>
            <option value="residential">Residential Catchment</option>
            <option value="office">Office / Corporate</option>
            <option value="mixed">Mixed Footfall</option>
          </select>
        </div>

        {/* Date Window */}
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-400 font-medium mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-amber-400" /> Horizon
          </label>
          <select
            value={filters.dateHorizonDays || ''}
            onChange={(e) =>
              onFilterChange({
                dateHorizonDays: e.target.value ? parseInt(e.target.value, 10) : undefined,
              })
            }
            className="bg-slate-950 border border-slate-700 rounded-md py-1.5 px-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="">All Upcoming</option>
            <option value="7">Next 7 Days</option>
            <option value="15">Next 15 Days</option>
            <option value="30">Next 30 Days</option>
            <option value="45">Next 45 Days</option>
            <option value="90">Next 90 Days</option>
          </select>
        </div>

        {/* Min Fit Score */}
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-400 font-medium mb-1">Min Fit Score</label>
          <select
            value={filters.minScore || ''}
            onChange={(e) =>
              onFilterChange({
                minScore: e.target.value ? parseInt(e.target.value, 10) : undefined,
              })
            }
            className="bg-slate-950 border border-slate-700 rounded-md py-1.5 px-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="">Any Score</option>
            <option value="70">70+ Viable</option>
            <option value="80">80+ High Priority</option>
            <option value="85">85+ Top Match</option>
          </select>
        </div>

        {/* Max Stall Fee */}
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-400 font-medium mb-1 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-amber-400" /> Max Fee (₹)
          </label>
          <select
            value={filters.maxStallFee || ''}
            onChange={(e) =>
              onFilterChange({
                maxStallFee: e.target.value ? parseInt(e.target.value, 10) : undefined,
              })
            }
            className="bg-slate-950 border border-slate-700 rounded-md py-1.5 px-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="">No Cap</option>
            <option value="10000">Up to ₹10,000</option>
            <option value="15000">Up to ₹15,000</option>
            <option value="25000">Up to ₹25,000</option>
            <option value="35000">Up to ₹35,000</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-400 font-medium mb-1">Sort By</label>
          <select
            value={filters.sortBy || 'fit_score'}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="bg-slate-950 border border-slate-700 rounded-md py-1.5 px-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="fit_score">Fit Score (High to Low)</option>
            <option value="date">Date (Earliest First)</option>
            <option value="fee_asc">Stall Fee (Low to High)</option>
            <option value="fee_desc">Stall Fee (High to Low)</option>
            <option value="confidence">Confidence (High First)</option>
          </select>
        </div>
      </div>

      {/* Third Row: Fast Toggles & Active Filter Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-300">
        <div className="flex flex-wrap items-center gap-4">
          {/* Verified Only Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(filters.verifiedOnly)}
              onChange={(e) => onFilterChange({ verifiedOnly: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1 text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Only <span className="text-[10px] text-slate-400">(excludes unverified leads)</span>
            </span>
          </label>

          {/* Booking Link Available Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(filters.bookingLinkOnly)}
              onChange={(e) => onFilterChange({ bookingLinkOnly: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1 text-slate-200">
              <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
              Has Booking Form / Page
            </span>
          </label>
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-xs">
            Showing <strong className="text-amber-400">{totalCount}</strong> opportunities across Delhi NCR
          </span>

          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition px-2 py-1 rounded bg-slate-800/50 hover:bg-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
