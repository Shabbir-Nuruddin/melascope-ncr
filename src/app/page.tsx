'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MelaEvent, UserProfile, EventFilters, UserStatus, FloorPlan } from '@/types';
import Navbar from '@/components/layout/Navbar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import FilterBar from '@/components/dashboard/FilterBar';
import EventCard from '@/components/dashboard/EventCard';
import EventDetailModal from '@/components/events/EventDetailModal';
import ResearchAssistantModal from '@/components/research/ResearchAssistantModal';
import SettingsModal from '@/components/settings/SettingsModal';
import AddToMelaScopeModal from '@/components/import/AddToMelaScopeModal';
import EventEditDialog from '@/components/events/EventEditDialog';
import PipelineView from '@/components/pipeline/PipelineView';
import {
  MapPin,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Inbox,
  Loader2,
} from 'lucide-react';

// Dynamic import of EventMap with SSR disabled (Leaflet & Google Maps require window)
const EventMap = dynamic(() => import('@/components/map/EventMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 text-xs">
      <Loader2 className="w-6 h-6 animate-spin text-amber-400 mb-2" />
      <span>Loading Delhi NCR Map...</span>
    </div>
  ),
});

export default function HomePage() {
  const [events, setEvents] = useState<MelaEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MelaEvent | null>(null);
  const [filters, setFilters] = useState<EventFilters>({
    sortBy: 'fit_score',
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<'map' | 'pipeline'>('map');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScouting, setIsScouting] = useState<boolean>(false);

  // Modals state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<MelaEvent> | null>(null);

  const cardListRef = useRef<HTMLDivElement>(null);

  // Initial data fetch
  useEffect(() => {
    fetchProfile();
    fetchEvents(filters);
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.profile) {
        setUserProfile(data.profile);
      }
    } catch (err) {
      console.error('Failed fetching profile:', err);
    }
  }

  async function fetchEvents(currentFilters: EventFilters = filters) {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.searchQuery) params.set('q', currentFilters.searchQuery);
      if (currentFilters.locality && currentFilters.locality !== 'all') params.set('locality', currentFilters.locality);
      if (currentFilters.eventType && currentFilters.eventType !== 'all') params.set('eventType', currentFilters.eventType);
      if (currentFilters.venueContext && currentFilters.venueContext !== 'all') params.set('venueContext', currentFilters.venueContext);
      if (currentFilters.dateHorizonDays) params.set('horizon', currentFilters.dateHorizonDays.toString());
      if (currentFilters.minScore) params.set('minScore', currentFilters.minScore.toString());
      if (currentFilters.maxStallFee) params.set('maxFee', currentFilters.maxStallFee.toString());
      if (currentFilters.verifiedOnly) params.set('verifiedOnly', 'true');
      if (currentFilters.bookingLinkOnly) params.set('bookingLinkOnly', 'true');
      if (currentFilters.userStatus && currentFilters.userStatus !== 'all') params.set('status', currentFilters.userStatus);
      if (currentFilters.sortBy) params.set('sortBy', currentFilters.sortBy);

      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
        // If selected event was updated or deleted
        if (selectedEvent) {
          const refreshed = data.events.find((e: MelaEvent) => e.id === selectedEvent.id);
          setSelectedEvent(refreshed || null);
        }
      }
    } catch (err) {
      console.error('Failed fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFilterChange(updates: Partial<EventFilters>) {
    const updated = { ...filters, ...updates };
    setFilters(updated);
    fetchEvents(updated);
  }

  function handleResetFilters() {
    const reset: EventFilters = { sortBy: 'fit_score' };
    setFilters(reset);
    fetchEvents(reset);
  }

  function handleSelectEvent(event: MelaEvent) {
    setSelectedEvent(event);
    // Scroll corresponding event card into view if in map view
    const cardElement = document.getElementById(`card-${event.id}`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function handleOpenDetails(event: MelaEvent) {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  }

  async function handleStatusChange(eventId: string, newStatus: UserStatus) {
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_status: newStatus }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, user_status: newStatus } : e))
        );
        if (selectedEvent?.id === eventId) {
          setSelectedEvent((prev) => (prev ? { ...prev, user_status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed updating event status:', err);
    }
  }

  async function handleSaveNotes(eventId: string, notes: string, nextActionAt?: string | null) {
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_notes: notes, next_action_at: nextActionAt }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, user_notes: notes, next_action_at: nextActionAt } : e))
        );
        if (selectedEvent?.id === eventId) {
          setSelectedEvent((prev) => (prev ? { ...prev, user_notes: notes, next_action_at: nextActionAt } : null));
        }
      }
    } catch (err) {
      console.error('Failed saving notes:', err);
    }
  }

  async function handleRefreshSources(eventId: string) {
    try {
      const res = await fetch(`/api/events/${eventId}/refresh`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.event) {
        setEvents((prev) => prev.map((e) => (e.id === eventId ? data.event : e)));
        setSelectedEvent(data.event);
      }
    } catch (err) {
      console.error('Failed refreshing sources:', err);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(null);
        }
      }
    } catch (err) {
      console.error('Failed deleting event:', err);
    }
  }

  async function handleSaveManualEvent(eventData: Partial<MelaEvent>) {
    try {
      const method = eventData.id ? 'PATCH' : 'POST';
      const endpoint = eventData.id ? `/api/events/${eventData.id}` : '/api/events';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (res.ok) {
        fetchEvents(filters);
      }
    } catch (err) {
      console.error('Failed saving event:', err);
    }
  }

  async function handleAttachFloorPlan(eventId: string, floorPlan: FloorPlan) {
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ floor_plan: floorPlan, has_floor_plan: true }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, floor_plan: floorPlan, has_floor_plan: true } : e))
        );
        if (selectedEvent?.id === eventId) {
          setSelectedEvent((prev) =>
            prev ? { ...prev, floor_plan: floorPlan, has_floor_plan: true } : null
          );
        }
      }
    } catch (err) {
      console.error('Failed attaching floor plan:', err);
    }
  }

  async function handleScoutNow() {
    setIsScouting(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'Discover upcoming Delhi NCR melas, craft markets, and flea market stalls from BookEventStall, Fleamela, and live sources',
          dateHorizonDays: 45,
        }),
      });
      if (res.ok) {
        await fetchEvents(filters);
      }
    } catch (err) {
      console.error('Failed running quick scout:', err);
    } finally {
      setIsScouting(false);
    }
  }

  function handleExportCsv() {
    const params = new URLSearchParams();
    if (filters.searchQuery) params.set('q', filters.searchQuery);
    if (filters.locality && filters.locality !== 'all') params.set('locality', filters.locality);
    if (filters.eventType && filters.eventType !== 'all') params.set('eventType', filters.eventType);
    if (filters.verifiedOnly) params.set('verifiedOnly', 'true');
    if (filters.bookingLinkOnly) params.set('bookingLinkOnly', 'true');
    if (filters.userStatus) params.set('status', filters.userStatus);

    window.open(`/api/export?${params.toString()}`, '_blank');
  }

  const savedCount = events.filter((e) => e.user_status === 'saved' || e.user_status === 'applied' || e.user_status === 'contacted').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* 1. Navigation Bar */}
      <Navbar
        activeView={activeView}
        onViewChange={(v) => setActiveView(v)}
        onOpenResearch={() => setIsResearchOpen(true)}
        onOpenAddEvent={() => setIsAddEventOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportCsv={handleExportCsv}
        userProfile={userProfile}
        savedCount={savedCount}
      />

      {/* 2. Top Dashboard Widgets Bar */}
      <DashboardStats
        events={events}
        onFilterMissingPrices={() => handleFilterChange({ maxStallFee: undefined })}
        onFilterFloorPlans={() => {
          setEvents((prev) => prev.filter((e) => e.has_floor_plan));
        }}
        onFilterDeadlines={() => handleFilterChange({ dateHorizonDays: 7 })}
        onScoutNow={handleScoutNow}
        isScouting={isScouting}
      />

      {/* Main View: Map Dashboard OR Pipeline View */}
      {activeView === 'pipeline' ? (
        <PipelineView
          events={events}
          onSelectEvent={handleSelectEvent}
          onStatusChange={handleStatusChange}
          onOpenDetails={handleOpenDetails}
          onExportCsv={handleExportCsv}
        />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* 3. Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onExportCsv={handleExportCsv}
            onOpenAddEvent={() => setIsAddEventOpen(true)}
            onOpenResearch={() => setIsResearchOpen(true)}
            totalCount={events.length}
          />

          {/* 4. Split Layout: Synchronised Cards List + Interactive Map */}
          <div className="flex-1 flex flex-col-reverse lg:flex-row overflow-hidden relative">
            {/* Left Column: Event Cards List */}
            <div
              ref={cardListRef}
              className="w-full lg:w-[480px] xl:w-[540px] flex-shrink-0 h-[50vh] lg:h-[calc(100vh-210px)] overflow-y-auto p-4 space-y-3.5 border-r border-slate-800 bg-slate-950/90"
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500 text-xs">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-2" />
                  <span>Loading opportunities across Delhi NCR...</span>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-20 text-slate-500 space-y-3">
                  <Inbox className="w-12 h-12 mx-auto text-slate-700" />
                  <div>
                    <h4 className="font-bold text-slate-300 text-sm">No matching events found</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                      Try relaxing your filters or launching an AI Scout run to discover new listings across Delhi NCR.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg transition"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                events.map((ev) => (
                  <div key={ev.id} id={`card-${ev.id}`}>
                    <EventCard
                      event={ev}
                      isSelected={selectedEvent?.id === ev.id}
                      onSelect={() => handleSelectEvent(ev)}
                      onOpenDetails={() => handleOpenDetails(ev)}
                      onStatusChange={(newStatus) => handleStatusChange(ev.id, newStatus)}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Right Column: Central Interactive Map */}
            <div className="flex-1 h-[45vh] lg:h-[calc(100vh-210px)] p-3 lg:p-4 bg-slate-950">
              <EventMap
                events={events}
                selectedEvent={selectedEvent}
                onSelectEvent={handleSelectEvent}
                onOpenDetails={handleOpenDetails}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Modals & Drawers */}
      {/* Event Details Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onStatusChange={handleStatusChange}
        onSaveNotes={handleSaveNotes}
        onRefreshSources={handleRefreshSources}
        onEdit={(ev) => {
          setEditingEvent(ev);
          setIsEditOpen(true);
        }}
        onDelete={handleDeleteEvent}
        onAttachFloorPlan={handleAttachFloorPlan}
      />

      {/* AI Research Assistant Modal */}
      <ResearchAssistantModal
        isOpen={isResearchOpen}
        onClose={() => setIsResearchOpen(false)}
        onRunCompleted={() => fetchEvents(filters)}
      />

      {/* Universal Add / Import to MelaScope Modal */}
      <AddToMelaScopeModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onEventCreated={handleSaveManualEvent}
        existingEvents={events}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onProfileUpdated={() => {
          fetchProfile();
          fetchEvents(filters);
        }}
      />

      {/* Manual Edit Event Dialog */}
      <EventEditDialog
        event={editingEvent}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveManualEvent}
      />
    </div>
  );
}
