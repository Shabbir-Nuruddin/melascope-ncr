'use client';

import React, { useState } from 'react';
import { ResearchRun, ResearchLogEntry } from '@/types';
import {
  X,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  RefreshCw,
} from 'lucide-react';

interface ResearchAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunCompleted: () => void;
}

const PRESET_QUERIES = [
  'Find weekend Diwali melas in South Delhi and Central Delhi with confirmed stall fees',
  'Find lifestyle & flea market pop-ups in Gurugram near CyberHub and Golf Course Road',
  'Find high-density society carnivals and RWA fairs in Noida and Ghaziabad under ₹15,000',
  'Find eco-friendly craft and organic markets in Delhi NCR for handmade products',
];

export default function ResearchAssistantModal({
  isOpen,
  onClose,
  onRunCompleted,
}: ResearchAssistantModalProps) {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [horizonDays, setHorizonDays] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [activeRun, setActiveRun] = useState<ResearchRun | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLaunchRun(queryString?: string) {
    const q = queryString || query;
    if (!q.trim()) return;

    setIsRunning(true);
    setErrorMsg(null);
    setActiveRun(null);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          dateHorizonDays: horizonDays,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed executing research run');
      }

      setActiveRun(data.run);
      onRunCompleted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred during research run');
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-[#e2ece6] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-[#0f291e]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e2ece6] bg-[#f8faf8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#059669] to-[#10b981] flex items-center justify-center text-white shadow-md shadow-[#059669]/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-[#0f291e] text-lg">TETR Scout • Event Discovery Engine</h3>
              <p className="text-xs text-[#52796f]">
                Delhi NCR multi-source discovery, verification & commercial scoring
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#52796f] hover:text-[#0f291e] rounded-xl bg-white border border-[#e2ece6] transition shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Query Input Box */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#0f291e] block">
              Describe what events or vendor opportunities you want to discover:
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Find weekend melas in Gurugram and Noida over the next 45 days with published stall fees under ₹25,000..."
                className="w-full bg-[#f8faf8] border border-[#e2ece6] rounded-xl p-3 text-sm text-[#0f291e] placeholder-[#52796f] focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] focus:bg-white transition"
              />
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] text-[#52796f] block mb-1.5 font-semibold">Quick prompt ideas:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUERIES.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(preset);
                      handleLaunchRun(preset);
                    }}
                    className="text-[11px] text-left bg-[#f0fdf4] hover:bg-[#e6f7ee] text-[#047857] hover:text-[#059669] border border-[#d1fae5] px-2.5 py-1 rounded-xl transition font-medium"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-[#52796f]">
                <span className="font-semibold">Horizon:</span>
                <select
                  value={horizonDays}
                  onChange={(e) => setHorizonDays(parseInt(e.target.value, 10))}
                  className="bg-[#f8faf8] border border-[#e2ece6] rounded-xl py-1.5 px-2.5 text-[#0f291e] focus:outline-none focus:border-[#059669]"
                >
                  <option value={15}>Next 15 Days</option>
                  <option value={30}>Next 30 Days</option>
                  <option value={45}>Next 45 Days (Default)</option>
                  <option value={60}>Next 60 Days (Through Dec 23)</option>
                  <option value={90}>Next 90 Days</option>
                </select>
              </div>

              <button
                onClick={() => handleLaunchRun()}
                disabled={isRunning || !query.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-[#059669]/20 transition active:scale-95"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Executing Discovery Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-white" />
                    <span>Start Research Run</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Running Progress or Run Results */}
          {isRunning && (
            <div className="p-5 rounded-2xl bg-[#f8faf8] border border-[#e2ece6] space-y-3 animate-pulse">
              <div className="flex items-center justify-between text-xs text-[#0f291e]">
                <span className="font-bold text-[#059669]">Searching Delhi NCR sources & calendar registries...</span>
                <span className="font-semibold text-[#52796f]">In progress</span>
              </div>
              <div className="w-full bg-[#e2ece6] h-2 rounded-full overflow-hidden">
                <div className="bg-[#059669] h-full w-2/3 rounded-full animate-progress" />
              </div>
              <p className="text-[11px] text-[#52796f]">
                Parsing official organiser announcements, cross-referencing Dilli Haat, Sunder Nursery, Epicentre, and society RWAs...
              </p>
            </div>
          )}

          {activeRun && (
            <div className="space-y-4 pt-2 border-t border-[#e2ece6]">
              {/* Summary Box */}
              <div className="p-4 rounded-2xl bg-[#f8faf8] border border-[#e2ece6]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    <span className="font-bold text-[#0f291e] text-xs">Run Completed Successfully</span>
                  </div>
                  <span className="text-[10px] text-[#52796f] font-semibold">
                    {activeRun.source_count} sources examined • {activeRun.events_found} events found
                  </span>
                </div>
                <p className="text-xs text-[#0f291e] leading-relaxed mb-3">
                  {activeRun.summary}
                </p>

                {/* Evidence Caveat */}
                <div className="p-2.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[11px] text-[#065f46]">
                  <strong className="text-[#059669]">TETR Data Verification Standard:</strong> New events found have been persisted to your local database with source citations. Unverified leads are marked explicitly.
                </div>
              </div>

              {/* Discovery Logs Terminal */}
              <div className="rounded-2xl bg-[#f8faf8] border border-[#e2ece6] p-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#52796f] text-[11px] pb-2 border-b border-[#e2ece6] mb-2 font-semibold">
                  <Terminal className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Pipeline Execution Logs ({activeRun.logs?.length || 0} steps)</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {activeRun.logs?.map((log: ResearchLogEntry, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <span className="text-[#52796f] flex-shrink-0 font-bold">
                        [{log.level.toUpperCase()}]
                      </span>
                      <span className={log.level === 'success' ? 'text-[#059669] font-semibold' : log.level === 'error' ? 'text-red-600' : 'text-[#0f291e]'}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
