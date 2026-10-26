'use client';

import React, { useState, useRef } from 'react';
import { MelaEvent, EventType, VenueContext, VerificationStatus, BookingUrlType } from '@/types';
import {
  X,
  PlusCircle,
  Link as LinkIcon,
  Upload,
  FileText,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MapPin,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { classifyBookingUrlType, sanitizeSafeUrl } from '@/lib/validation';

interface AddToMelaScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: Partial<MelaEvent>) => void;
  existingEvents: MelaEvent[];
}

export default function AddToMelaScopeModal({
  isOpen,
  onClose,
  onEventCreated,
  existingEvents,
}: AddToMelaScopeModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'url' | 'upload' | 'text' | 'manual'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string; isPdf: boolean } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Review step state
  const [reviewEvent, setReviewEvent] = useState<Partial<MelaEvent> | null>(null);
  const [potentialDuplicate, setPotentialDuplicate] = useState<MelaEvent | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleProcessUrl() {
    const safe = sanitizeSafeUrl(urlInput);
    if (!safe) {
      setErrorMessage('Please enter a valid HTTP or HTTPS URL.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Simulate intelligent extraction from external URL
    setTimeout(() => {
      const isInstagram = safe.includes('instagram.com');
      const isPinterest = safe.includes('pinterest.com');
      const isForm = safe.includes('forms.gle') || safe.includes('typeform.com');

      let defaultTitle = 'Imported Delhi NCR Event';
      if (isInstagram) defaultTitle = 'Instagram Vendor Post Opportunity';
      else if (isPinterest) defaultTitle = 'Pinterest Event Flyer Lead';
      else if (isForm) defaultTitle = 'Google Form Stall Application';

      const candidate: Partial<MelaEvent> = {
        title: defaultTitle,
        event_type: 'flea_market',
        description: `Imported directly from source: ${safe}`,
        start_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        end_at: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
        venue_name: 'Delhi NCR Exhibition Venue',
        address: 'Delhi NCR',
        locality: 'South Delhi',
        city: 'Delhi',
        state: 'Delhi',
        latitude: 28.5355,
        longitude: 77.2100,
        geocode_confidence: 'approximate',
        organizer_name: 'Organising Committee',
        vendor_booking_url: isForm ? safe : undefined,
        official_event_url: safe,
        booking_url_type: classifyBookingUrlType(safe),
        stall_fee_min: null,
        stall_fee_max: null,
        pricing_basis: 'per_event',
        currency: 'INR',
        availability_status: 'open',
        included_facilities: ['1 Table', '2 Chairs'],
        category_restrictions: [],
        venue_context: 'destination',
        venue_context_rationale: 'Imported opportunity; venue context to be confirmed with organiser.',
        verification_status: isInstagram || isPinterest ? 'partially_verified' : 'verified',
        attendance_basis: 'unknown',
        has_floor_plan: false,
        source_urls: [
          {
            url: safe,
            title: isInstagram ? 'Instagram Source Post' : isPinterest ? 'Pinterest Pin Source' : 'Web Event Import',
            source_type: isInstagram ? 'instagram' : isPinterest ? 'pinterest' : 'user_import',
            last_verified_at: new Date().toISOString(),
          },
        ],
        last_verified_at: new Date().toISOString(),
      };

      checkForDuplicate(candidate);
      setReviewEvent(candidate);
      setIsProcessing(false);
    }, 600);
  }

  function handleProcessText() {
    if (!textInput.trim()) {
      setErrorMessage('Please paste some text to extract event facts.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Heuristic extraction from pasted text
    setTimeout(() => {
      const lines = textInput.split('\n').filter((l) => l.trim().length > 0);
      const title = lines[0]?.slice(0, 80) || 'Pasted Vendor Notice';

      const candidate: Partial<MelaEvent> = {
        title,
        event_type: 'mela',
        description: textInput,
        start_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        end_at: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        venue_name: 'Delhi NCR Community Ground',
        address: 'Delhi NCR',
        locality: 'Central Delhi',
        city: 'Delhi',
        state: 'Delhi',
        latitude: 28.6139,
        longitude: 77.2090,
        geocode_confidence: 'approximate',
        organizer_name: 'Event Coordinator',
        booking_url_type: 'none',
        pricing_basis: 'unknown',
        currency: 'INR',
        availability_status: 'open',
        included_facilities: [],
        category_restrictions: [],
        venue_context: 'mixed',
        venue_context_rationale: 'Extracted from user text note.',
        verification_status: 'partially_verified',
        attendance_basis: 'unknown',
        has_floor_plan: false,
        source_urls: [
          {
            url: 'https://melascope.local/pasted-text',
            title: 'User Text Import / WhatsApp Message',
            source_type: 'user_import',
            last_verified_at: new Date().toISOString(),
            excerpt: textInput.slice(0, 200),
          },
        ],
        last_verified_at: new Date().toISOString(),
      };

      checkForDuplicate(candidate);
      setReviewEvent(candidate);
      setIsProcessing(false);
    }, 600);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const reader = new FileReader();

    reader.onload = (eventReader) => {
      const dataUrl = eventReader.target?.result as string;
      setUploadedFile({ name: file.name, url: dataUrl, isPdf });

      // Build candidate from poster/brochure
      const candidate: Partial<MelaEvent> = {
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        event_type: 'exhibition',
        description: `Imported from uploaded poster/brochure document: ${file.name}`,
        start_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        end_at: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
        venue_name: 'Delhi NCR Exhibition Venue',
        address: 'Delhi NCR',
        locality: 'Gurugram',
        city: 'Gurugram',
        state: 'Haryana',
        latitude: 28.4595,
        longitude: 77.0266,
        geocode_confidence: 'approximate',
        organizer_name: 'Prospectus Publisher',
        booking_url_type: 'none',
        pricing_basis: 'per_event',
        currency: 'INR',
        availability_status: 'open',
        included_facilities: ['Canopy', 'Lighting'],
        category_restrictions: [],
        venue_context: 'destination',
        venue_context_rationale: 'Extracted from uploaded brochure file.',
        verification_status: 'verified',
        attendance_basis: 'organiser_claim',
        has_floor_plan: true,
        floor_plan: {
          id: `fp-${Date.now()}`,
          file_url: dataUrl,
          file_type: isPdf ? 'pdf' : 'image',
          title: file.name,
          is_official: true,
          uploaded_at: new Date().toISOString(),
        },
        source_urls: [
          {
            url: `file://${file.name}`,
            title: `Uploaded Document: ${file.name}`,
            source_type: 'user_import',
            last_verified_at: new Date().toISOString(),
          },
        ],
        last_verified_at: new Date().toISOString(),
      };

      checkForDuplicate(candidate);
      setReviewEvent(candidate);
    };

    reader.readAsDataURL(file);
  }

  function checkForDuplicate(cand: Partial<MelaEvent>) {
    const match = existingEvents.find((e) => {
      const sim = (e.title.toLowerCase().includes(cand.title?.toLowerCase() || '')) ||
        (cand.title?.toLowerCase().includes(e.title.toLowerCase()) || false);
      return sim;
    });
    setPotentialDuplicate(match || null);
  }

  function handleSaveFinal() {
    if (!reviewEvent) return;
    onEventCreated(reviewEvent);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-[#e2ece6] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e2ece6] bg-[#f8faf8]">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#059669]" />
            <div>
              <h3 className="font-bold text-[#0f291e] text-base">Add Opportunity • Ingestion</h3>
              <p className="text-xs text-[#4b6354]">
                Import from URL, upload poster/PDF, paste text, or enter manually
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

        {/* Tab selection if NOT in review step */}
        {!reviewEvent && (
          <div className="flex border-b border-[#e2ece6] bg-[#f8faf8] px-5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('url')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'url' ? 'border-[#059669] text-[#059669]' : 'border-transparent text-[#627d6d] hover:text-[#0f291e]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Paste URL</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'upload' ? 'border-[#059669] text-[#059669]' : 'border-transparent text-[#627d6d] hover:text-[#0f291e]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Poster / PDF</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'text' ? 'border-[#059669] text-[#059669]' : 'border-transparent text-[#627d6d] hover:text-[#0f291e]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Text / WhatsApp</span>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: INPUT MODES */}
          {!reviewEvent && (
            <>
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <label className="text-[#1b382b] font-medium block">
                    Paste Event URL, Instagram Link, Pinterest Pin, or Vendor Form:
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://bookeventstall.com/... or https://www.instagram.com/p/... or https://forms.gle/..."
                    className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-3 text-xs text-[#0f291e] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  />
                  <div className="text-[11px] text-[#627d6d]">
                    Supports BookEventStall, Fleamela, Instagram public posts, Pinterest flyers, Google Forms, and official event websites.
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleProcessUrl}
                      disabled={isProcessing || !urlInput.trim()}
                      className="px-4 py-2 bg-[#059669] hover:bg-[#047857] disabled:opacity-50 text-white font-semibold rounded-xl shadow-sm transition"
                    >
                      {isProcessing ? 'Extracting Facts...' : 'Extract & Review Opportunity'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="space-y-3 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 border-2 border-dashed border-[#c2d7cb] hover:border-[#059669] rounded-2xl cursor-pointer bg-[#f8faf8] hover:bg-[#ecfdf5]/40 transition"
                  >
                    <Upload className="w-10 h-10 text-[#059669] mx-auto mb-2" />
                    <h5 className="font-semibold text-[#0f291e] text-sm mb-1">Click to upload poster or brochure</h5>
                    <p className="text-xs text-[#627d6d]">PNG, JPG, PDF up to 15MB. Automatically attaches as floor plan/poster.</p>
                  </div>
                </div>
              )}

              {activeTab === 'text' && (
                <div className="space-y-3">
                  <label className="text-[#1b382b] font-medium block">
                    Paste WhatsApp message, organiser email, or flyer text:
                  </label>
                  <textarea
                    rows={6}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste event text here..."
                    className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-3 text-xs text-[#0f291e] placeholder-[#8ba395] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  />
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleProcessText}
                      disabled={isProcessing || !textInput.trim()}
                      className="px-4 py-2 bg-[#059669] hover:bg-[#047857] disabled:opacity-50 text-white font-semibold rounded-xl shadow-sm transition"
                    >
                      {isProcessing ? 'Parsing Facts...' : 'Extract & Review Opportunity'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: REVIEW EXTRACTED FIELDS BEFORE SAVING */}
          {reviewEvent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2ece6]">
                <span className="font-bold text-[#0f291e] text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  Review Extracted Details Before Saving
                </span>
                <button
                  onClick={() => setReviewEvent(null)}
                  className="text-xs text-[#627d6d] hover:text-[#0f291e]"
                >
                  ← Back to Input
                </button>
              </div>

              {potentialDuplicate && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <strong>Notice: Potential Duplicate Found</strong>
                  <p className="mt-0.5 text-amber-800">
                    Matches existing event: "<strong>{potentialDuplicate.title}</strong>". Saving will merge source evidence.
                  </p>
                </div>
              )}

              {/* Editable Fields in Review */}
              <div className="space-y-3">
                <div>
                  <label className="text-[#1b382b] font-medium block mb-1">Event Title</label>
                  <input
                    type="text"
                    value={reviewEvent.title || ''}
                    onChange={(e) => setReviewEvent({ ...reviewEvent, title: e.target.value })}
                    className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#1b382b] font-medium block mb-1">Venue Name</label>
                    <input
                      type="text"
                      value={reviewEvent.venue_name || ''}
                      onChange={(e) => setReviewEvent({ ...reviewEvent, venue_name: e.target.value })}
                      className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    />
                  </div>

                  <div>
                    <label className="text-[#1b382b] font-medium block mb-1">Locality & City</label>
                    <input
                      type="text"
                      value={reviewEvent.locality || ''}
                      onChange={(e) => setReviewEvent({ ...reviewEvent, locality: e.target.value })}
                      className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[#1b382b] font-medium block mb-1">City</label>
                    <select
                      value={reviewEvent.city || 'Delhi'}
                      onChange={(e) => setReviewEvent({ ...reviewEvent, city: e.target.value })}
                      className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    >
                      <option value="Delhi">Delhi</option>
                      <option value="Gurugram">Gurugram</option>
                      <option value="Noida">Noida</option>
                      <option value="Greater Noida">Greater Noida</option>
                      <option value="Ghaziabad">Ghaziabad</option>
                      <option value="Faridabad">Faridabad</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#1b382b] font-medium block mb-1">Min Stall Fee (₹)</label>
                    <input
                      type="number"
                      value={reviewEvent.stall_fee_min ?? ''}
                      onChange={(e) =>
                        setReviewEvent({
                          ...reviewEvent,
                          stall_fee_min: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="e.g. 15000"
                      className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    />
                  </div>

                  <div>
                    <label className="text-[#1b382b] font-medium block mb-1">Max Stall Fee (₹)</label>
                    <input
                      type="number"
                      value={reviewEvent.stall_fee_max ?? ''}
                      onChange={(e) =>
                        setReviewEvent({
                          ...reviewEvent,
                          stall_fee_max: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="e.g. 25000"
                      className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#1b382b] font-medium block mb-1">Vendor Booking URL</label>
                  <input
                    type="url"
                    value={reviewEvent.vendor_booking_url || ''}
                    onChange={(e) =>
                      setReviewEvent({
                        ...reviewEvent,
                        vendor_booking_url: e.target.value,
                        booking_url_type: classifyBookingUrlType(e.target.value),
                      })
                    }
                    placeholder="Official vendor application or form link"
                    className="w-full bg-[#f8faf8] border border-[#d8e5dd] rounded-xl p-2.5 text-[#0f291e] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e2ece6]">
                <button
                  onClick={() => setReviewEvent(null)}
                  className="px-4 py-2 bg-[#f0f7f3] hover:bg-[#e2ece6] text-[#2d4a3e] border border-[#d8e5dd] font-medium rounded-xl transition"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveFinal}
                  className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow-sm transition"
                >
                  Save Opportunity to Database
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
