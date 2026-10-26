'use client';

import React, { useState } from 'react';
import { MelaEvent } from '@/types';
import {
  X,
  MessageSquare,
  Copy,
  CheckCircle2,
  Send,
  Mail,
  Phone,
  FileText,
  Sparkles,
} from 'lucide-react';

interface EnquiryDraftModalProps {
  event: MelaEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyReplyText?: (replyText: string) => void;
}

export default function EnquiryDraftModal({
  event,
  isOpen,
  onClose,
  onApplyReplyText,
}: EnquiryDraftModalProps) {
  if (!isOpen || !event) return null;

  const [copied, setCopied] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyParsed, setReplyParsed] = useState(false);

  // Generate tailored questions based ONLY on what is missing for this event
  const missingPoints: string[] = [];
  if (!event.stall_fee_max && !event.stall_fee_min) {
    missingPoints.push('Total stall rental fee (including GST, security deposit, and cleaning charges)');
  }
  if (!event.stall_width_ft || !event.stall_depth_ft) {
    missingPoints.push('Exact stall dimensions (width × depth in feet) and table setup provided');
  }
  if (!event.electricity_charges_included) {
    missingPoints.push('Power supply provision (number of 5A/15A sockets and electricity costs)');
  }
  if (!event.has_floor_plan) {
    missingPoints.push('Venue floor plan showing available booth positions and prime walkway locations');
  }
  if (event.attendance_basis === 'unknown' || !event.expected_attendance_stated) {
    missingPoints.push('Expected visitor footfall and typical buyer profile/demographics for this edition');
  }
  if (!event.application_deadline) {
    missingPoints.push('Vendor application deadline and advance booking payment schedule');
  }

  // Fallback points if almost everything is known
  if (missingPoints.length === 0) {
    missingPoints.push('Current live stall availability and booking confirmation process');
  }

  const generatedMessage = `Namaste ${event.organizer_name} Team,

I am writing regarding vendor stall booking for "${event.title}" scheduled at ${event.venue_name} (${new Date(event.start_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })}).

We are interested in booking a retail stall and would appreciate clarification on the following details:

${missingPoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}

Could you please share the exhibitor prospectus or vendor registration link at your earliest convenience?

Best regards,
Commercial Exhibitor / Retail Brand
Via MelaScope NCR (TETR Edition)`;

  const [draft, setDraft] = useState(generatedMessage);

  function handleCopy() {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const cleanPhone = (event.organizer_phone || '').replace(/[^\d]/g, '');
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(draft)}`
    : null;

  const mailtoUrl = event.organizer_email
    ? `mailto:${event.organizer_email}?subject=${encodeURIComponent(
        `Vendor Stall Enquiry - ${event.title}`
      )}&body=${encodeURIComponent(draft)}`
    : null;

  function handleParseReply() {
    if (!replyText.trim()) return;
    if (onApplyReplyText) {
      onApplyReplyText(replyText);
    }
    setReplyParsed(true);
    setTimeout(() => setReplyParsed(false), 3000);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-[#060b08]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c1510] border border-[#1c3327] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1c3327] bg-[#060b08]/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#15241c] text-[#00df81] border border-[#00df81]/30">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Request Missing Details from Organiser
              </h3>
              <p className="text-[11px] text-[#6e8a7b]">
                Tailored enquiry asking only for missing fields ({missingPoints.length} detected)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6e8a7b] hover:text-white bg-[#0f1a14] rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Missing Fields Summary */}
          <div className="p-3 rounded-xl bg-[#060b08] border border-[#1c3327]">
            <div className="text-[11px] font-bold text-[#6e8a7b] uppercase mb-1.5">
              Identified Information Gaps:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingPoints.map((pt, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-[#0f1a14] text-[#00df81] border border-[#1c3327] text-[10px]"
                >
                  • {pt.slice(0, 48)}...
                </span>
              ))}
            </div>
          </div>

          {/* Editable Draft */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-[#f0fdf4]">
                Editable Enquiry Draft (WhatsApp / Email):
              </label>
              <button
                onClick={handleCopy}
                className="text-[#00df81] hover:text-[#00ff87] flex items-center gap-1 font-bold"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full bg-[#060b08] border border-[#1c3327] rounded-xl p-3 text-[#f0fdf4] font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#00df81] focus:border-[#00df81]"
            />
          </div>

          {/* Direct Send Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition"
              >
                <Phone className="w-4 h-4" />
                <span>Open in WhatsApp (+{cleanPhone})</span>
              </a>
            ) : (
              <span className="text-[11px] text-[#6e8a7b] py-2 px-3 bg-[#060b08] rounded-lg border border-[#1c3327]">
                No organiser phone number on record
              </span>
            )}

            {mailtoUrl && (
              <a
                href={mailtoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] border border-[#1c3327] font-medium rounded-xl transition"
              >
                <Mail className="w-4 h-4 text-[#00df81]" />
                <span>Send via Email</span>
              </a>
            )}
          </div>

          {/* Paste Organiser Reply Parser */}
          <div className="pt-3 border-t border-[#1c3327] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#f0fdf4] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#00df81]" />
                <span>Log Organiser Reply</span>
              </label>
              {replyParsed && (
                <span className="text-[#00df81] text-[10px] font-bold">✓ Saved to notes!</span>
              )}
            </div>

            <textarea
              rows={3}
              placeholder="Paste organiser's reply message here (quotes, prices, dimensions)..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-[#060b08] border border-[#1c3327] rounded-xl p-2.5 text-xs text-[#f0fdf4] focus:outline-none focus:border-[#00df81]"
            />

            <button
              onClick={handleParseReply}
              disabled={!replyText.trim()}
              className="px-3.5 py-1.5 bg-[#0f1a14] hover:bg-[#15241c] disabled:opacity-50 text-[#00df81] border border-[#00df81]/40 rounded-lg text-xs font-semibold transition"
            >
              Attach Reply to Opportunity Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
