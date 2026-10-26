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
Exhibitor / Retail Brand
Contact: via MelaScope NCR`;

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
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">Request Missing Details</h3>
              <p className="text-xs text-slate-400">
                Tailored enquiry asking only for unconfirmed parameters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-semibold block">
                Draft Enquiry (Editable before sending):
              </label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 bg-amber-950/50 border border-amber-900/60 px-2 py-0.5 rounded transition"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Quick Dispatch Channels */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Open in WhatsApp Web</span>
              </a>
            )}

            {mailtoUrl && (
              <a
                href={mailtoUrl}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Open Email Client</span>
              </a>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Message</span>
            </button>
          </div>

          {/* Ingest Organiser Reply Section */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <label className="text-slate-300 font-semibold block">
              Received a reply from the organiser? Paste it here to update evidence:
            </label>
            <textarea
              rows={3}
              placeholder="Paste organiser's WhatsApp reply, quotation email, or stall details here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {replyParsed && (
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reply attached as new factual source evidence!</span>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleParseReply}
                disabled={!replyText.trim()}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs shadow transition"
              >
                Attach & Ingest Reply Evidence
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
