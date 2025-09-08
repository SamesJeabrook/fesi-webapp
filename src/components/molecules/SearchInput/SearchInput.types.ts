export interface SearchInputProps {
  id: string;
  placeholder?: string;
  value?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
  showClearButton?: boolean;
  debounceMs?: number;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  'data-testid'?: string;
}
