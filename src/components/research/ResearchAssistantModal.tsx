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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-festive-600 flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">AI Event Research Assistant</h3>
              <p className="text-xs text-slate-400">
                Delhi NCR multi-source discovery, verification & commercial scoring
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Query Input Box */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 block">
              Describe what events or vendor opportunities you want to discover:
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Find weekend melas in Gurugram and Noida over the next 45 days with published stall fees under ₹25,000..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              />
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Quick prompt ideas:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUERIES.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(preset);
                      handleLaunchRun(preset);
                    }}
                    className="text-[11px] text-left bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700/80 px-2.5 py-1 rounded-lg transition"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Horizon:</span>
                <select
                  value={horizonDays}
                  onChange={(e) => setHorizonDays(parseInt(e.target.value, 10))}
                  className="bg-slate-950 border border-slate-700 rounded-md py-1 px-2 text-slate-200"
                >
                  <option value={15}>Next 15 Days</option>
                  <option value={30}>Next 30 Days</option>
                  <option value={45}>Next 45 Days (Default)</option>
                  <option value={60}>Next 60 Days</option>
                  <option value={90}>Next 90 Days</option>
                </select>
              </div>

              <button
                onClick={() => handleLaunchRun()}
                disabled={isRunning || !query.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-festive-600 hover:from-amber-400 hover:to-festive-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition active:scale-95"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Executing Discovery Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-slate-950" />
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
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-pulse">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-amber-400">Searching Delhi NCR sources & calendar registries...</span>
                <span>In progress</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-2/3 rounded-full animate-progress" />
              </div>
              <p className="text-[11px] text-slate-500">
                Parsing official organiser announcements, cross-referencing Dilli Haat, Noida Haat, Epicentre, and society RWAs...
              </p>
            </div>
          )}

          {activeRun && (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Research Run Completed</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(activeRun.completed_at || activeRun.started_at).toLocaleTimeString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-200 mb-2 leading-relaxed">{activeRun.summary}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-850">
                  <span>Target Range: <strong className="text-slate-300">{horizonDays} Days</strong></span>
                  <span>Sources Checked: <strong className="text-slate-300">{activeRun.source_count}</strong></span>
                  <span>Results Added/Updated: <strong className="text-amber-400">{activeRun.events_found}</strong></span>
                </div>
              </div>

              {/* Real-time Execution Logs Console */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-slate-300">
                <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-800 text-slate-400 text-xs">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pipeline Execution Trace & Audit Trail</span>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {activeRun.logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-tight">
                      <span className="text-slate-600 text-[10px] select-none">
                        {new Date(log.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false })}
                      </span>
                      <span
                        className={`font-semibold uppercase text-[9px] px-1 rounded ${
                          log.level === 'error'
                            ? 'bg-red-950 text-red-400'
                            : log.level === 'success'
                            ? 'bg-emerald-950 text-emerald-400'
                            : log.level === 'warn'
                            ? 'bg-amber-950 text-amber-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className={log.level === 'success' ? 'text-emerald-300' : 'text-slate-300'}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* View on Map CTA */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow transition"
                >
                  View Discovered Opportunities on Map
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
