'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MelaEvent } from '@/types';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, Key, ExternalLink, Sparkles } from 'lucide-react';

interface EventMapProps {
  events: MelaEvent[];
  selectedEvent: MelaEvent | null;
  onSelectEvent: (event: MelaEvent) => void;
  onOpenDetails: (event: MelaEvent) => void;
  onOpenSettings?: () => void;
}

const DELHI_NCR_CENTER = { lat: 28.5800, lng: 77.2100 }; // Centered on Delhi NCR
const DEFAULT_ZOOM = 11;

// Clean White & Emerald Green Google Maps Styling
const WHITE_GREEN_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f7faf8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }, { weight: 3 }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#1a382b' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#047857' }, { weight: 'bold' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#527964' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#d8edd9' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e2ece6' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#c2e9d2' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#a7f3d0' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9e8d4' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#047857' }],
  },
];

export default function EventMap({
  events,
  selectedEvent,
  onSelectEvent,
  onOpenDetails,
  onOpenSettings,
}: EventMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet' | 'loading'>('loading');
  const [hasGoogleKey, setHasGoogleKey] = useState<boolean>(false);

  useEffect(() => {
    // Check key from env or from localStorage
    const envKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const localKey = typeof window !== 'undefined' ? localStorage.getItem('google_maps_api_key') : null;
    const activeKey = (localKey && localKey.trim().length > 5) ? localKey : envKey;

    if (activeKey && activeKey.trim().length > 5 && !activeKey.includes('YOUR_')) {
      setHasGoogleKey(true);
      loadGoogleMaps(activeKey.trim());
    } else {
      setHasGoogleKey(false);
      loadLeafletMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        if (typeof mapInstanceRef.current.remove === 'function') {
          mapInstanceRef.current.remove();
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers on events or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (mapEngine === 'google' && window.google?.maps) {
      updateGoogleMarkers();
    } else if (mapEngine === 'leaflet') {
      updateLeafletMarkers();
    }
  }, [events, selectedEvent, mapEngine]);

  // Pan to selected event
  useEffect(() => {
    if (!selectedEvent || !mapInstanceRef.current) return;

    const lat = selectedEvent.latitude;
    const lng = selectedEvent.longitude;

    if (mapEngine === 'google' && window.google?.maps) {
      mapInstanceRef.current.panTo({ lat, lng });
      mapInstanceRef.current.setZoom(14);
    } else if (mapEngine === 'leaflet') {
      mapInstanceRef.current.setView([lat, lng], 14, { animate: true });
    }
  }, [selectedEvent, mapEngine]);

  // 1. Google Maps Platform Loader
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogleMap();
      script.onerror = () => {
        console.warn('Google Maps script failed to load. Falling back to OpenStreetMap.');
        loadLeafletMap();
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => initGoogleMap());
    }
  }

  function initGoogleMap() {
    if (!containerRef.current || !window.google?.maps) return;

    const map = new window.google.maps.Map(containerRef.current, {
      center: DELHI_NCR_CENTER,
      zoom: DEFAULT_ZOOM,
      styles: WHITE_GREEN_MAP_STYLE,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: window.google.maps.ControlPosition.TOP_RIGHT,
      },
      streetViewControl: true,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;
    setMapEngine('google');
    updateGoogleMarkers();
  }

  function updateGoogleMarkers() {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    events.forEach((ev) => {
      const isSelected = selectedEvent?.id === ev.id;
      const markerColor =
        ev.verification_status === 'unverified'
          ? '#f59e0b'
          : ev.fit_score >= 80
          ? '#059669'
          : ev.fit_score >= 65
          ? '#10b981'
          : '#527964';

      const marker = new window.google.maps.Marker({
        position: { lat: ev.latitude, lng: ev.longitude },
        map: map,
        title: `${ev.title} (${ev.fit_score}/100)`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 12 : 9,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: isSelected ? 3.5 : 2,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family: inherit; font-size: 12px; padding: 4px; max-width: 250px; color: #0f291e;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 800; background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0;">
                FIT: ${ev.fit_score}/100
              </span>
              <span style="font-size: 10px; color: #527964;">${ev.locality}</span>
            </div>
            <strong style="display: block; font-size: 13px; line-height: 1.3; margin-bottom: 4px; color: #0f291e;">
              ${ev.title}
            </strong>
            <div style="font-size: 11px; color: #059669; font-weight: 700; margin-bottom: 6px;">
              ${ev.stall_fee_max ? `₹${ev.stall_fee_min?.toLocaleString('en-IN') || 0} – ₹${ev.stall_fee_max?.toLocaleString('en-IN')}` : 'Stall fee unannounced'}
            </div>
            <div style="display: flex; gap: 6px;">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${ev.latitude},${ev.longitude}" target="_blank" style="flex: 1; text-align: center; background: #f0f7f3; color: #0f291e; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 10px; border: 1px solid #d8e5dd;">
                Directions ↗
              </a>
            </div>
          </div>
        `,
      });

      marker.addListener('click', () => {
        onSelectEvent(ev);
        infoWindow.open(map, marker);
      });

      if (isSelected) {
        infoWindow.open(map, marker);
      }

      markersRef.current.push(marker);
    });
  }

  // 2. Leaflet Fallback Loader (Clean White/Mint OpenStreetMap)
  async function loadLeafletMap() {
    if (!containerRef.current) return;

    try {
      const L = await import('leaflet');

      if (mapInstanceRef.current && typeof mapInstanceRef.current.remove === 'function') {
        mapInstanceRef.current.remove();
      }

      const map = L.map(containerRef.current, {
        center: [DELHI_NCR_CENTER.lat, DELHI_NCR_CENTER.lng],
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
      });

      // CartoDB Positron / OSM Light for crisp white and green map
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      setMapEngine('leaflet');
      updateLeafletMarkers();
    } catch (err) {
      console.error('Failed to load Leaflet map:', err);
    }
  }

  async function updateLeafletMarkers() {
    const map = mapInstanceRef.current;
    if (!map) return;

    const L = await import('leaflet');

    markersRef.current.forEach((m) => {
      if (typeof m.remove === 'function') m.remove();
    });
    markersRef.current = [];

    events.forEach((ev) => {
      const isSelected = selectedEvent?.id === ev.id;
      const bgColor =
        ev.verification_status === 'unverified'
          ? 'bg-amber-500 text-white border-white'
          : ev.fit_score >= 80
          ? 'bg-[#059669] text-white border-white'
          : ev.fit_score >= 65
          ? 'bg-[#10b981] text-white border-white'
          : 'bg-[#527964] text-white border-white';

      const customIcon = L.divIcon({
        className: 'custom-mela-pin',
        html: `
          <div class="relative group cursor-pointer flex items-center justify-center transform transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
            <div class="w-8 h-8 rounded-full border-2 ${bgColor} flex items-center justify-center shadow-md font-black text-xs">
              ${ev.fit_score}
            </div>
            ${isSelected ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-[#059669] rounded-full animate-ping"></div>' : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([ev.latitude, ev.longitude], { icon: customIcon }).addTo(map);

      const popupHtml = `
        <div class="p-1 max-w-[250px] text-[#0f291e] font-sans">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">
              ${ev.verification_status.toUpperCase()}
            </span>
            <span class="text-[10px] text-[#527964]">${ev.locality}</span>
          </div>
          <h4 class="font-bold text-sm leading-tight text-[#0f291e] mb-1">${ev.title}</h4>
          <p class="text-xs text-[#059669] font-bold mb-2">
            ${ev.stall_fee_max ? `₹${ev.stall_fee_min?.toLocaleString('en-IN') || 0} – ₹${ev.stall_fee_max?.toLocaleString('en-IN')}` : 'Stall fee unannounced'}
          </p>
          <div class="flex items-center gap-2 pt-1.5 border-t border-[#e2ece6]">
            <span class="text-xs font-black text-[#059669]">Fit: ${ev.fit_score}/100</span>
            <button id="btn-popup-${ev.id}" class="text-[11px] bg-[#059669] hover:bg-[#047857] text-white font-bold px-2.5 py-1 rounded-lg ml-auto transition">
              View Intel
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
    if (mapEngine === 'google' && window.google?.maps) {
      mapInstanceRef.current.panTo(DELHI_NCR_CENTER);
      mapInstanceRef.current.setZoom(DEFAULT_ZOOM);
    } else if (mapEngine === 'leaflet') {
      mapInstanceRef.current.setView([DELHI_NCR_CENTER.lat, DELHI_NCR_CENTER.lng], DEFAULT_ZOOM, {
        animate: true,
      });
    }
  }

  return (
    <div className="relative w-full h-[620px] bg-white rounded-2xl overflow-hidden border border-[#dce8e1] shadow-sm">
      {/* Map DOM Element */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Top Engine & API Key Status Banner */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#dce8e1] text-xs font-semibold text-[#0f291e] shadow-sm">
          <Compass className="w-4 h-4 text-[#059669]" />
          <span>
            Engine: <strong className="text-[#059669] capitalize">{mapEngine === 'google' ? 'Google Maps Platform' : 'OpenStreetMap'}</strong>
          </span>
          {hasGoogleKey ? (
            <span className="text-[10px] text-[#047857] font-bold ml-1 px-1.5 py-0.5 rounded bg-[#ecfdf5] border border-[#a7f3d0]">
              Key Active
            </span>
          ) : (
            <span className="text-[10px] text-[#527964] font-medium ml-1 px-1.5 py-0.5 rounded bg-[#f0f7f3]">
              Default Tile Layer
            </span>
          )}
        </div>

        {!hasGoogleKey && onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ecfdf5] hover:bg-[#d1fae5] border border-[#a7f3d0] text-xs font-bold text-[#047857] shadow-sm transition"
          >
            <Key className="w-3.5 h-3.5 text-[#059669]" />
            <span>Connect Google Maps Key</span>
          </button>
        )}
      </div>

      {/* Recenter Navigation Button */}
      <button
        onClick={handleRecenter}
        className="absolute bottom-5 right-5 z-[400] p-2.5 rounded-xl bg-white hover:bg-[#f0f7f3] text-[#0f291e] border border-[#dce8e1] shadow-md transition"
        title="Recenter Map to Delhi NCR"
      >
        <Navigation className="w-4 h-4 text-[#059669]" />
      </button>

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-5 left-5 z-[400] hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#dce8e1] text-xs text-[#0f291e] shadow-md">
        <span className="font-bold text-[#0f291e]">Fit Score:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
          <span className="text-[#527964]">80+ (High)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
          <span className="text-[#527964]">65–79</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-[#527964]">Unverified</span>
        </div>
      </div>
    </div>
  );
}
