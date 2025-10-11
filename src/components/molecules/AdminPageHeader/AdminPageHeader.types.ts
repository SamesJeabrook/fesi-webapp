export interface AdminPageHeaderProps {
  /** The back navigation link configuration */
  backLink?: {
    href: string;
    label: string;
  };
  /** Context text for the admin badge */
  adminContext?: string;
  /** Main page title */
  title: string;
  /** Page description/subtitle */
  description?: string;
  /** Action elements to display on the right */
  actions?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
}