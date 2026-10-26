'use client';

import React from 'react';
import {
  Compass,
  Map,
  Bookmark,
  Sparkles,
  Settings,
  PlusCircle,
  Package,
  GraduationCap,
  Download,
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
    <header className="h-16 bg-[#060b08]/95 backdrop-blur-md border-b border-[#1c3327] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xl shadow-black/40">
      {/* TETR Brand & App Title */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00df81] via-[#059669] to-[#064e3b] p-0.5 shadow-lg shadow-[#00df81]/20">
            <div className="w-full h-full bg-[#060b08] rounded-[10px] flex items-center justify-center font-black text-[#00df81]">
              <span className="font-mono text-sm tracking-tighter">TETR</span>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00df81] rounded-full border-2 border-[#060b08]" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              <span>MelaScope</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#00df81]/15 text-[#00df81] font-bold border border-[#00df81]/30">
                NCR • TETR
              </span>
            </h1>
          </div>
          <p className="text-[10px] text-[#6e8a7b] hidden sm:block tracking-wide">
            Delhi NCR Commercial Event & Venue Intelligence
          </p>
        </div>
      </div>

      {/* Main View Switchers */}
      <div className="flex items-center gap-1 bg-[#0c1510] border border-[#1c3327] p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => onViewChange('map')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
            activeView === 'map'
              ? 'bg-[#00df81] text-[#060b08] font-bold shadow-md shadow-[#00df81]/25'
              : 'text-[#6e8a7b] hover:text-[#f0fdf4] hover:bg-[#121e17]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="hidden md:inline">Opportunities Hub</span>
        </button>

        <button
          onClick={() => onViewChange('pipeline')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
            activeView === 'pipeline'
              ? 'bg-[#00df81] text-[#060b08] font-bold shadow-md shadow-[#00df81]/25'
              : 'text-[#6e8a7b] hover:text-[#f0fdf4] hover:bg-[#121e17]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="hidden md:inline">Pipeline</span>
          {savedCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#060b08] text-[#00df81] font-bold border border-[#00df81]/40">
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
          className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c1510] border border-[#1c3327] hover:border-[#00df81]/40 cursor-pointer transition text-xs"
          title="Click to edit product profile and scoring criteria"
        >
          <Package className="w-3.5 h-3.5 text-[#00df81] flex-shrink-0" />
          <div className="text-left leading-tight">
            <div className="font-semibold text-[#f0fdf4] truncate max-w-[140px]">{profileName}</div>
            <div className="text-[10px] text-[#6e8a7b]">{priceRange}</div>
          </div>
        </div>

        {/* Global Add / Import button */}
        <button
          onClick={onOpenAddEvent}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] border border-[#1c3327] hover:border-[#284b39] rounded-lg text-xs font-medium transition"
          title="Import from URL, upload poster/PDF, paste text or add manual event"
        >
          <PlusCircle className="w-4 h-4 text-[#00df81]" />
          <span className="hidden sm:inline">Add / Import</span>
        </button>

        {/* AI Discover Button */}
        <button
          onClick={onOpenResearch}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#00df81] to-[#059669] hover:from-[#00ff87] hover:to-[#10b981] text-[#060b08] font-black rounded-lg text-xs shadow-lg shadow-[#00df81]/20 transition transform active:scale-95"
          title="Natural Language AI Research Discovery"
        >
          <Sparkles className="w-4 h-4 text-[#060b08]" />
          <span className="hidden sm:inline">AI Scout</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-[#6e8a7b] hover:text-[#f0fdf4] bg-[#0c1510] hover:bg-[#15241c] border border-[#1c3327] rounded-lg transition"
          title="Workspace Settings, Criteria Weights & API Status"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
