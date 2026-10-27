'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Cookie, FileText, ExternalLink, CheckCircle2, Lock, MapPin } from 'lucide-react';

interface LegalPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'cookie' | 'privacy' | 'terms';
}

export default function LegalPoliciesModal({
  isOpen,
  onClose,
  initialTab = 'cookie',
}: LegalPoliciesModalProps) {
  const [activeTab, setActiveTab] = useState<'cookie' | 'privacy' | 'terms'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-[#e2ece6] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-xs text-[#0f291e]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e2ece6] bg-[#f8faf8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-[#059669]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#0f291e] text-base">Legal, Cookies & Privacy Policies</h3>
              <p className="text-[11px] text-[#527964]">
                MelaScope NCR Platform Policies • Version 2026.1
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#4b6354] hover:text-[#0f291e] rounded-lg bg-[#f0f7f3] border border-[#e2ece6] hover:bg-[#e2ece6] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#e2ece6] bg-[#f8faf8] px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('cookie')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'cookie'
                ? 'border-[#059669] text-[#059669]'
                : 'border-transparent text-[#627d6d] hover:text-[#0f291e]'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>Cookies Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'privacy'
                ? 'border-[#059669] text-[#059669]'
                : 'border-transparent text-[#627d6d] hover:text-[#0f291e]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'terms'
                ? 'border-[#059669] text-[#059669]'
                : 'border-transparent text-[#627d6d] hover:text-[#0f291e]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms & Disclaimer</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 leading-relaxed text-[#2d4a3e]">
          {/* 1. COOKIES POLICY */}
          {activeTab === 'cookie' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-[#0f291e] text-sm mb-1">1. Scope of Cookies & Local Storage</h4>
                <p>
                  MelaScope NCR uses browser storage technologies (Cookies, LocalStorage, and SessionStorage)
                  primarily to provide secure authentication, preserve your filter preferences, and support
                  Google Maps rendering. We do NOT use third-party behavioral advertising cookies.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e2ece6] space-y-2.5">
                <h5 className="font-bold text-[#0f291e] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#059669]" />
                  Google Maps Platform Cookies & Geocoding
                </h5>
                <p className="text-[11.5px]">
                  When Google Maps JavaScript API is initialized (via your configured API key or client preference),
                  Google may set functional and security cookies (such as <code className="bg-[#ecfdf5] text-[#047857] px-1 py-0.5 rounded">NID</code>, <code className="bg-[#ecfdf5] text-[#047857] px-1 py-0.5 rounded">_Secure-ENID</code>, and <code className="bg-[#ecfdf5] text-[#047857] px-1 py-0.5 rounded">CONSENT</code>) to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[11px]">
                  <li>Load satellite, terrain, and road vector tiles for Delhi NCR venues.</li>
                  <li>Enable interactive pan, zoom, and distance estimations from your selling location.</li>
                  <li>Prevent automated misuse and enforce Google Maps Platform API rate limits.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#0f291e] text-sm mb-1">2. Local Storage Variables Managed</h4>
                <table className="w-full text-left border-collapse border border-[#e2ece6] rounded-lg overflow-hidden text-[11px]">
                  <thead>
                    <tr className="bg-[#f0f7f3] text-[#0f291e]">
                      <th className="p-2 border border-[#e2ece6] font-semibold">Key</th>
                      <th className="p-2 border border-[#e2ece6] font-semibold">Purpose</th>
                      <th className="p-2 border border-[#e2ece6] font-semibold">Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-[#e2ece6] font-mono text-[#059669]">google_maps_api_key</td>
                      <td className="p-2 border border-[#e2ece6]">Stores user-supplied Google Maps key locally in your browser</td>
                      <td className="p-2 border border-[#e2ece6]">Functional (User-set)</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#e2ece6] font-mono text-[#059669]">melascope_events</td>
                      <td className="p-2 border border-[#e2ece6]">Offline cached database of Delhi NCR opportunities</td>
                      <td className="p-2 border border-[#e2ece6]">Essential</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#e2ece6] font-mono text-[#059669]">melascope_product_profile</td>
                      <td className="p-2 border border-[#e2ece6]">Your product selling profile and AI Fit Score weights</td>
                      <td className="p-2 border border-[#e2ece6]">Functional</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#e2ece6] font-mono text-[#059669]">melascope_cookie_consent</td>
                      <td className="p-2 border border-[#e2ece6]">Remembers your cookie decision</td>
                      <td className="p-2 border border-[#e2ece6]">Essential</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="font-bold text-[#0f291e] text-sm mb-1">3. Managing & Revoking Cookies</h4>
                <p>
                  You can clear your cookie choices or revoke permission at any time by clearing your browser
                  cache or clicking "Reset Local Cache & Preferences" in the MelaScope Settings menu.
                </p>
              </div>
            </div>
          )}

          {/* 2. PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-[#0f291e] text-sm mb-1">1. Private Personal Workspace Model</h4>
                <p>
                  MelaScope NCR is engineered as a single-owner intelligence dashboard. Any notes you record,
                  pipeline stages you mark (Saved, Contacted, Applied, Booked), or custom products you evaluate
                  remain strictly within your private workspace.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#064e3b] space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  Zero Third-Party Data Monetisation
                </div>
                <p className="text-[11px] leading-relaxed">
                  We never sell, rent, or trade your stall booking strategies, sales forecasts, or contact histories
                  with event organisers or third parties.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0f291e] text-sm mb-1">2. Organiser Links & External Submissions</h4>
                <p>
                  MelaScope NCR provides direct links to official organiser application forms (e.g., Google Forms,
                  Typeform, WhatsApp business lines, or ticketing portals). When navigating to an external organiser
                  domain, their respective privacy policies and terms govern your communication.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0f291e] text-sm mb-1">3. Geocoding & Location Lookups</h4>
                <p>
                  When calculating venue distances from your production workshop or warehouse, coordinate queries
                  are either resolved through local NCR bounding boxes or sent directly to Google Maps Geocoding API
                  using your personal API key.
                </p>
              </div>
            </div>
          )}

          {/* 3. TERMS & DISCLAIMER */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-[#0f291e] text-sm mb-1">1. Commercial Venue Intelligence Disclaimer</h4>
                <p>
                  MelaScope NCR aggregates, standardises, and scores exhibition opportunities based on verified public
                  organizer announcements, past edition records, and official circulars across Delhi NCR.
                  Fit Scores (0–100) are decision-support heuristics and do not guarantee stall sales or footfall.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  Independent Organiser Verification Advised
                </div>
                <p className="text-[11px] leading-relaxed">
                  Always confirm stall availability, power load inclusion, category exclusivity, and cancellation
                  terms directly with the designated organiser committee before transferring token or stall booking advances.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0f291e] text-sm mb-1">2. Organiser Mailers & Circulars Policy</h4>
                <p>
                  Excerpts from organiser mailers, WhatsApp broadcasts, and vendor brochures are presented for
                  informational commercial evaluation under fair reference. All trademarks and event titles
                  (e.g., Dastkar, Blind Relief Association, DLF) belong to their respective registered organisations.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0f291e] text-sm mb-1">3. Geographical Focus</h4>
                <p>
                  Platform discovery is calibrated exclusively for the National Capital Region (Delhi, Gurugram,
                  Noida, Greater Noida, Ghaziabad, and Faridabad).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#e2ece6] bg-[#f8faf8]">
          <span className="text-[11px] text-[#627d6d]">
            Jurisdiction: Delhi NCR, India (Asia/Kolkata)
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-xl transition shadow-sm"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
