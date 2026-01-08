export interface OperatingModeSettingsProps {
  merchantId: string;
  currentMode?: 'event_based' | 'static';
  isCurrentlyOpen?: boolean;
  onModeChange?: () => void;
  className?: string;
}

export interface LocationData {
  address: string;
  lat?: number;
  lng?: number;
}
