export interface FullscreenTransitionProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}
