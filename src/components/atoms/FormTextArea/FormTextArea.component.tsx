import React from 'react';
import styles from './FormTextArea.module.scss';

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

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  isDisabled = false,
  helpText,
  error,
  className,
}) => {
  const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <label htmlFor={textareaId} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={isDisabled}
        className={`${styles.textarea} ${error ? styles.error : ''}`}
      />
      
      {error && <span className={styles.errorText}>{error}</span>}
      {helpText && !error && <span className={styles.helpText}>{helpText}</span>}
    </div>
  );
};