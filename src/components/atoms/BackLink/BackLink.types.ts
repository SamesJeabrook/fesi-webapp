export interface BackLinkProps {
  /** The URL to navigate back to */
  href: string;
  /** The label text for the back link */
  label: string;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}