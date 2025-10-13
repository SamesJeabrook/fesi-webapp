import React, { forwardRef } from 'react';
import styles from './FormSelect.module.scss';

export interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helpText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  options: FormSelectOption[];
  placeholder?: string;
  className?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
  label,
  error,
  helpText,
  size = 'md',
  variant = 'default',
  options,
  placeholder,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${styles.formSelect} ${className}`}>
      {label && (
        <label htmlFor={selectId} className={styles.formSelect__label}>
          {label}
          {props.required && <span className={styles.formSelect__required}>*</span>}
        </label>
      )}
      
      <div className={styles.formSelect__wrapper}>
        <div 
          className={`
            ${styles.formSelect__container} 
            ${styles[`formSelect__container--${size}`]} 
            ${styles[`formSelect__container--${variant}`]}
            ${error ? styles['formSelect__container--error'] : ''}
            ${props.disabled ? styles['formSelect__container--disabled'] : ''}
          `}
        >
          <select
            ref={ref}
            id={selectId}
            className={styles.formSelect__select}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <div className={styles.formSelect__chevron}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      
      {(error || helpText) && (
        <div className={styles.formSelect__feedback}>
          {error && (
            <span className={styles.formSelect__error}>
              {error}
            </span>
          )}
          {!error && helpText && (
            <span className={styles.formSelect__helpText}>
              {helpText}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

export default FormSelect;