export interface SearchableSelectOption {
  id: string;
  label: string;
  value?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  id: string;
  name?: string;
  value?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  options: SearchableSelectOption[];
  onChange?: (option: SearchableSelectOption | null) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  noResultsText?: string;
  'data-testid'?: string;
}
