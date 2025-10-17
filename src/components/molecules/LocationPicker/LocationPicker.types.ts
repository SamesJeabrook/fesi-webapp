export interface LocationPickerProps {
  /** Current latitude coordinate */
  latitude: number;
  /** Current longitude coordinate */
  longitude: number;
  /** Callback when location is changed */
  onLocationChange: (latitude: number, longitude: number) => void;
  /** Optional zoom level (default: 14) */
  zoom?: number;
  /** Optional width of the map container (default: '100%') */
  width?: string;
  /** Optional height of the map container (default: '300px') */
  height?: string;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional map style (default: 'mapbox://styles/mapbox/streets-v12') */
  mapStyle?: string;
  /** Optional label for the component */
  label?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}