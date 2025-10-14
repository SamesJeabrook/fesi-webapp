export interface FormTextAreaProps {
  id?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  isDisabled?: boolean;
  helpText?: string;
  error?: string;
  className?: string;
}