'use client';

import React, { useState, useRef } from 'react';
import { MelaEvent, FloorPlan } from '@/types';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Upload,
  FileText,
  AlertCircle,
  Download,
  Layers,
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
    <div className="rounded-xl border border-[#e2ece6] bg-white p-4 space-y-3">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#e2ece6]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#059669]" />
            <h4 className="font-bold text-[#0f291e] text-sm">
              Venue Floor Plan & Stall Layout Intelligence
            </h4>
            {plan?.is_official && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                Official Blueprint
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#52796f]">
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8faf8] hover:bg-[#f0fdf4] text-[#0f291e] border border-[#e2ece6] rounded-xl text-xs font-semibold transition shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-[#059669]" />
            <span>{isUploading ? 'Uploading...' : plan ? 'Replace Plan' : 'Upload Floor Plan'}</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* PLAN VIEWER OR EMPTY STATE */}
      {plan ? (
        <div
          className={`relative rounded-xl border border-[#e2ece6] bg-[#f8faf8] overflow-hidden flex flex-col items-center justify-center transition-all ${
            isFullscreen ? 'fixed inset-4 z-50 bg-white/95 p-4 shadow-2xl' : 'min-h-[380px] max-h-[500px]'
          }`}
        >
          {/* Controls Bar */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur border border-[#e2ece6] rounded-lg p-1 text-[#0f291e] shadow-md">
            <button
              onClick={handleZoomIn}
              className="p-1 hover:text-[#059669] hover:bg-[#f0fdf4] rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 hover:text-[#059669] hover:bg-[#f0fdf4] rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 hover:text-[#059669] hover:bg-[#f0fdf4] rounded text-[11px] px-1 font-mono font-semibold"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <div className="w-px h-3 bg-[#e2ece6]" />
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:text-[#059669] hover:bg-[#f0fdf4] rounded"
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Title & Version Pill */}
          <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur border border-[#e2ece6] rounded-lg px-2.5 py-1 text-xs text-[#0f291e] shadow-xs">
            <span className="font-semibold">{plan.title}</span>
            {plan.version && <span className="text-[#52796f] text-[10px] ml-1.5">({plan.version})</span>}
          </div>

          {/* Interactive Zoomable View Container */}
          <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
            {plan.file_type === 'pdf' ? (
              <div className="text-center p-8">
                <FileText className="w-16 h-16 text-[#059669] mx-auto mb-3" />
                <h5 className="font-semibold text-[#0f291e] text-sm mb-1">{plan.title}</h5>
                <p className="text-xs text-[#52796f] mb-4">PDF Layout Document Attached</p>
                <a
                  href={plan.file_url}
                  download={`${plan.title}.pdf`}
                  className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl text-xs shadow-sm inline-flex items-center gap-1.5"
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
                className="max-w-full max-h-[460px] object-contain rounded-lg transition-transform duration-150 select-none cursor-grab active:cursor-grabbing shadow-md border border-[#e2ece6]"
              />
            )}
          </div>
        </div>
      ) : (
        /* Explicit "Floor plan not found yet" state required by user specification */
        <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8faf8] p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white border border-[#e2ece6] flex items-center justify-center text-[#52796f] mx-auto shadow-xs">
            <Layers className="w-6 h-6 text-[#52796f]" />
          </div>

          <div>
            <h5 className="font-bold text-[#0f291e] text-sm">Floor plan not found yet</h5>
            <p className="text-xs text-[#52796f] max-w-md mx-auto mt-1">
              No internal hall blueprint, booth layout, or stall map was published in public organiser channels.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={onRequestFloorPlan}
              className="px-3.5 py-1.5 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Draft Enquiry for Floor Plan
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-white hover:bg-[#f0fdf4] text-[#0f291e] border border-[#e2ece6] text-xs font-semibold rounded-xl transition shadow-xs"
            >
              Upload Floor Plan (PDF/Image)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
