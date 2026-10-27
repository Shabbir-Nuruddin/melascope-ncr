'use client';

import React, { useState } from 'react';
import { NCR_ORGANISER_MAILERS, MelaMailer } from '@/lib/db/mailers-data';
import { UserProfile } from '@/types';
import {
  Mail,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Send,
  FileText,
  AlertCircle,
  Building,
  Sparkles,
  Phone,
} from 'lucide-react';

interface MailersHubProps {
  userProfile?: UserProfile;
}

export default function MailersHub({ userProfile }: MailersHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [activeMailer, setActiveMailer] = useState<MelaMailer | null>(null);
  const [outreachModalMailer, setOutreachModalMailer] = useState<MelaMailer | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Filter mailers
  const filteredMailers = NCR_ORGANISER_MAILERS.filter((m) => {
    if (selectedCity !== 'all' && m.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        m.eventTitle.toLowerCase().includes(q) ||
        m.organizerName.toLowerCase().includes(q) ||
        m.locality.toLowerCase().includes(q) ||
        m.circularTitle.toLowerCase().includes(q) ||
        m.productCategoriesAllowed.some((c) => c.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Generate outreach text
  function generatePitch(mailer: MelaMailer) {
    const prod = userProfile?.product_profile;
    const cat = prod?.category || 'Handcrafted Home & Festive Lifestyle';
    const price =
      prod?.price_range_min && prod?.price_range_max
        ? `₹${prod.price_range_min.toLocaleString('en-IN')} – ₹${prod.price_range_max.toLocaleString('en-IN')}`
        : '₹1,200 – ₹4,500';
    const footprint = prod?.stall_footprint || '8x6 ft canopy';

    return {
      subject: `Vendor Application: Participation Enquiry for ${mailer.eventTitle} (${cat})`,
      body: `Respected ${mailer.organizerName} Committee,

I hope this message finds you well.

I am writing regarding your recent callout circular (${mailer.circularTitle}) for the upcoming ${mailer.eventTitle} in ${mailer.locality}, ${mailer.city}.

We would like to formally apply for stall allocation in the ${cat} section.

ABOUT OUR BRAND & COLLECTION:
• Product Category: ${cat}
• Typical Retail Price Range: ${price}
• Production Philosophy: High ethical standards, clean aesthetics, and festive gift packaging.
• Space Footprint Requested: ${footprint} (Standard table/canopy setup)

We have reviewed your circular guidelines regarding prohibited goods and confirm 100% adherence to all packaging, security, and fire safety norms.

Could you please confirm the next steps for sample submission or invoice generation for the stall booking fee?

Warm regards,
Exhibitor / Brand Representative
Contact: ${userProfile ? 'Your Phone Number' : '+91-98XXXXXXXX'}
Portfolio Link: ${userProfile ? 'https://instagram.com/yourbrand' : 'Available upon request'}`,
    };
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 sm:p-6 text-xs text-[#0f291e]">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-white via-[#f8faf8] to-[#ecfdf5] border border-[#dce8e1] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-[#059669]">
                <Mail className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-[#0f291e] tracking-tight">
                Organiser Callouts & Mailer Circulars Hub
              </h2>
            </div>
            <p className="text-xs text-[#527964] max-w-2xl">
              Official vendor booking circulars, WhatsApp broadcasts, and exhibitor callouts directly from verified Delhi NCR mela committees. Review booth dimensions, power specs, and 1-click draft your application email.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-white border border-[#dce8e1] text-xs font-semibold text-[#047857] shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
              <span>{NCR_ORGANISER_MAILERS.length} Active Circulars Tracked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and City Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-[#e2ece6] rounded-2xl p-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86a192]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mailers by event, organiser, locality, or product category (e.g. candles, ceramics)..."
            className="w-full pl-10 pr-4 py-2 bg-[#f8faf8] border border-[#d8e5dd] rounded-xl text-xs text-[#0f291e] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
          />
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All NCR' },
            { id: 'Delhi', label: 'Delhi' },
            { id: 'Gurugram', label: 'Gurugram' },
            { id: 'Noida', label: 'Noida' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCity(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCity === c.id
                  ? 'bg-[#059669] text-white shadow-sm'
                  : 'bg-[#f0f7f3] text-[#2d4a3e] hover:bg-[#e2ece6]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Circulars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredMailers.map((mailer) => (
          <div
            key={mailer.id}
            className="bg-white border border-[#e2ece6] hover:border-[#a7f3d0] rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                    mailer.mailerStatus === 'closing_soon'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]'
                  }`}
                >
                  {mailer.mailerStatus === 'closing_soon' ? 'Closing Soon' : 'Active Callout'}
                </span>

                <div className="flex items-center gap-1.5 text-[11px] text-[#527964] font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Circular: {mailer.circularDate}</span>
                </div>
              </div>

              {/* Title & Organiser */}
              <h3 className="font-bold text-base text-[#0f291e] leading-snug mb-1">
                {mailer.eventTitle}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#527964] mb-3">
                <Building className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                <span className="truncate">{mailer.organizerName}</span>
              </div>

              {/* Key Specs Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-[#f8faf8] border border-[#e2ece6] rounded-xl mb-3 text-[11.5px]">
                <div className="flex items-center gap-1.5 text-[#2d4a3e]">
                  <MapPin className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                  <span>{mailer.locality}, {mailer.city}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-[#047857]">
                  <IndianRupee className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                  <span>{mailer.stallFeeRange}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#2d4a3e]">
                  <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Deadline: <strong>{mailer.deadlineDate}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-[#2d4a3e]">
                  <FileText className="w-3.5 h-3.5 text-[#059669] flex-shrink-0" />
                  <span className="truncate">Booth: {mailer.stallDimensions}</span>
                </div>
              </div>

              {/* Allowed Categories Tags */}
              <div className="space-y-1 mb-3">
                <span className="text-[10.5px] font-bold text-[#527964] uppercase tracking-wide block">
                  Curated Categories:
                </span>
                <div className="flex flex-wrap gap-1">
                  {mailer.productCategoriesAllowed.slice(0, 3).map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#f0f7f3] text-[#1b382b] border border-[#dce8e1] text-[10.5px]"
                    >
                      {cat}
                    </span>
                  ))}
                  {mailer.productCategoriesAllowed.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-[#527964]">
                      +{mailer.productCategoriesAllowed.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Circular Excerpt */}
              <p className="text-[11.5px] text-[#3d5a4c] line-clamp-2 italic bg-white p-2 border-l-2 border-[#059669] rounded-r-md">
                "{mailer.officialCircularText.slice(0, 140)}..."
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#edf4f0] mt-3">
              <button
                onClick={() => setActiveMailer(mailer)}
                className="text-xs font-semibold text-[#059669] hover:text-[#047857] hover:underline flex items-center gap-1"
              >
                <span>Read Full Circular</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOutreachModalMailer(mailer)}
                  className="px-3 py-1.5 bg-[#f0f7f3] hover:bg-[#e2ece6] text-[#0f291e] border border-[#d8e5dd] font-semibold rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Draft Application</span>
                </button>

                {mailer.bookingFormUrl && (
                  <a
                    href={mailer.bookingFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-xl text-xs flex items-center gap-1 shadow-sm transition"
                  >
                    <span>Apply Form</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: FULL CIRCULAR DETAILS */}
      {activeMailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-[#e2ece6] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-xs text-[#0f291e]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#e2ece6] bg-[#f8faf8] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider block">
                  Official Organiser Callout
                </span>
                <h3 className="font-bold text-base text-[#0f291e] leading-snug">
                  {activeMailer.eventTitle}
                </h3>
              </div>
              <button
                onClick={() => setActiveMailer(null)}
                className="p-1.5 text-[#4b6354] hover:text-[#0f291e] rounded-lg bg-[#f0f7f3] border border-[#e2ece6]"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="p-3 bg-[#f8faf8] border border-[#e2ece6] rounded-xl">
                <h4 className="font-bold text-[#0f291e] text-xs mb-1">{activeMailer.circularTitle}</h4>
                <p className="text-[11px] text-[#527964]">
                  Organiser: {activeMailer.organizerName} • Published: {activeMailer.circularDate} • Application Deadline: <strong className="text-amber-800">{activeMailer.deadlineDate}</strong>
                </p>
              </div>

              {/* Exact Circular Text */}
              <div>
                <span className="font-bold text-[#0f291e] block mb-1.5">Official Circular Guidelines:</span>
                <div className="p-4 bg-[#f8faf8] border border-[#e2ece6] rounded-xl text-[11.5px] leading-relaxed whitespace-pre-line text-[#2d4a3e] font-sans">
                  {activeMailer.officialCircularText}
                </div>
              </div>

              {/* Facilities Included */}
              <div>
                <span className="font-bold text-[#0f291e] block mb-1.5">Included Booth Facilities:</span>
                <ul className="list-disc pl-5 space-y-1 text-[11.5px] text-[#2d4a3e]">
                  {activeMailer.powerAndFacilities.map((fac, i) => (
                    <li key={i}>{fac}</li>
                  ))}
                </ul>
              </div>

              {/* Prohibited Items */}
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <span className="font-bold text-red-900 block mb-1">Strictly Prohibited Goods:</span>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-red-800">
                  {activeMailer.productCategoriesProhibited.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Contact Organiser */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-[11.5px]">
                <div className="space-y-0.5">
                  <div className="font-bold text-[#064e3b]">Organiser Enquiry Desk:</div>
                  <div className="text-[#047857]">{activeMailer.organizerEmail} • {activeMailer.organizerPhone}</div>
                </div>

                <button
                  onClick={() => {
                    const mailer = activeMailer;
                    setActiveMailer(null);
                    setOutreachModalMailer(mailer);
                  }}
                  className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-xl shadow-sm transition"
                >
                  Generate Application Pitch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: VENDOR APPLICATION OUTREACH MAILER DRAFTER */}
      {outreachModalMailer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-[#e2ece6] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-xs text-[#0f291e]">
            {/* Header */}
            <div className="p-5 border-b border-[#e2ece6] bg-[#f8faf8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#059669]" />
                <div>
                  <h3 className="font-bold text-[#0f291e] text-base">
                    Vendor Outreach Mailer Drafter
                  </h3>
                  <p className="text-[11px] text-[#527964]">
                    Tailored application to {outreachModalMailer.organizerName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOutreachModalMailer(null)}
                className="p-1.5 text-[#4b6354] hover:text-[#0f291e] rounded-lg bg-[#f0f7f3] border border-[#e2ece6]"
              >
                ✕
              </button>
            </div>

            {/* Pitch Body */}
            {(() => {
              const pitch = generatePitch(outreachModalMailer);
              return (
                <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
                  <div>
                    <label className="font-bold text-[#0f291e] block mb-1">Subject Line:</label>
                    <input
                      type="text"
                      readOnly
                      value={pitch.subject}
                      className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-xs text-[#0f291e] font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0f291e] block mb-1">Email / WhatsApp Application Pitch:</label>
                    <textarea
                      rows={12}
                      readOnly
                      value={pitch.body}
                      className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-3 text-xs text-[#0f291e] leading-relaxed font-mono"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#edf4f0]">
                    <span className="text-[11px] text-[#527964]">
                      Pre-formatted to adhere to the organiser's official callout terms.
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(pitch.body)}
                        className="px-4 py-2 bg-[#f0f7f3] hover:bg-[#e2ece6] text-[#0f291e] border border-[#d8e5dd] font-semibold rounded-xl text-xs flex items-center gap-1.5 transition"
                      >
                        {copiedText ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#059669]" />
                            <span>Copied to Clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#059669]" />
                            <span>Copy Pitch</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`mailto:${outreachModalMailer.organizerEmail}?subject=${encodeURIComponent(pitch.subject)}&body=${encodeURIComponent(pitch.body)}`}
                        className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send via Email Client</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
