export interface MapPinProps {
  /** Latitude coordinate */
  lat: number;
  /** Longitude coordinate */
  lng: number;
  /** Optional zoom level (default: 14) */
  zoom?: number;
  /** Optional width of the map container (default: '100%') */
  width?: string;
  /** Optional height of the map container (default: '300px') */
  height?: string;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional Mapbox access token (can be provided via env var) */
  accessToken?: string;
  /** Optional map style (default: 'mapbox://styles/mapbox/streets-v12') */
  mapStyle?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}