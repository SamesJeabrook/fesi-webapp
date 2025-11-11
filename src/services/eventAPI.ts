// Event API Service
// Provides API abstraction for event management with admin and merchant contexts

import { 
  Event, 
  MultiDayEventData, 
  UpdateSchedulesRequest, 
  EventActiveResponse,
  EventFormData,
  DailySchedule 
} from '@/types/events';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/';

type GetAccessTokenFunction = () => Promise<string>;

interface EventAPIInterface {
  // Event CRUD operations
  createEvent(data: EventFormData, merchantId?: string): Promise<Event>;
  createMultiDayEvent(data: MultiDayEventData, merchantId?: string): Promise<Event>;
  getEventById(eventId: string): Promise<Event>;
  getEventWithSchedules(eventId: string): Promise<Event>;
  updateEvent(eventId: string, data: Partial<EventFormData>): Promise<Event>;
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
  constructor(private getAccessToken: GetAccessTokenFunction, private merchantId?: string) {}

  private async getAuthHeaders() {
    const accessToken = await this.getAccessToken();
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async createEvent(data: EventFormData, merchantId?: string): Promise<Event> {
    if (data.eventType === 'multi_day' && data.schedules) {
      return this.createMultiDayEvent({
        eventData: {
          name: data.name,
          latitude: data.latitude,
          longitude: data.longitude,
          groupEventId: data.groupEventId,
          isOpen: data.isOpen
        },
        schedules: data.schedules
      }, merchantId);
    }

    // Single day event creation (admin specifies merchant)
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({
        name: data.name,
        group_event_id: data.groupEventId,
        latitude: data.latitude,
        longitude: data.longitude,
        start_time: data.date && data.startTime ? `${data.date}T${data.startTime}` : undefined,
        end_time: data.date && data.endTime ? `${data.date}T${data.endTime}` : undefined,
        is_open: data.isOpen,
        merchant_id: merchantId // Admin specifies merchant
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    return response.json();
  }

  async createMultiDayEvent(data: MultiDayEventData, merchantId?: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/multi-day`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        merchant_id: merchantId // Admin specifies merchant
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create multi-day event: ${response.statusText}`);
    }

    return response.json();
  }

  async getEventById(eventId: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    return response.json();
  }

  async getEventWithSchedules(eventId: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/schedules`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event with schedules: ${response.statusText}`);
    }

    return response.json();
  }

  async updateEventSchedules(eventId: string, data: UpdateSchedulesRequest): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/schedules`, {
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
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  }

  async toggleEventStatus(eventId: string, isOpen: boolean): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/toggle-open`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ is_open: isOpen }),
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle event status: ${response.statusText}`);
    }

    return response.json();
  }

  async isEventActiveNow(eventId: string): Promise<EventActiveResponse> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/active-now`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to check event status: ${response.statusText}`);
    }

    return response.json();
  }

  async getMerchantEvents(params?: { limit?: number; offset?: number }): Promise<Event[]> {
    const queryParams = new URLSearchParams();
    if (this.merchantId) queryParams.append('merchant_id', this.merchantId);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(`${API_BASE_URL}/api/events?${queryParams}`, {
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

    const response = await fetch(`${API_BASE_URL}/api/events/nearby?${queryParams}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch nearby events: ${response.statusText}`);
    }

    return response.json();
  }

  async updateEvent(eventId: string, data: Partial<EventFormData>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        is_open: data.isOpen
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update event: ${response.statusText}`);
    }

    return response.json();
  }
}

class MerchantEventAPI implements EventAPIInterface {
  constructor(private getAccessToken: GetAccessTokenFunction, private merchantId?: string) {}

  private async getAuthHeaders() {
    const accessToken = await this.getAccessToken();
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async createEvent(data: EventFormData, merchantId?: string): Promise<Event> {
    if (data.eventType === 'multi_day' && data.schedules) {
      return this.createMultiDayEvent({
        eventData: {
          name: data.name,
          latitude: data.latitude,
          longitude: data.longitude,
          groupEventId: data.groupEventId,
          isOpen: data.isOpen
        },
        schedules: data.schedules
      });
    }

    // Single day event creation (merchant auto-scoped)
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({
        name: data.name,
        group_event_id: data.groupEventId,
        latitude: data.latitude,
        longitude: data.longitude,
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

  async createMultiDayEvent(data: MultiDayEventData, merchantId?: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/multi-day`, {
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
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    return response.json();
  }

  async getEventWithSchedules(eventId: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/schedules`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event with schedules: ${response.statusText}`);
    }

    return response.json();
  }

  async updateEventSchedules(eventId: string, data: UpdateSchedulesRequest): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/schedules`, {
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
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  }

  async toggleEventStatus(eventId: string, isOpen: boolean): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/toggle-open`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ is_open: isOpen }),
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle event status: ${response.statusText}`);
    }

    return response.json();
  }

  async isEventActiveNow(eventId: string): Promise<EventActiveResponse> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/active-now`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to check event status: ${response.statusText}`);
    }

    return response.json();
  }

  async getMerchantEvents(params?: { limit?: number; offset?: number }): Promise<Event[]> {
    const queryParams = new URLSearchParams();
    if (this.merchantId) queryParams.append('merchant_id', this.merchantId);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const response = await fetch(`${API_BASE_URL}/api/events?${queryParams}`, {
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

    const response = await fetch(`${API_BASE_URL}/api/events/nearby?${queryParams}`, {
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch nearby events: ${response.statusText}`);
    }

    return response.json();
  }

  async updateEvent(eventId: string, data: Partial<EventFormData>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        is_open: data.isOpen
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update event: ${response.statusText}`);
    }

    return response.json();
  }
}

// Factory function to create the appropriate API instance
export function createEventAPI(context: 'admin' | 'merchant', getAccessToken: GetAccessTokenFunction, merchantId?: string): EventAPIInterface {
  switch (context) {
    case 'admin':
      return new AdminEventAPI(getAccessToken, merchantId);
    case 'merchant':
      return new MerchantEventAPI(getAccessToken, merchantId);
    default:
      throw new Error(`Unknown event API context: ${context}`);
  }
}

export type { EventAPIInterface };