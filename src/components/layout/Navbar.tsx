'use client';

import React from 'react';
import {
  Compass,
  Bookmark,
  Sparkles,
  Settings,
  PlusCircle,
  Package,
} from 'lucide-react';
import { UserProfile } from '@/types';

interface NavbarProps {
  activeView: 'map' | 'pipeline';
  onViewChange: (view: 'map' | 'pipeline') => void;
  onOpenResearch: () => void;
  onOpenAddEvent: () => void;
  onOpenSettings: () => void;
  onExportCsv: () => void;
  userProfile?: UserProfile | null;
  savedCount: number;
}

export default function Navbar({
  activeView,
  onViewChange,
  onOpenResearch,
  onOpenAddEvent,
  onOpenSettings,
  onExportCsv,
  userProfile,
  savedCount,
}: NavbarProps) {
  const profileName = userProfile?.product_profile.product_name || 'Handcrafted Artisan Goods';
  const priceRange = userProfile?.product_profile
    ? `₹${userProfile.product_profile.price_range_min}–₹${userProfile.product_profile.price_range_max}`
    : '₹450–₹2,200';

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#e2ece6] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* TETR Brand & App Title */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#059669] via-[#047857] to-[#065f46] p-0.5 shadow-md shadow-[#059669]/20">
            <div className="w-full h-full bg-[#059669] rounded-[10px] flex items-center justify-center font-black text-white">
              <span className="font-mono text-sm tracking-tighter">TETR</span>
            </div>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10b981] rounded-full border-2 border-white" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-[#0f291e] flex items-center gap-1.5">
              <span>MelaScope</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#059669] font-bold border border-[#a7f3d0]">
                NCR • TETR
              </span>
            </h1>
          </div>
          <p className="text-[10px] text-[#52796f] hidden sm:block tracking-wide font-medium">
            Delhi NCR Commercial Event & Venue Intelligence
          </p>
        </div>
      </div>

      {/* Main View Switchers */}
      <div className="flex items-center gap-1 bg-[#f0fdf4] border border-[#d1fae5] p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => onViewChange('map')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
            activeView === 'map'
              ? 'bg-[#059669] text-white font-bold shadow-sm'
              : 'text-[#52796f] hover:text-[#0f291e] hover:bg-[#e6f7ee]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="hidden md:inline">Opportunities Hub</span>
        </button>

        <button
          onClick={() => onViewChange('pipeline')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
            activeView === 'pipeline'
              ? 'bg-[#059669] text-white font-bold shadow-sm'
              : 'text-[#52796f] hover:text-[#0f291e] hover:bg-[#e6f7ee]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="hidden md:inline">Pipeline</span>
          {savedCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#ecfdf5] text-[#059669] font-bold border border-[#a7f3d0]">
              {savedCount}
            </span>
          )}
        </button>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-2">
        {/* Active Product Profile Pill */}
        <div
          onClick={onOpenSettings}
          className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#e2ece6] hover:border-[#059669]/50 cursor-pointer transition text-xs shadow-sm"
          title="Click to edit product profile and scoring criteria"
        >
          <Package className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
          <div className="text-left leading-tight">
            <div className="font-semibold text-[#0f291e] truncate max-w-[140px]">{profileName}</div>
            <div className="text-[10px] text-[#52796f]">{priceRange}</div>
          </div>
        </div>

        {/* Global Add / Import button */}
        <button
          onClick={onOpenAddEvent}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f0fdf4] text-[#0f291e] border border-[#e2ece6] hover:border-[#a7f3d0] rounded-xl text-xs font-semibold transition shadow-sm"
          title="Import from URL, upload poster/PDF, paste text or add manual event"
        >
          <PlusCircle className="w-4 h-4 text-[#059669]" />
          <span className="hidden sm:inline">Add Event</span>
        </button>

        {/* AI Discover Button */}
        <button
          onClick={onOpenResearch}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white font-bold rounded-xl text-xs shadow-md shadow-[#059669]/20 transition transform active:scale-95"
          title="Natural Language AI Research Discovery"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">AI Scout</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-[#52796f] hover:text-[#0f291e] bg-white hover:bg-[#f0fdf4] border border-[#e2ece6] rounded-xl transition shadow-sm"
          title="Workspace Settings, Criteria Weights & API Status"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
