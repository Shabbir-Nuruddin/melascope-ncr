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

    // TETR Dark Obsidian Style for Google Maps
    const darkMapStyle = [
      { elementType: 'geometry', stylers: [{ color: '#060b08' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#060b08' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#6e8a7b' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#00df81' }],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6e8a7b' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#0a160f' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#121e17' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1c3327' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#1c3327' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#030805' }],
      },
    ];

    const map = new window.google.maps.Map(containerRef.current, {
      center: DELHI_NCR_CENTER,
      zoom: DEFAULT_ZOOM,
      styles: darkMapStyle,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;
    setMapMode('google');
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
      const markerColor = ev.verification_status === 'unverified'
        ? '#f59e0b'
        : ev.fit_score >= 80
        ? '#00df81'
        : ev.fit_score >= 65
        ? '#a3e635'
        : '#6e8a7b';

      const marker = new window.google.maps.Marker({
        position: { lat: ev.latitude, lng: ev.longitude },
        map: map,
        title: ev.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 11 : 8,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: isSelected ? '#ffffff' : '#060b08',
          strokeWeight: isSelected ? 3 : 2,
        },
      });

      marker.addListener('click', () => {
        onSelectEvent(ev);
      });

      markersRef.current.push(marker);
    });
  }

  // 2. Leaflet Fallback Loader (CartoDB Dark Matter for TETR Obsidian look)
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

      // CartoDB Dark Matter tiles for modern TETR dark aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
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
        ? 'bg-amber-500 text-black border-amber-300'
        : ev.fit_score >= 80
        ? 'bg-[#00df81] text-[#060b08] border-[#00ff87]'
        : ev.fit_score >= 65
        ? 'bg-[#a3e635] text-[#060b08] border-[#bef264]'
        : 'bg-[#15241c] text-[#f0fdf4] border-[#1c3327]';

      const customIcon = L.divIcon({
        className: 'custom-mela-pin',
        html: `
          <div class="relative group cursor-pointer flex items-center justify-center transform transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
            <div class="w-8 h-8 rounded-full border-2 ${bgColor} flex items-center justify-center shadow-lg font-black text-xs">
              ${ev.fit_score}
            </div>
            ${isSelected ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-[#00df81] rounded-full animate-ping"></div>' : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([ev.latitude, ev.longitude], { icon: customIcon }).addTo(map);

      // Popup content with TETR styling
      const popupHtml = `
        <div class="p-1 max-w-[260px] text-[#f0fdf4] font-sans">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              ev.verification_status === 'verified' ? 'bg-[#00df81]/20 text-[#00df81] border border-[#00df81]/30' : 'bg-amber-950/80 text-amber-300'
            }">
              ${ev.verification_status.toUpperCase()}
            </span>
            <span class="text-[10px] text-[#6e8a7b]">${ev.locality}, ${ev.city}</span>
          </div>
          <h4 class="font-bold text-sm leading-tight text-white mb-1">${ev.title}</h4>
          <p class="text-xs text-[#00df81] font-semibold mb-1">
            ${ev.stall_fee_max ? `₹${ev.stall_fee_min?.toLocaleString('en-IN') || 0} - ₹${ev.stall_fee_max?.toLocaleString('en-IN')}` : 'Stall fee unannounced'}
          </p>
          <div class="flex items-center justify-between pt-1 border-t border-[#1c3327] mt-1">
            <span class="text-xs font-black text-[#00df81]">Fit: ${ev.fit_score}/100</span>
            <button id="btn-popup-${ev.id}" class="text-[11px] bg-[#00df81] hover:bg-[#00ff87] text-[#060b08] font-black px-2.5 py-0.5 rounded transition">
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
    <div className="relative w-full h-full min-h-[460px] bg-[#060b08] rounded-xl overflow-hidden border border-[#1c3327] shadow-xl">
      {/* Map DOM Element */}
      <div ref={containerRef} className="w-full h-full min-h-[460px]" />

      {/* Map Engine Badge (Top Left) */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0c1510]/90 backdrop-blur-md border border-[#1c3327] text-[11px] text-[#6e8a7b] shadow">
        <Compass className="w-3.5 h-3.5 text-[#00df81]" />
        <span>Engine: <strong className="text-white capitalize">{mapMode}</strong></span>
        {!hasGoogleKey && (
          <span className="text-[10px] text-[#00df81] font-mono ml-1 px-1 rounded bg-[#00df81]/15">
            CartoDB Dark
          </span>
        )}
      </div>

      {/* Recenter Control Button (Bottom Right) */}
      <button
        onClick={handleRecenter}
        className="absolute bottom-4 right-4 z-[400] p-2 rounded-xl bg-[#0c1510] hover:bg-[#121e17] text-[#6e8a7b] hover:text-[#00df81] border border-[#1c3327] hover:border-[#00df81]/50 shadow-lg transition"
        title="Recenter Map to Delhi NCR"
      >
        <Navigation className="w-4 h-4 text-[#00df81]" />
      </button>

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#0c1510]/95 backdrop-blur-md border border-[#1c3327] text-[10px] text-[#6e8a7b] shadow-lg">
        <span className="font-bold text-[#f0fdf4]">Fit Score:</span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00df81]" />
          <span>80+ (High)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#a3e635]" />
          <span>65–79 (Mid)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Unverified Lead</span>
        </div>
      </div>
    </div>
  );
}
