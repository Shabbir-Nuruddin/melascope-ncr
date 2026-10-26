'use client';

import React, { useState } from 'react';
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
  LayoutGrid,
  Table as TableIcon,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FilterBarProps {
  filters: EventFilters;
  onFilterChange: (updates: Partial<EventFilters>) => void;
  onResetFilters: () => void;
  onExportCsv: () => void;
  onOpenAddEvent: () => void;
  onOpenResearch: () => void;
  totalCount: number;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  onExportCsv,
  onOpenAddEvent,
  onOpenResearch,
  totalCount,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Quick preset pills
  const quickPills = [
    {
      id: 'high-fit',
      label: '🔥 High Fit (80+)',
      active: filters.minFitScore === 80,
      toggle: () => onFilterChange({ minFitScore: filters.minFitScore === 80 ? 0 : 80 }),
    },
    {
      id: 'diwali',
      label: '🪔 Diwali Season (Nov 4–15)',
      active: filters.startDate === '2026-11-04' && filters.endDate === '2026-11-15',
      toggle: () => {
        if (filters.startDate === '2026-11-04' && filters.endDate === '2026-11-15') {
          onFilterChange({ startDate: undefined, endDate: undefined });
        } else {
          onFilterChange({ startDate: '2026-11-04', endDate: '2026-11-15' });
        }
      },
    },
    {
      id: 'christmas',
      label: '🎄 Winter & Christmas (Dec 1–23)',
      active: filters.startDate === '2026-12-01' && filters.endDate === '2026-12-23',
      toggle: () => {
        if (filters.startDate === '2026-12-01' && filters.endDate === '2026-12-23') {
          onFilterChange({ startDate: undefined, endDate: undefined });
        } else {
          onFilterChange({ startDate: '2026-12-01', endDate: '2026-12-23' });
        }
      },
    },
    {
      id: 'verified',
      label: '🛡️ Verified Only',
      active: filters.verifiedOnly === true,
      toggle: () => onFilterChange({ verifiedOnly: !filters.verifiedOnly }),
    },
    {
      id: 'booking',
      label: '📝 Booking Form Live',
      active: filters.hasBookingLink === true,
      toggle: () => onFilterChange({ hasBookingLink: !filters.hasBookingLink }),
    },
    {
      id: 'floor-plan',
      label: '📐 Floor Plan Ready',
      active: filters.hasFloorPlanOnly === true,
      toggle: () => onFilterChange({ hasFloorPlanOnly: !filters.hasFloorPlanOnly }),
    },
    {
      id: 'budget',
      label: '💰 Under ₹20k Stalls',
      active: filters.maxStallFee === 20000,
      toggle: () => onFilterChange({ maxStallFee: filters.maxStallFee === 20000 ? undefined : 20000 }),
    },
    {
      id: 'south-delhi',
      label: '📍 South Delhi',
      active: filters.city === 'South Delhi',
      toggle: () => onFilterChange({ city: filters.city === 'South Delhi' ? undefined : 'South Delhi' }),
    },
    {
      id: 'gurugram',
      label: '🏢 Gurugram',
      active: filters.city === 'Gurugram',
      toggle: () => onFilterChange({ city: filters.city === 'Gurugram' ? undefined : 'Gurugram' }),
    },
    {
      id: 'noida',
      label: '🏙️ Noida',
      active: filters.city === 'Noida',
      toggle: () => onFilterChange({ city: filters.city === 'Noida' ? undefined : 'Noida' }),
    },
  ];

  return (
    <div className="bg-[#0c1510] border-b border-[#1c3327] p-4 sm:p-5 sticky top-16 z-30 shadow-xl shadow-black/40">
      {/* Top Search + Primary CTAs + View Mode Switcher */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-3.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6e8a7b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by event, venue (e.g. Dilli Haat, Sunder Nursery, CyberHub), organiser..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-16 py-2.5 bg-[#060b08] border border-[#1c3327] rounded-xl text-sm text-[#f0fdf4] placeholder-[#6e8a7b] focus:outline-none focus:ring-2 focus:ring-[#00df81]/40 focus:border-[#00df81] transition shadow-inner"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#6e8a7b] hover:text-[#00df81] transition font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* View Toggle & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center bg-[#060b08] border border-[#1c3327] p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-[#00df81] text-[#060b08] font-bold shadow'
                  : 'text-[#6e8a7b] hover:text-[#f0fdf4]'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-[#00df81] text-[#060b08] font-bold shadow'
                  : 'text-[#6e8a7b] hover:text-[#f0fdf4]'
              }`}
              title="Comparison Spreadsheet Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={onOpenResearch}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#00df81] to-[#059669] hover:from-[#00ff87] hover:to-[#10b981] text-[#060b08] font-black rounded-xl text-xs shadow-md shadow-[#00df81]/20 transition transform active:scale-95"
            title="Launch Natural Language AI Research"
          >
            <Sparkles className="w-4 h-4 text-[#060b08]" />
            <span>AI Scout</span>
          </button>

          <button
            onClick={onOpenAddEvent}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] border border-[#1c3327] hover:border-[#284b39] rounded-xl text-xs font-medium transition"
            title="Import or Add New Event"
          >
            <PlusCircle className="w-4 h-4 text-[#00df81]" />
            <span className="hidden sm:inline">Add Event</span>
          </button>

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] border border-[#1c3327] hover:border-[#284b39] rounded-xl text-xs font-medium transition"
            title="Export filtered events to CSV"
          >
            <Download className="w-4 h-4 text-[#6e8a7b]" />
          </button>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              showAdvanced
                ? 'bg-[#15241c] text-[#00df81] border-[#00df81]/40'
                : 'bg-[#0f1a14] text-[#6e8a7b] border-[#1c3327] hover:text-white'
            }`}
            title="Toggle Detailed Filters"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Quick Filter Pills Row (Horizontal Scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {quickPills.map((pill) => (
          <button
            key={pill.id}
            onClick={pill.toggle}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full font-medium transition flex items-center gap-1 ${
              pill.active
                ? 'bg-[#00df81] text-[#060b08] font-bold shadow-sm shadow-[#00df81]/25'
                : 'bg-[#060b08] hover:bg-[#0f1a14] text-[#6e8a7b] hover:text-[#f0fdf4] border border-[#1c3327]'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Expandable Advanced Filter Controls */}
      {showAdvanced && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-3.5 mt-3 border-t border-[#1c3327] text-xs animate-fadeIn">
          {/* Locality Selector */}
          <div className="flex flex-col">
            <label className="text-[10px] text-[#6e8a7b] font-medium mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#00df81]" /> Locality / District
            </label>
            <select
              value={filters.city || ''}
              onChange={(e) => onFilterChange({ city: e.target.value || undefined })}
              className="bg-[#060b08] border border-[#1c3327] text-[#f0fdf4] rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-[#00df81] focus:border-[#00df81] outline-none"
            >
              <option value="">All Delhi NCR</option>
              <option value="Delhi">Delhi (All)</option>
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
              <option value="festive_market">Festive Market (Diwali/Xmas)</option>
              <option value="flea_market">Flea Market / Pop-Up</option>
              <option value="exhibition">Exhibition / Expo</option>
              <option value="society_event">RWA / Society Carnival</option>
            </select>
          </div>

          {/* Min Fit Score */}
          <div className="flex flex-col">
            <label className="text-[10px] text-[#6e8a7b] font-medium mb-1">Min Fit Score</label>
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

          {/* Reset Filters CTA */}
          <div className="flex items-end">
            <button
              onClick={onResetFilters}
              className="w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-[#0f1a14] hover:bg-[#15241c] text-[#6e8a7b] hover:text-[#00df81] border border-[#1c3327] rounded-lg transition text-xs font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        </div>
      )}

      {/* Summary Row */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1c3327]/60 text-[11px] text-[#6e8a7b]">
        <div>
          Showing <span className="font-bold text-[#00df81]">{totalCount}</span> NCR mela opportunities through December 23rd
        </div>

        <div className="text-[10px] text-[#6e8a7b]">
          View Mode: <strong className="text-white uppercase">{viewMode}</strong>
        </div>
      </div>
    </div>
  );
}
