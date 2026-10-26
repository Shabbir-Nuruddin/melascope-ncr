'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MelaEvent, UserProfile, EventFilters, UserStatus, FloorPlan } from '@/types';
import Navbar from '@/components/layout/Navbar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import FilterBar from '@/components/dashboard/FilterBar';
import EventCard from '@/components/dashboard/EventCard';
import EventTableView from '@/components/dashboard/EventTableView';
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

export default function HomePage() {
  const [events, setEvents] = useState<MelaEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MelaEvent | null>(null);
  const [filters, setFilters] = useState<EventFilters>({
    sortBy: 'fit_score',
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<'map' | 'pipeline'>('map');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
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
      if (currentFilters.city && currentFilters.city !== 'all') params.set('city', currentFilters.city);
      if (currentFilters.locality && currentFilters.locality !== 'all') params.set('locality', currentFilters.locality);
      if (currentFilters.eventType && currentFilters.eventType !== 'all') params.set('eventType', currentFilters.eventType);
      if (currentFilters.venueContext && currentFilters.venueContext !== 'all') params.set('venueContext', currentFilters.venueContext);
      if (currentFilters.dateHorizonDays) params.set('horizon', currentFilters.dateHorizonDays.toString());
      if (currentFilters.startDate) params.set('startDate', currentFilters.startDate);
      if (currentFilters.endDate) params.set('endDate', currentFilters.endDate);
      if (currentFilters.minFitScore) params.set('minScore', currentFilters.minFitScore.toString());
      else if (currentFilters.minScore) params.set('minScore', currentFilters.minScore.toString());
      if (currentFilters.maxStallFee) params.set('maxFee', currentFilters.maxStallFee.toString());
      if (currentFilters.verifiedOnly) params.set('verifiedOnly', 'true');
      if (currentFilters.hasBookingLink || currentFilters.bookingLinkOnly) params.set('bookingLinkOnly', 'true');
      if (currentFilters.hasFloorPlanOnly) params.set('hasFloorPlanOnly', 'true');
      if (currentFilters.userStatus && currentFilters.userStatus !== 'all') params.set('status', currentFilters.userStatus);
      if (currentFilters.sortBy) params.set('sortBy', currentFilters.sortBy);

      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
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
          prev.map((e) =>
            e.id === eventId ? { ...e, user_notes: notes, next_action_at: nextActionAt } : e
          )
        );
        if (selectedEvent?.id === eventId) {
          setSelectedEvent((prev) =>
            prev ? { ...prev, user_notes: notes, next_action_at: nextActionAt } : null
          );
        }
      }
    } catch (err) {
      console.error('Failed saving notes:', err);
    }
  }

  async function handleRefreshSources(eventId: string) {
    try {
      const res = await fetch(`/api/events/${eventId}/refresh`, { method: 'POST' });
      const data = await res.json();
      if (data.event) {
        setEvents((prev) => prev.map((e) => (e.id === eventId ? data.event : e)));
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(data.event);
        }
      }
    } catch (err) {
      console.error('Failed refreshing sources:', err);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
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
      if (eventData.id) {
        // Edit existing
        const res = await fetch(`/api/events/${eventData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
        if (res.ok) {
          fetchEvents(filters);
          setIsEditOpen(false);
          setEditingEvent(null);
        }
      } else {
        // Create new
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
        if (res.ok) {
          fetchEvents(filters);
          setIsAddEventOpen(false);
        }
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
        body: JSON.stringify({
          floor_plan: floorPlan,
          has_floor_plan: true,
        }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === eventId ? { ...e, floor_plan: floorPlan, has_floor_plan: true } : e
          )
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

  async function handleExportCsv() {
    window.open('/api/export', '_blank');
  }

  async function handleScoutNow() {
    setIsScouting(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'Discover upcoming Diwali & pre-Christmas winter melas across Delhi, Gurugram, and Noida with confirmed stall fees through Dec 23',
          dateHorizonDays: 60,
        }),
      });
      if (res.ok) {
        fetchEvents(filters);
      }
    } catch (err) {
      console.error('Failed auto scout:', err);
    } finally {
      setIsScouting(false);
    }
  }

  const savedCount = events.filter(
    (e) => e.user_status === 'saved' || e.user_status === 'applied' || e.user_status === 'booked'
  ).length;

  return (
    <div className="min-h-screen bg-[#060b08] text-[#f0fdf4] flex flex-col font-sans selection:bg-[#00df81]/30 selection:text-[#00ff87]">
      {/* 1. Header Navigation */}
      <Navbar
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenResearch={() => setIsResearchOpen(true)}
        onOpenAddEvent={() => setIsAddEventOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportCsv={handleExportCsv}
        userProfile={userProfile}
        savedCount={savedCount}
      />

      {/* 2. Commercial Intelligence Stats Header */}
      <DashboardStats
        events={events}
        onFilterMissingPrices={() => {
          setEvents((prev) =>
            prev.filter((e) => e.stall_fee_max === null || e.stall_fee_max === undefined)
          );
        }}
        onFilterFloorPlans={() => {
          setEvents((prev) => prev.filter((e) => e.has_floor_plan));
        }}
        onFilterDeadlines={() => handleFilterChange({ dateHorizonDays: 7 })}
        onScoutNow={handleScoutNow}
        isScouting={isScouting}
      />

      {/* Main View: Discovery Workspace OR Pipeline View */}
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
          {/* 3. Intuitive Filter & View Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onExportCsv={handleExportCsv}
            onOpenAddEvent={() => setIsAddEventOpen(true)}
            onOpenResearch={() => setIsResearchOpen(true)}
            totalCount={events.length}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* 4. Full-Width Intuitive Content Workspace (Map Removed) */}
          <div className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-28 text-[#6e8a7b] text-sm">
                <Loader2 className="w-8 h-8 animate-spin text-[#00df81] mb-3" />
                <span>Loading opportunities across Delhi NCR...</span>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-24 text-[#6e8a7b] space-y-3 bg-[#0c1510] border border-[#1c3327] rounded-2xl p-8 max-w-md mx-auto">
                <Inbox className="w-12 h-12 mx-auto text-[#1c3327]" />
                <div>
                  <h4 className="font-bold text-[#f0fdf4] text-base">No matching events found</h4>
                  <p className="text-xs text-[#6e8a7b] mt-1">
                    Try clearing your filters or launching an AI Scout run to discover new listings across Delhi NCR.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#0f1a14] hover:bg-[#15241c] text-[#f0fdf4] border border-[#1c3327] font-semibold text-xs rounded-xl transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* High-impact 3-column / 2-column Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {events.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    isSelected={selectedEvent?.id === ev.id}
                    onSelect={() => handleSelectEvent(ev)}
                    onOpenDetails={() => handleOpenDetails(ev)}
                    onStatusChange={(newStatus) => handleStatusChange(ev.id, newStatus)}
                  />
                ))}
              </div>
            ) : (
              /* Comparison Spreadsheet Table */
              <EventTableView
                events={events}
                selectedEvent={selectedEvent}
                onSelectEvent={handleSelectEvent}
                onOpenDetails={handleOpenDetails}
                onStatusChange={handleStatusChange}
              />
            )}
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
