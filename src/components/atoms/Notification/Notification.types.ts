export type NotificationType = 'success' | 'warning' | 'error';

export interface NotificationProps {
  message: string;
  subMessage: string;
  type?: NotificationType;
  persistent?: boolean;
  onClose?: () => void;
  className?: string;
}
