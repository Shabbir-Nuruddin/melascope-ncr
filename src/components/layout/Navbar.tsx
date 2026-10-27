'use client';

import React from 'react';
import {
  Compass,
  Bookmark,
  Sparkles,
  Settings,
  PlusCircle,
  Package,
  Mail,
  MapPin,
  Key,
} from 'lucide-react';
import { UserProfile } from '@/types';
import MelaScopeLogo from '@/components/brand/MelaScopeLogo';

interface NavbarProps {
  activeView: 'hub' | 'mailers' | 'pipeline';
  onViewChange: (view: 'hub' | 'mailers' | 'pipeline') => void;
  onOpenResearch: () => void;
  onOpenAddEvent: () => void;
  onOpenSettings: () => void;
  onExportCsv: () => void;
  userProfile?: UserProfile | null;
  savedCount: number;
  hasGoogleMapsKey?: boolean;
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
  hasGoogleMapsKey = false,
}: NavbarProps) {
  const profileName = userProfile?.product_profile.product_name || 'Handcrafted Artisan Goods';
  const priceRange = userProfile?.product_profile
    ? `₹${userProfile.product_profile.price_range_min}–₹${userProfile.product_profile.price_range_max}`
    : '₹450–₹2,200';

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#e2ece6] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Brand Title & Custom Logo */}
      <div className="flex items-center gap-3">
        <MelaScopeLogo size="md" showSubtitle={true} />
      </div>

      {/* Main View Switchers */}
      <div className="flex items-center gap-1 bg-[#f0f7f3] border border-[#dce8e1] p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => onViewChange('hub')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
            activeView === 'hub'
              ? 'bg-[#059669] text-white font-bold shadow-sm'
              : 'text-[#527964] hover:text-[#0f291e] hover:bg-[#e6f2eb]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="hidden sm:inline">Discovery Hub</span>
        </button>

        <button
          onClick={() => onViewChange('mailers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
            activeView === 'mailers'
              ? 'bg-[#059669] text-white font-bold shadow-sm'
              : 'text-[#527964] hover:text-[#0f291e] hover:bg-[#e6f2eb]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Mailers & Circulars</span>
        </button>

        <button
          onClick={() => onViewChange('pipeline')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
            activeView === 'pipeline'
              ? 'bg-[#059669] text-white font-bold shadow-sm'
              : 'text-[#527964] hover:text-[#0f291e] hover:bg-[#e6f2eb]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="hidden sm:inline">Pipeline</span>
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
            <div className="text-[10px] text-[#527964]">{priceRange}</div>
          </div>
        </div>

        {/* Global Add / Import button */}
        <button
          onClick={onOpenAddEvent}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#f0f7f3] text-[#0f291e] border border-[#e2ece6] hover:border-[#a7f3d0] rounded-xl text-xs font-semibold transition shadow-sm"
          title="Import from URL, upload poster/PDF, paste text or add manual event"
        >
          <PlusCircle className="w-4 h-4 text-[#059669]" />
          <span className="hidden md:inline">Add Opportunity</span>
        </button>

        {/* AI Research / Scout trigger */}
        <button
          onClick={onOpenResearch}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl text-xs shadow-sm shadow-[#059669]/20 transition"
          title="Launch AI Web Scout run across Delhi NCR"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden lg:inline">AI Scout</span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-[#527964] hover:text-[#0f291e] rounded-xl bg-white border border-[#e2ece6] hover:border-[#a7f3d0] transition shadow-sm"
          title="Workspace Settings & API Keys"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
