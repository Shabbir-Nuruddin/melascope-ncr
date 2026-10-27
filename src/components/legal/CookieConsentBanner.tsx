'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X, Check, Settings2 } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPolicies: (tab?: 'cookie' | 'privacy' | 'terms') => void;
}

export default function CookieConsentBanner({ onOpenPolicies }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already made a choice
    const consent = localStorage.getItem('melascope_cookie_consent');
    if (!consent) {
      // Delay showing by 800ms for a smoother initial render
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAcceptAll() {
    localStorage.setItem('melascope_cookie_consent', 'accepted_all');
    localStorage.setItem('melascope_maps_cookies_allowed', 'true');
    setIsVisible(false);
  }

  function handleEssentialOnly() {
    localStorage.setItem('melascope_cookie_consent', 'essential_only');
    localStorage.setItem('melascope_maps_cookies_allowed', 'false');
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 backdrop-blur-md border border-[#cde0d5] shadow-2xl rounded-2xl p-4 sm:p-5 text-xs text-[#0f291e]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-[#059669] flex-shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#0f291e] text-sm">Cookie & Privacy Notice</h4>
              <p className="text-[11px] text-[#527964]">Google Maps & Workspace Session</p>
            </div>
          </div>

          <button
            onClick={handleEssentialOnly}
            className="p-1 text-[#627d6d] hover:text-[#0f291e] rounded-lg transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-[11.5px] leading-relaxed text-[#355344] mb-3.5">
          MelaScope NCR uses local workspace cookies and optional{' '}
          <strong className="text-[#0f291e]">Google Maps Platform cookies</strong> to render interactive venue
          maps, geocode NCR localities, and calculate stall logistics distances. No commercial advertising trackers are used.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#e8f1ec]">
          <button
            onClick={handleAcceptAll}
            className="flex-1 py-2 px-3 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-xl text-center shadow-sm transition text-xs flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept All</span>
          </button>

          <button
            onClick={handleEssentialOnly}
            className="py-2 px-3 bg-[#f0f7f3] hover:bg-[#e2ece6] text-[#2d4a3e] border border-[#d8e5dd] font-medium rounded-xl text-center transition text-xs"
          >
            Essential Only
          </button>

          <button
            onClick={() => {
              onOpenPolicies('cookie');
            }}
            className="p-2 text-[#527964] hover:text-[#059669] hover:bg-[#ecfdf5] rounded-xl transition"
            title="Read detailed policies"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
