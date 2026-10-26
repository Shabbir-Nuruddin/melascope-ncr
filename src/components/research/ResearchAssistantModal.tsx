'use client';

import React, { useState } from 'react';
import { ResearchRun, ResearchLogEntry } from '@/types';
import {
  X,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Terminal,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#060b08]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0c1510] border border-[#1c3327] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1c3327] bg-[#060b08]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00df81] to-[#059669] flex items-center justify-center text-[#060b08] shadow-md shadow-[#00df81]/20">
              <Sparkles className="w-5 h-5 text-[#060b08]" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg">TETR Scout • Event Discovery Engine</h3>
              <p className="text-xs text-[#6e8a7b]">
                Delhi NCR multi-source discovery, verification & commercial scoring
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6e8a7b] hover:text-white rounded-lg bg-[#0f1a14] border border-[#1c3327] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Query Input Box */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#f0fdf4] block">
              Describe what events or vendor opportunities you want to discover:
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Find weekend melas in Gurugram and Noida over the next 45 days with published stall fees under ₹25,000..."
                className="w-full bg-[#060b08] border border-[#1c3327] rounded-xl p-3 text-sm text-[#f0fdf4] placeholder-[#6e8a7b] focus:outline-none focus:ring-2 focus:ring-[#00df81]/40 focus:border-[#00df81]"
              />
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] text-[#6e8a7b] block mb-1.5 font-medium">Quick prompt ideas:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUERIES.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(preset);
                      handleLaunchRun(preset);
                    }}
                    className="text-[11px] text-left bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] hover:text-[#00df81] border border-[#1c3327] hover:border-[#00df81]/40 px-2.5 py-1 rounded-lg transition"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-[#6e8a7b]">
                <span>Horizon:</span>
                <select
                  value={horizonDays}
                  onChange={(e) => setHorizonDays(parseInt(e.target.value, 10))}
                  className="bg-[#060b08] border border-[#1c3327] rounded-md py-1 px-2 text-[#f0fdf4] focus:outline-none focus:border-[#00df81]"
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
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00df81] to-[#059669] hover:from-[#00ff87] hover:to-[#10b981] disabled:opacity-50 text-[#060b08] font-black rounded-xl text-xs shadow-lg shadow-[#00df81]/25 transition active:scale-95"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#060b08]" />
                    <span>Executing Discovery Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-[#060b08]" />
                    <span>Start Research Run</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-900 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Running Progress or Run Results */}
          {isRunning && (
            <div className="p-5 rounded-xl bg-[#060b08] border border-[#1c3327] space-y-3 animate-pulse">
              <div className="flex items-center justify-between text-xs text-[#f0fdf4]">
                <span className="font-semibold text-[#00df81]">Searching Delhi NCR sources & calendar registries...</span>
                <span>In progress</span>
              </div>
              <div className="w-full bg-[#0f1a14] h-2 rounded-full overflow-hidden">
                <div className="bg-[#00df81] h-full w-2/3 rounded-full animate-progress" />
              </div>
              <p className="text-[11px] text-[#6e8a7b]">
                Parsing official organiser announcements, cross-referencing Dilli Haat, Sunder Nursery, Epicentre, and society RWAs...
              </p>
            </div>
          )}

          {activeRun && (
            <div className="space-y-4 pt-2 border-t border-[#1c3327]">
              {/* Summary Box */}
              <div className="p-4 rounded-xl bg-[#060b08] border border-[#1c3327]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00df81]" />
                    <span className="font-bold text-white text-xs">Run Completed Successfully</span>
                  </div>
                  <span className="text-[10px] text-[#6e8a7b]">
                    {activeRun.source_count} sources examined • {activeRun.events_found} events found
                  </span>
                </div>
                <p className="text-xs text-[#f0fdf4] leading-relaxed mb-3">
                  {activeRun.summary}
                </p>

                {/* Evidence Caveat */}
                <div className="p-2.5 rounded-lg bg-[#0f1a14] border border-[#1c3327] text-[11px] text-[#6e8a7b]">
                  <strong className="text-[#00df81]">TETR Data Verification Standard:</strong> New events found have been persisted to your local database with source citations. Unverified leads are marked explicitly.
                </div>
              </div>

              {/* Discovery Logs Terminal */}
              <div className="rounded-xl bg-[#060b08] border border-[#1c3327] p-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#6e8a7b] text-[11px] pb-2 border-b border-[#1c3327] mb-2">
                  <Terminal className="w-3.5 h-3.5 text-[#00df81]" />
                  <span>Pipeline Execution Logs ({activeRun.logs?.length || 0} steps)</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {activeRun.logs?.map((log: ResearchLogEntry, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <span className="text-[#6e8a7b] flex-shrink-0">
                        [{log.level.toUpperCase()}]
                      </span>
                      <span className={log.level === 'success' ? 'text-[#00df81]' : log.level === 'error' ? 'text-red-400' : 'text-[#f0fdf4]'}>
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
