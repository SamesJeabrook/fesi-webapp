"use client";

// Event Management Page Template
// Template for both admin and merchant event management interfaces

import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@/components/atoms';
import { Modal, AdminPageHeader, LocationPicker } from '@/components/molecules';
import { createEventAPI, EventAPIInterface } from '@/services/eventAPI';
import { Event, EventFormData, DailySchedule } from '@/types/events';
import { DailyScheduleCard } from '@/components/molecules/DailyScheduleCard';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './EventManagementTemplate.module.scss';

interface Merchant {
  id: string;
  business_name: string;
  name: string;
  email: string;
  username: string;
  status: string;
}

interface EventManagementTemplateProps {
  context: 'admin' | 'merchant';
  merchantId?: string;
  pageTitle?: string;
  backLink?: { label: string; href: string };
  adminContext?: string;
}

export function EventManagementTemplate({
  context,
  merchantId,
  pageTitle = 'Event Management',
  backLink,
  adminContext
}: EventManagementTemplateProps) {
  const { getAccessTokenSilently } = useAuth0();
  
  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [merchantLoading, setMerchantLoading] = useState(context === 'admin' && !!merchantId);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Helper function to create default schedule
  const createDefaultSchedule = (dayNumber: number): DailySchedule => ({
    dayNumber,
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    isActive: true
  });

  // Form state for creating/editing events
  const [eventForm, setEventForm] = useState<EventFormData>({
    name: '',
    latitude: 51.5074, // Default to London coordinates
    longitude: -0.1278,
    eventType: 'multi_day',
    isOpen: false,
    schedules: [createDefaultSchedule(1)]
  });

  // API instance
  const [api, setApi] = useState<EventAPIInterface | null>(null);

  // Initialize API when Auth0 is ready
  useEffect(() => {
    const initializeAPI = async () => {
      try {
        const getToken = async () => {
          return await getAccessTokenSilently({
            authorizationParams: {
              audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
            },
          });
        };
        
        const apiInstance = createEventAPI(context, getToken, merchantId);
        setApi(apiInstance);
      } catch (error) {
        console.error('Failed to initialize API:', error);
      }
    };

    initializeAPI();
  }, [context, getAccessTokenSilently]);

  // Load events when API is ready
  useEffect(() => {
    if (api) {
      loadEvents();
      if (context === 'admin' && merchantId) {
        fetchMerchant();
      }
    }
  }, [api, merchantId]);

  const fetchMerchant = async () => {
    if (!merchantId) return;
    
    try {
      setMerchantLoading(true);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/merchants/${merchantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMerchant(data.data);
      } else {
        console.error('Failed to fetch merchant details');
      }
    } catch (error) {
      console.error('Error fetching merchant:', error);
    } finally {
      setMerchantLoading(false);
    }
  };

  const loadEvents = async () => {
    if (!api) return;
    
    try {
      setLoading(true);
      const eventData = await api.getMerchantEvents();
      setEvents(eventData);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

    const handleCreateEvent = async () => {
    if (!api) return;
    
    try {
      setSubmitting(true);
      await api.createEvent(eventForm, merchantId);
      await loadEvents();
      setIsCreateModalOpen(false);
      setEventForm({
        name: '',
        latitude: 51.5074, // Default to London coordinates
        longitude: -0.1278,
        eventType: 'multi_day',
        isOpen: false,
        schedules: [createDefaultSchedule(1)]
      });
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEventForm({
      name: '',
      latitude: 51.5074, // Default to London coordinates
      longitude: -0.1278,
      eventType: 'multi_day',
      isOpen: false,
      schedules: [createDefaultSchedule(1)]
    });
  };

  const handleEditEvent = (event: Event) => {
    // Populate the form with the event data
    setEventForm({
      name: event.name || '',
      latitude: event.latitude,
      longitude: event.longitude,
      eventType: event.event_type as 'single_day' | 'multi_day',
      isOpen: event.is_open,
      schedules: event.schedules?.map((schedule, index) => ({
        dayNumber: index + 1,
        date: schedule.date,
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        isActive: schedule.is_active
      })) || [createDefaultSchedule(1)]
    });
    
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = async () => {
    if (!api || !selectedEvent) return;
    
    // Debug: Check what methods are available on the API instance
    console.log('API methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(api)));
    console.log('Has updateEvent:', typeof api.updateEvent);
    
    try {
      setSubmitting(true);
      
      // Update basic event details (name, location, status)
      await api.updateEvent(selectedEvent.id, {
        name: eventForm.name,
        latitude: eventForm.latitude,
        longitude: eventForm.longitude,
        isOpen: eventForm.isOpen
      });
      
      // If it's a multi-day event, also update schedules
      if (eventForm.eventType === 'multi_day' && eventForm.schedules) {
        await api.updateEventSchedules(selectedEvent.id, {
          schedules: eventForm.schedules.map((schedule, index) => ({
            ...schedule,
            dayNumber: index + 1
          }))
        });
      }
      
      await loadEvents();
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const addScheduleDay = () => {
    const newDay = (eventForm.schedules?.length || 0) + 1;
    setEventForm(prev => ({
      ...prev,
      schedules: [
        ...(prev.schedules || []),
        createDefaultSchedule(newDay)
      ]
    }));
  };

  const updateSchedule = (index: number, schedule: DailySchedule) => {
    setEventForm(prev => ({
      ...prev,
      schedules: prev.schedules?.map((s, i) => 
        i === index ? { ...schedule, dayNumber: i + 1 } : s
      ) || []
    }));
  };

  const removeSchedule = (index: number) => {
    if ((eventForm.schedules?.length || 0) <= 1) return;
    
    setEventForm(prev => ({
      ...prev,
      schedules: prev.schedules?.filter((_, i) => i !== index)
        .map((schedule, i) => ({ ...schedule, dayNumber: i + 1 })) || []
    }));
  };

  const toggleEventStatus = async (event: Event) => {
    if (!api) return;
    
    try {
      await api.toggleEventStatus(event.id, !event.is_open);
      await loadEvents();
    } catch (error) {
      console.error('Failed to toggle event status:', error);
    }
  };

  const formatEventDate = (event: Event) => {
    if (event.event_type === 'multi_day') {
      return `${new Date(event.event_start_date!).toLocaleDateString()} - ${new Date(event.event_end_date!).toLocaleDateString()}`;
    }
    return new Date(event.start_time).toLocaleDateString();
  };

  return (
    <div className={styles.eventManagement}>
      {/* Header */}
      <AdminPageHeader
        backLink={backLink}
        adminContext={adminContext || (context === 'admin' && merchant 
          ? `Managing events for ${merchant.business_name || merchant.name}`
          : context === 'admin' 
            ? 'Manage events across all merchants' 
            : undefined
        )}
        title={context === 'admin' && merchant
          ? `Events: ${merchant.business_name || merchant.name}`
          : pageTitle
        }
        description={context === 'admin' && merchant
          ? `Managing events for ${merchant.email} • @${merchant.username}`
          : context === 'admin' 
            ? 'Manage events across all merchants' 
            : 'Create and manage your multi-day events'
        }
        actions={
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            ➕ Create Event
          </Button>
        }
      />

      {merchantLoading && (
        <div className={styles.eventManagement__loading}>
          <Typography variant="body-small">
            Loading merchant details...
          </Typography>
        </div>
      )}

      {/* Events List */}
      <div className={styles.eventManagement__content}>
        {loading ? (
          <div className={styles.eventManagement__loading}>
            <Typography variant="body-medium">Loading events...</Typography>
          </div>
        ) : events.length === 0 ? (
          <div className={styles.eventManagement__empty}>
            <Typography variant="heading-4">No events found</Typography>
            <Typography variant="body-medium">Create your first multi-day event to get started</Typography>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className={styles.eventManagement__emptyButton}
            >
              Create Your First Event
            </Button>
          </div>
        ) : (
          <div className={styles.eventManagement__grid}>
            {events.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventCard__header}>
                  <Typography variant="heading-5" className={styles.eventCard__title}>
                    {event.name || 'Unnamed Event'}
                  </Typography>
                  <div className={styles.eventCard__badges}>
                    <span className={`${styles.eventCard__badge} ${event.is_open ? styles.eventCard__badge__active : styles.eventCard__badge__inactive}`}>
                      {event.is_open ? 'Open' : 'Closed'}
                    </span>
                    <span className={styles.eventCard__badge}>
                      {event.event_type === 'multi_day' ? `${event.total_days} days` : 'Single day'}
                    </span>
                  </div>
                </div>

                <div className={styles.eventCard__content}>
                  <div className={styles.eventCard__info}>
                    <span>📅 {formatEventDate(event)}</span>
                    <span>📍 {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}</span>
                    {event.merchant_name && (
                      <span>🏪 {event.merchant_name}</span>
                    )}
                  </div>

                  <div className={styles.eventCard__actions}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleEventStatus(event)}
                    >
                      {event.is_open ? '⏸️ Close' : '▶️ Open'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create Multi-Day Event"
      >
        <div className={styles.eventForm}>
          <div className={styles.eventForm__section}>
            <Typography variant="heading-6">Event Details</Typography>
            
            <div className={styles.eventForm__field}>
              <label className={styles.eventForm__label}>Event Name</label>
              <input
                type="text"
                value={eventForm.name}
                onChange={(e) => setEventForm(prev => ({ ...prev, name: e.target.value }))}
                className={styles.eventForm__input}
                placeholder="Enter event name"
              />
            </div>

            <div className={styles.eventForm__field}>
              <label className={styles.eventForm__checkboxLabel}>
                <input
                  type="checkbox"
                  checked={eventForm.isOpen}
                  onChange={(e) => setEventForm(prev => ({ ...prev, isOpen: e.target.checked }))}
                />
                Event is open for orders
              </label>
            </div>
          </div>

          <div className={styles.eventForm__section}>
            <Typography variant="heading-6">Event Location</Typography>
            <LocationPicker
              latitude={eventForm.latitude}
              longitude={eventForm.longitude}
              onLocationChange={(lat, lng) => {
                setEventForm(prev => ({ 
                  ...prev, 
                  latitude: lat, 
                  longitude: lng 
                }));
              }}
              label="Set event location"
              height="400px"
            />
          </div>

          <div className={styles.eventForm__section}>
            <div className={styles.eventForm__sectionHeader}>
              <Typography variant="heading-6">Daily Schedules</Typography>
              <Button
                variant="secondary"
                size="sm"
                onClick={addScheduleDay}
              >
                ➕ Add Day
              </Button>
            </div>

            <div className={styles.eventForm__schedules}>
              {eventForm.schedules?.map((schedule, index) => (
                <DailyScheduleCard
                  key={index}
                  schedule={schedule}
                  onUpdate={(updatedSchedule) => updateSchedule(index, updatedSchedule)}
                  onRemove={() => removeSchedule(index)}
                  canRemove={(eventForm.schedules?.length || 0) > 1}
                  dayLabel={`Day ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.eventForm__actions}>
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              isDisabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateEvent}
              isDisabled={submitting || !eventForm.name.trim()}
            >
              {submitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
          resetForm();
        }}
        title={`Edit Event: ${selectedEvent?.name || 'Event'}`}
      >
        <div className={styles.eventForm}>
          <div className={styles.eventForm__section}>
            <Typography variant="heading-6">Event Details</Typography>
            
            <div className={styles.eventForm__field}>
              <label className={styles.eventForm__label}>Event Name</label>
              <input
                type="text"
                value={eventForm.name}
                onChange={(e) => setEventForm(prev => ({ ...prev, name: e.target.value }))}
                className={styles.eventForm__input}
                placeholder="Enter event name"
              />
            </div>

            <div className={styles.eventForm__field}>
              <label className={styles.eventForm__checkboxLabel}>
                <input
                  type="checkbox"
                  checked={eventForm.isOpen}
                  onChange={(e) => setEventForm(prev => ({ ...prev, isOpen: e.target.checked }))}
                />
                Event is open for orders
              </label>
            </div>
          </div>

          <div className={styles.eventForm__section}>
            <Typography variant="heading-6">Event Location</Typography>
            <LocationPicker
              latitude={eventForm.latitude}
              longitude={eventForm.longitude}
              onLocationChange={(lat, lng) => {
                setEventForm(prev => ({ 
                  ...prev, 
                  latitude: lat, 
                  longitude: lng 
                }));
              }}
              label="Set event location"
              height="400px"
            />
          </div>

          <div className={styles.eventForm__section}>
            <div className={styles.eventForm__sectionHeader}>
              <Typography variant="heading-6">Daily Schedules</Typography>
              <Button
                variant="secondary"
                size="sm"
                onClick={addScheduleDay}
              >
                ➕ Add Day
              </Button>
            </div>

            <div className={styles.eventForm__schedules}>
              {eventForm.schedules?.map((schedule, index) => (
                <DailyScheduleCard
                  key={index}
                  schedule={schedule}
                  onUpdate={(updatedSchedule) => updateSchedule(index, updatedSchedule)}
                  onRemove={() => removeSchedule(index)}
                  canRemove={(eventForm.schedules?.length || 0) > 1}
                />
              ))}
            </div>
          </div>

          <div className={styles.eventForm__actions}>
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedEvent(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateEvent}
              isDisabled={submitting || !eventForm.name.trim()}
            >
              {submitting ? 'Updating...' : 'Update Event'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}