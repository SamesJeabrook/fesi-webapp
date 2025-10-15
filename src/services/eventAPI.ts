// Event API Service
// Provides API abstraction for event management with admin and merchant contexts

import { getAccessToken } from '@auth0/nextjs-auth0';
import { 
  Event, 
  MultiDayEventData, 
  UpdateSchedulesRequest, 
  EventActiveResponse,
  EventFormData,
  DailySchedule 
} from '@/types/events';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface EventAPIInterface {
  // Event CRUD operations
  createEvent(data: EventFormData): Promise<Event>;
  createMultiDayEvent(data: MultiDayEventData): Promise<Event>;
  getEventById(eventId: string): Promise<Event>;
  getEventWithSchedules(eventId: string): Promise<Event>;
  updateEventSchedules(eventId: string, data: UpdateSchedulesRequest): Promise<Event>;
  deleteEvent(eventId: string): Promise<void>;
  
  // Event status operations
  toggleEventStatus(eventId: string, isOpen: boolean): Promise<Event>;
  isEventActiveNow(eventId: string): Promise<EventActiveResponse>;
  
  // Event listing
  getMerchantEvents(params?: { limit?: number; offset?: number }): Promise<Event[]>;
  getNearbyEvents(params: { latitude: number; longitude: number; radius?: number }): Promise<Event[]>;
}

class AdminEventAPI implements EventAPIInterface {
  private async getAuthHeaders() {
    const { accessToken } = await getAccessToken();
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async createEvent(data: EventFormData): Promise<Event> {
    if (data.eventType === 'multi_day' && data.schedules) {
      return this.createMultiDayEvent({
        eventData: {
          name: data.name,
          latitude: 0, // Will be set by admin
          longitude: 0, // Will be set by admin
          groupEventId: data.groupEventId,
          isOpen: data.isOpen
        },
        schedules: data.schedules
      });
    }

    // Single day event creation
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({
        merchant_id: data.merchantId, // Admin specifies merchant
        name: data.name,
        group_event_id: data.groupEventId,
        latitude: 0, // Admin sets location
        longitude: 0,
        start_time: data.date && data.startTime ? `${data.date}T${data.startTime}` : undefined,
        end_time: data.date && data.endTime ? `${data.date}T${data.endTime}` : undefined,
        is_open: data.isOpen
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    return response.json();
  }

  async createMultiDayEvent(data: MultiDayEventData): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/multi-day`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create multi-day event: ${response.statusText}`);
    }

    return response.json();
  }

  async getEventById(eventId: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    return response.json();
  }

  async getEventWithSchedules(eventId: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/schedules`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event with schedules: ${response.statusText}`);
    }

    return response.json();
  }

  async updateEventSchedules(eventId: string, data: UpdateSchedulesRequest): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/schedules`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update event schedules: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteEvent(eventId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  }

  async toggleEventStatus(eventId: string, isOpen: boolean): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/status`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ is_open: isOpen }),
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle event status: ${response.statusText}`);
    }

    return response.json();
  }

  async isEventActiveNow(eventId: string): Promise<EventActiveResponse> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/active-now`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to check event status: ${response.statusText}`);
    }

    return response.json();
  }

  async getMerchantEvents(params?: { limit?: number; offset?: number }): Promise<Event[]> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(`${API_BASE_URL}/events/merchant?${queryParams}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch merchant events: ${response.statusText}`);
    }

    return response.json();
  }

  async getNearbyEvents(params: { latitude: number; longitude: number; radius?: number }): Promise<Event[]> {
    const queryParams = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
    });
    if (params.radius) queryParams.append('radius_km', params.radius.toString());

    const response = await fetch(`${API_BASE_URL}/events/nearby?${queryParams}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch nearby events: ${response.statusText}`);
    }

    return response.json();
  }
}

class MerchantEventAPI implements EventAPIInterface {
  private async getAuthHeaders() {
    const { accessToken } = await getAccessToken();
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async createEvent(data: EventFormData): Promise<Event> {
    if (data.eventType === 'multi_day' && data.schedules) {
      return this.createMultiDayEvent({
        eventData: {
          name: data.name,
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          groupEventId: data.groupEventId,
          isOpen: data.isOpen
        },
        schedules: data.schedules
      });
    }

    // Single day event creation (merchant auto-scoped)
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({
        name: data.name,
        group_event_id: data.groupEventId,
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        start_time: data.date && data.startTime ? `${data.date}T${data.startTime}` : undefined,
        end_time: data.date && data.endTime ? `${data.date}T${data.endTime}` : undefined,
        is_open: data.isOpen
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    return response.json();
  }

  async createMultiDayEvent(data: MultiDayEventData): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/multi-day`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create multi-day event: ${response.statusText}`);
    }

    return response.json();
  }

  async getEventById(eventId: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    return response.json();
  }

  async getEventWithSchedules(eventId: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/schedules`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event with schedules: ${response.statusText}`);
    }

    return response.json();
  }

  async updateEventSchedules(eventId: string, data: UpdateSchedulesRequest): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/schedules`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update event schedules: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteEvent(eventId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  }

  async toggleEventStatus(eventId: string, isOpen: boolean): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/status`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ is_open: isOpen }),
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle event status: ${response.statusText}`);
    }

    return response.json();
  }

  async isEventActiveNow(eventId: string): Promise<EventActiveResponse> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/active-now`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to check event status: ${response.statusText}`);
    }

    return response.json();
  }

  async getMerchantEvents(params?: { limit?: number; offset?: number }): Promise<Event[]> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(`${API_BASE_URL}/events/merchant?${queryParams}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch merchant events: ${response.statusText}`);
    }

    return response.json();
  }

  async getNearbyEvents(params: { latitude: number; longitude: number; radius?: number }): Promise<Event[]> {
    const queryParams = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
    });
    if (params.radius) queryParams.append('radius_km', params.radius.toString());

    const response = await fetch(`${API_BASE_URL}/events/nearby?${queryParams}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch nearby events: ${response.statusText}`);
    }

    return response.json();
  }
}

// Factory function to create the appropriate API instance
export function createEventAPI(context: 'admin' | 'merchant'): EventAPIInterface {
  switch (context) {
    case 'admin':
      return new AdminEventAPI();
    case 'merchant':
      return new MerchantEventAPI();
    default:
      throw new Error(`Unknown event API context: ${context}`);
  }
}

export { AdminEventAPI, MerchantEventAPI };
export type { EventAPIInterface };