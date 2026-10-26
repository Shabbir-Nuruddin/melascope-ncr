'use client';

import React, { useState, useRef } from 'react';
import { MelaEvent, FloorPlan } from '@/types';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Upload,
  FileText,
  AlertCircle,
  HelpCircle,
  Download,
  CheckCircle2,
  Layers,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface FloorPlanViewerProps {
  event: MelaEvent;
  onAttachFloorPlan: (eventId: string, floorPlan: FloorPlan) => void;
  onRequestFloorPlan: () => void;
}

export default function FloorPlanViewer({
  event,
  onAttachFloorPlan,
  onRequestFloorPlan,
}: FloorPlanViewerProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const plan = event.floor_plan;

  function handleZoomIn() {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3.5));
  }

  function handleZoomOut() {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  }

  function handleResetZoom() {
    setZoomLevel(1);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds 15MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (eventReader) => {
      const dataUrl = eventReader.target?.result as string;
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

      const newPlan: FloorPlan = {
        id: `fp-${Date.now()}`,
        file_url: dataUrl,
        file_type: isPdf ? 'pdf' : 'image',
        title: file.name.replace(/\.[^/.]+$/, ''),
        is_official: false,
        version: 'User Attached File',
        uploaded_at: new Date().toISOString(),
      };

      onAttachFloorPlan(event.id, newPlan);
      setIsUploading(false);
    };

    reader.onerror = () => {
      setUploadError('Failed reading file. Please try a different image or PDF.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-white text-sm">
              Internal Venue Floor Plan & Stall Layout
            </h4>
            {plan?.is_official && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Official Organiser Blueprint
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Inspect stall numbers, walkthrough corridors, gates, and exhibitor booths.
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>{isUploading ? 'Uploading...' : plan ? 'Replace Plan' : 'Upload Floor Plan'}</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-900 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* PLAN VIEWER OR EMPTY STATE */}
      {plan ? (
        <div
          className={`relative rounded-xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col items-center justify-center transition-all ${
            isFullscreen ? 'fixed inset-4 z-50 bg-slate-950/95 p-4 shadow-2xl' : 'min-h-[380px] max-h-[500px]'
          }`}
        >
          {/* Controls Bar */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-lg p-1 text-slate-300 shadow-md">
            <button
              onClick={handleZoomIn}
              className="p-1 hover:text-white hover:bg-slate-800 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 hover:text-white hover:bg-slate-800 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 hover:text-white hover:bg-slate-800 rounded text-[11px] px-1 font-mono"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <div className="w-px h-3 bg-slate-700" />
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:text-white hover:bg-slate-800 rounded"
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Title & Version Pill */}
          <div className="absolute top-3 left-3 z-20 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200">
            <span className="font-semibold">{plan.title}</span>
            {plan.version && <span className="text-slate-400 text-[10px] ml-1.5">({plan.version})</span>}
          </div>

          {/* Interactive Zoomable View Container */}
          <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
            {plan.file_type === 'pdf' ? (
              <div className="text-center p-8">
                <FileText className="w-16 h-16 text-amber-400 mx-auto mb-3" />
                <h5 className="font-semibold text-white text-sm mb-1">{plan.title}</h5>
                <p className="text-xs text-slate-400 mb-4">PDF Layout Document Attached</p>
                <a
                  href={plan.file_url}
                  download={`${plan.title}.pdf`}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow inline-flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Open PDF</span>
                </a>
              </div>
            ) : (
              <img
                src={plan.file_url}
                alt={plan.title}
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                className="max-w-full max-h-[460px] object-contain rounded-lg transition-transform duration-150 select-none cursor-grab active:cursor-grabbing shadow-lg"
              />
            )}
          </div>
        </div>
      ) : (
        /* Explicit "Floor plan not found yet" state required by user specification */
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Layers className="w-6 h-6 text-slate-500" />
          </div>

          <div>
            <h5 className="font-bold text-slate-200 text-sm">Floor plan not found yet</h5>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              No internal hall blueprint, booth layout, or stall map was published in public organiser channels.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={onRequestFloorPlan}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow transition"
            >
              Draft Enquiry for Floor Plan
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition"
            >
              Upload Floor Plan (PDF/Image)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
