// Event Manager Organism
// Main component for managing events with full CRUD functionality

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  MapPin,
  RefreshCw
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventCard } from '@/components/molecules/EventCard';
import { MultiDayEventModal } from '@/components/molecules/MultiDayEventModal';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { createEventAPI, EventAPIInterface } from '@/services/eventAPI';
import { Event, EventFormData } from '@/types/events';
import { useToast } from '@/hooks/use-toast';

interface EventManagerProps {
  context: 'admin' | 'merchant';
  merchantId?: string; // For admin context to filter by merchant
  title?: string;
  showCreateButton?: boolean;
  showFilters?: boolean;
  compact?: boolean;
}

type FilterType = 'all' | 'active' | 'upcoming' | 'ended' | 'single_day' | 'multi_day';

export function EventManager({
  context,
  merchantId,
  title = 'Event Management',
  showCreateButton = true,
  showFilters = true,
  compact = false
}: EventManagerProps) {
  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // API instance
  const [api] = useState<EventAPIInterface>(() => createEventAPI(context));
  const { toast } = useToast();

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, [merchantId]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventData = await api.getMerchantEvents();
      setEvents(eventData);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and search events
  const filteredEvents = events.filter(event => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        event.name?.toLowerCase().includes(searchLower) ||
        event.merchant_name?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filter === 'single_day' || filter === 'multi_day') {
      return event.event_type === filter;
    }

    // Status filter
    if (filter !== 'all') {
      const now = new Date();
      const startDate = new Date(event.event_start_date || event.start_time);
      const endDate = new Date(event.event_end_date || event.end_time);

      switch (filter) {
        case 'active':
          return event.is_open && now >= startDate && now <= endDate;
        case 'upcoming':
          return now < startDate;
        case 'ended':
          return now > endDate;
        default:
          return true;
      }
    }

    return true;
  });

  // Event handlers
  const handleCreateEvent = async (formData: EventFormData) => {
    try {
      setSubmitting(true);
      await api.createEvent(formData);
      await loadEvents();
      toast({
        title: 'Success',
        description: 'Event created successfully!',
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
      throw error; // Re-throw so modal can handle it
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEvent = async (formData: EventFormData) => {
    if (!selectedEvent) return;

    try {
      setSubmitting(true);
      
      if (formData.eventType === 'multi_day' && formData.schedules) {
        await api.updateEventSchedules(selectedEvent.id, { schedules: formData.schedules });
      } else {
        // Handle single day event update
        // This would require additional API endpoint
        toast({
          title: 'Info',
          description: 'Single day event editing not yet implemented',
        });
      }
      
      await loadEvents();
      toast({
        title: 'Success',
        description: 'Event updated successfully!',
      });
      setIsEditModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to update event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      setSubmitting(true);
      await api.deleteEvent(selectedEvent.id);
      await loadEvents();
      toast({
        title: 'Success',
        description: 'Event deleted successfully!',
      });
      setIsDeleteModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleEventStatus = async (event: Event, isOpen: boolean) => {
    try {
      await api.toggleEventStatus(event.id, isOpen);
      await loadEvents();
      toast({
        title: 'Success',
        description: `Event ${isOpen ? 'opened' : 'closed'} for orders!`,
      });
    } catch (error) {
      console.error('Failed to toggle event status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleViewEvent = async (event: Event) => {
    try {
      const eventWithSchedules = await api.getEventWithSchedules(event.id);
      setSelectedEvent(eventWithSchedules);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Failed to load event details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load event details.',
        variant: 'destructive',
      });
    }
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">
            {context === 'admin' ? 'Manage events across all merchants' : 'Manage your events and schedules'}
          </p>
        </div>
        {showCreateButton && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="active">Active Now</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
              <SelectItem value="single_day">Single Day</SelectItem>
              <SelectItem value="multi_day">Multi Day</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={loadEvents} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first event'
              }
            </p>
            {showCreateButton && !searchTerm && filter === 'all' && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            )}
          </div>
        ) : (
          <div className={compact ? 'grid gap-3' : 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'}>
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onView={handleViewEvent}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onToggleStatus={handleToggleEventStatus}
                compact={compact}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <MultiDayEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
        isLoading={submitting}
        mode="create"
      />

      <MultiDayEventModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleEditEvent}
        initialData={selectedEvent || undefined}
        isLoading={submitting}
        mode="edit"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        description={`Are you sure you want to delete "${selectedEvent?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={submitting}
        variant="destructive"
      />
    </div>
  );
}