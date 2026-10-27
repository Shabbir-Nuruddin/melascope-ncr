'use client';

import React from 'react';
import MelaScopeLogo from '@/components/brand/MelaScopeLogo';
import { MapPin, ShieldCheck, Key, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenPolicies: (tab?: 'cookie' | 'privacy' | 'terms') => void;
  onOpenSettings: () => void;
  hasGoogleMapsKey?: boolean;
}

export default function Footer({
  onOpenPolicies,
  onOpenSettings,
  hasGoogleMapsKey = false,
}: FooterProps) {
  return (
    <footer className="mt-12 border-t border-[#e2ece6] bg-white text-[#2d4a3e] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo & Platform Summary */}
          <div>
            <MelaScopeLogo size="md" />
            <p className="text-xs text-[#527964] mt-2 max-w-md leading-relaxed">
              Private commercial intelligence for exhibitors, artisans, D2C brands, and stall sellers discovering high-footfall melas and festive markets across Delhi NCR.
            </p>
          </div>

          {/* Geographical Coverage Badges */}
          <div className="flex flex-col sm:items-end">
            <span className="text-[11px] font-bold text-[#0f291e] uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#059669]" />
              Coverage: Delhi NCR Core Districts
            </span>
            <div className="flex flex-wrap gap-1.5 max-w-sm sm:justify-end text-[10.5px]">
              {['South Delhi', 'Central Delhi', 'Gurugram', 'Noida', 'Greater Noida', 'Ghaziabad', 'Faridabad'].map((loc) => (
                <span
                  key={loc}
                  className="px-2 py-0.5 rounded-md bg-[#f0f7f3] text-[#1b382b] border border-[#dce8e1] font-medium"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider & Links */}
        <div className="pt-6 border-t border-[#edf4f0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#527964]">
          {/* Legal and Compliance Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => onOpenPolicies('cookie')}
              className="hover:text-[#059669] transition hover:underline"
            >
              Cookies Policy
            </button>
            <button
              onClick={() => onOpenPolicies('privacy')}
              className="hover:text-[#059669] transition hover:underline"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenPolicies('terms')}
              className="hover:text-[#059669] transition hover:underline"
            >
              Terms of Intelligence
            </button>
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1 hover:text-[#059669] transition hover:underline"
            >
              <Key className="w-3 h-3 text-[#059669]" />
              <span>Google Maps Key</span>
            </button>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-[#f0f7f3] border border-[#dce8e1]">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              <span className="text-[#0f291e] font-medium">Asia/Kolkata (IST)</span>
              <span className="text-[#86a192]">•</span>
              <span className="font-semibold text-[#047857]">INR (₹)</span>
            </div>

            <div className="text-[11px] text-[#627d6d]">
              © 2026 MelaScope NCR
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
