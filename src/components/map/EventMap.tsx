'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MelaEvent } from '@/types';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, AlertTriangle } from 'lucide-react';

interface EventMapProps {
  events: MelaEvent[];
  selectedEvent: MelaEvent | null;
  onSelectEvent: (event: MelaEvent) => void;
  onOpenDetails: (event: MelaEvent) => void;
}

const DELHI_NCR_CENTER = { lat: 28.5800, lng: 77.2100 }; // Centered on Delhi NCR
const DEFAULT_ZOOM = 11;

export default function EventMap({
  events,
  selectedEvent,
  onSelectEvent,
  onOpenDetails,
}: EventMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapMode, setMapMode] = useState<'google' | 'leaflet' | 'loading'>('loading');
  const [hasGoogleKey, setHasGoogleKey] = useState<boolean>(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (key && key.trim().length > 5 && !key.includes('YOUR_')) {
      setHasGoogleKey(true);
      loadGoogleMaps(key);
    } else {
      setHasGoogleKey(false);
      loadLeafletMap();
    }

    return () => {
      // Clean up map instance on unmount
      if (mapInstanceRef.current) {
        if (typeof mapInstanceRef.current.remove === 'function') {
          mapInstanceRef.current.remove();
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers whenever events or selectedEvent changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (mapMode === 'google' && window.google?.maps) {
      updateGoogleMarkers();
    } else if (mapMode === 'leaflet') {
      updateLeafletMarkers();
    }
  }, [events, selectedEvent, mapMode]);

  // Pan to selected event when selectedEvent changes
  useEffect(() => {
    if (!selectedEvent || !mapInstanceRef.current) return;

    const lat = selectedEvent.latitude;
    const lng = selectedEvent.longitude;

    if (mapMode === 'google' && window.google?.maps) {
      mapInstanceRef.current.panTo({ lat, lng });
      mapInstanceRef.current.setZoom(14);
    } else if (mapMode === 'leaflet') {
      mapInstanceRef.current.setView([lat, lng], 14, { animate: true });
    }
  }, [selectedEvent, mapMode]);

  // 1. Google Maps Loader
  function loadGoogleMaps(apiKey: string) {
    if (window.google?.maps) {
      initGoogleMap();
      return;
    }

    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogleMap();
      script.onerror = () => {
        console.warn('Google Maps script failed to load. Falling back to Leaflet/OSM.');
        loadLeafletMap();
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => initGoogleMap());
    }
  }

  function initGoogleMap() {
    if (!containerRef.current || !window.google?.maps) return;

    try {
      const map = new window.google.maps.Map(containerRef.current, {
        center: DELHI_NCR_CENTER,
        zoom: DEFAULT_ZOOM,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f8fafc' }],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#64748b' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#334155' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#475569' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0284c7' }],
          },
        ],
      });

      mapInstanceRef.current = map;
      setMapMode('google');
      updateGoogleMarkers();
    } catch (e) {
      console.warn('Error initializing Google Maps. Falling back to Leaflet:', e);
      loadLeafletMap();
    }
  }

  function updateGoogleMarkers() {
    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps) return;

    events.forEach((ev) => {
      const isSelected = selectedEvent?.id === ev.id;
      const pinColor = ev.verification_status === 'unverified'
        ? '#f97316'
        : ev.fit_score >= 80
        ? '#10b981'
        : ev.fit_score >= 65
        ? '#f59e0b'
        : '#64748b';

      const marker = new window.google.maps.Marker({
        position: { lat: ev.latitude, lng: ev.longitude },
        map,
        title: ev.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 12 : 9,
          fillColor: pinColor,
          fillOpacity: 1,
          strokeColor: isSelected ? '#ffffff' : '#0f172a',
          strokeWeight: isSelected ? 3 : 2,
        },
      });

      marker.addListener('click', () => {
        onSelectEvent(ev);
      });

      markersRef.current.push(marker);
    });
  }

  // 2. Leaflet Fallback Loader
  async function loadLeafletMap() {
    if (!containerRef.current) return;

    try {
      const L = await import('leaflet');

      // If already initialized, remove old
      if (mapInstanceRef.current) {
        if (typeof mapInstanceRef.current.remove === 'function') {
          mapInstanceRef.current.remove();
        }
      }

      const map = L.map(containerRef.current, {
        center: [DELHI_NCR_CENTER.lat, DELHI_NCR_CENTER.lng],
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
      });

      // CartoDB Dark Matter tiles for modern dark aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      setMapMode('leaflet');
      updateLeafletMarkers();
    } catch (err) {
      console.error('Failed to load Leaflet map:', err);
    }
  }

  async function updateLeafletMarkers() {
    const map = mapInstanceRef.current;
    if (!map) return;

    const L = await import('leaflet');

    // Clear old markers
    markersRef.current.forEach((m) => {
      if (typeof m.remove === 'function') m.remove();
    });
    markersRef.current = [];

    events.forEach((ev) => {
      const isSelected = selectedEvent?.id === ev.id;
      const isVerified = ev.verification_status === 'verified';
      const bgColor = ev.verification_status === 'unverified'
        ? 'bg-amber-600 border-amber-300'
        : ev.fit_score >= 80
        ? 'bg-emerald-600 border-emerald-300'
        : ev.fit_score >= 65
        ? 'bg-amber-500 border-amber-200'
        : 'bg-slate-600 border-slate-300';

      const customIcon = L.divIcon({
        className: 'custom-mela-pin',
        html: `
          <div class="relative group cursor-pointer flex items-center justify-center transform transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
            <div class="w-8 h-8 rounded-full border-2 ${bgColor} text-white flex items-center justify-center shadow-lg font-bold text-xs">
              ${ev.fit_score}
            </div>
            ${isSelected ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>' : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([ev.latitude, ev.longitude], { icon: customIcon }).addTo(map);

      // Popup content
      const popupHtml = `
        <div class="p-1 max-w-[260px] text-slate-100 font-sans">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              ev.verification_status === 'verified' ? 'bg-emerald-900/80 text-emerald-300' : 'bg-amber-900/80 text-amber-300'
            }">
              ${ev.verification_status.toUpperCase()}
            </span>
            <span class="text-[10px] text-slate-300">${ev.locality}, ${ev.city}</span>
          </div>
          <h4 class="font-bold text-sm leading-tight text-white mb-1">${ev.title}</h4>
          <p class="text-xs text-amber-400 font-medium mb-1">
            ${ev.stall_fee_max ? `₹${ev.stall_fee_min?.toLocaleString('en-IN') || 0} - ₹${ev.stall_fee_max?.toLocaleString('en-IN')}` : 'Stall fee unannounced'}
          </p>
          <div class="flex items-center justify-between pt-1 border-t border-slate-700/60 mt-1">
            <span class="text-xs font-semibold text-emerald-400">Score: ${ev.fit_score}/100</span>
            <button id="btn-popup-${ev.id}" class="text-[11px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded transition">
              View Details
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectEvent(ev);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${ev.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            onOpenDetails(ev);
          };
        }
      });

      if (isSelected) {
        marker.openPopup();
      }

      markersRef.current.push(marker);
    });
  }

  function handleRecenter() {
    if (!mapInstanceRef.current) return;
    if (mapMode === 'google' && window.google?.maps) {
      mapInstanceRef.current.panTo(DELHI_NCR_CENTER);
      mapInstanceRef.current.setZoom(DEFAULT_ZOOM);
    } else if (mapMode === 'leaflet') {
      mapInstanceRef.current.setView([DELHI_NCR_CENTER.lat, DELHI_NCR_CENTER.lng], DEFAULT_ZOOM, {
        animate: true,
      });
    }
  }

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
      {/* Map DOM Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Mode / API status indicator pill */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur border border-slate-700/80 text-xs shadow-md">
          <span
            className={`w-2 h-2 rounded-full ${
              mapMode === 'google' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="font-medium text-slate-200">
            {mapMode === 'google'
              ? 'Google Maps API'
              : mapMode === 'leaflet'
              ? 'OpenStreetMap / Leaflet (Fallback)'
              : 'Initializing Map...'}
          </span>
          {!hasGoogleKey && (
            <span className="text-[10px] text-slate-400 hidden sm:inline ml-1 border-l border-slate-700 pl-1.5">
              Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for Google tiles
            </span>
          )}
        </div>
      </div>

      {/* Recenter & Controls Floating Toolbar */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/95 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-xs font-medium shadow-lg backdrop-blur transition active:scale-95"
          title="Recenter Map to Delhi NCR"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Center NCR</span>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/90 backdrop-blur border border-slate-800/80 rounded-lg p-2 text-[11px] shadow-lg hidden md:block">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Opportunity Fit Score</div>
        <div className="flex items-center gap-3 text-slate-300">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>80+ High</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>65-79 Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
            <span>&lt;65 Low</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-700 inline-block border border-amber-300"></span>
            <span>Unverified Lead</span>
          </div>
        </div>
      </div>
    </div>
  );
}
