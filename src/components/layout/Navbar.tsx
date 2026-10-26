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
  LogOut,
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
    <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-festive-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
          <Compass className="w-6 h-6 text-slate-950" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              <span>MelaScope</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                NCR
              </span>
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 hidden sm:block">
            Delhi NCR Event & Venue Intelligence
          </p>
        </div>
      </div>

      {/* Main View Switchers */}
      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => onViewChange('map')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
            activeView === 'map'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-4 h-4" />
          <span className="hidden md:inline">Map & Discovery</span>
        </button>

        <button
          onClick={() => onViewChange('pipeline')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
            activeView === 'pipeline'
              ? 'bg-amber-500 text-slate-950 font-bold shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="hidden md:inline">Pipeline</span>
          {savedCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-400 font-bold">
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
          className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition text-xs"
          title="Click to edit product profile and scoring criteria"
        >
          <Package className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <div className="text-left leading-tight">
            <div className="font-semibold text-slate-200 truncate max-w-[140px]">{profileName}</div>
            <div className="text-[10px] text-slate-400">{priceRange}</div>
          </div>
        </div>

        {/* Global Add / Import button */}
        <button
          onClick={onOpenAddEvent}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
          title="Import from URL, upload poster/PDF, paste text or add manual event"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Add / Import</span>
        </button>

        {/* AI Discover Button */}
        <button
          onClick={onOpenResearch}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-festive-600 hover:from-amber-400 hover:to-festive-500 text-slate-950 font-bold rounded-lg text-xs shadow transition active:scale-95"
          title="Natural Language AI Research Discovery"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">AI Scout</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
          title="Workspace Settings, Criteria Weights & API Status"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
