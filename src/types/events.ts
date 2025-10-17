// Event-related TypeScript interfaces for multi-day events

export interface DailySchedule {
  dayNumber: number;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM:SS format
  endTime: string; // HH:MM:SS format
  isActive: boolean;
}

export interface EventBasicInfo {
  name: string;
  latitude: number;
  longitude: number;
  groupEventId?: string;
  isOpen?: boolean;
}

export interface MultiDayEventData {
  eventData: EventBasicInfo;
  schedules: DailySchedule[];
}

export interface Event {
  id: string;
  merchant_id: string;
  group_event_id?: string;
  name?: string;
  latitude: number;
  longitude: number;
  is_open: boolean;
  start_time: string;
  end_time: string;
  event_type: 'single_day' | 'multi_day';
  total_days: number;
  event_start_date?: string;
  event_end_date?: string;
  created_at: string;
  updated_at: string;
  merchant_name?: string;
  schedules?: EventSchedule[];
}

export interface EventSchedule {
  id: string;
  event_id: string;
  day_number: number;
  date: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  name: string;
  latitude: number;
  longitude: number;
  groupEventId?: string;
  isOpen: boolean;
  eventType: 'single_day' | 'multi_day';
  
  // For single day events
  date?: string;
  startTime?: string;
  endTime?: string;
  
  // For multi-day events
  schedules?: DailySchedule[];
}

export interface CreateEventRequest {
  eventData: EventBasicInfo;
  schedules: DailySchedule[];
}

export interface UpdateSchedulesRequest {
  schedules: DailySchedule[];
}

export interface EventActiveResponse {
  isActive: boolean;
  currentSchedule?: EventSchedule;
}