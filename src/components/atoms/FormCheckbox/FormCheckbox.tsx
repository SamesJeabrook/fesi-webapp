import React, { forwardRef } from 'react';
import styles from './FormCheckbox.module.scss';

export interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helpText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'switch';
  className?: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(({
  label,
  error,
  helpText,
  size = 'md',
  variant = 'default',
  className = '',
  id,
  children,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${styles.formCheckbox} ${className}`}>
      <div className={styles.formCheckbox__wrapper}>
        <div 
          className={`
            ${styles.formCheckbox__container} 
            ${styles[`formCheckbox__container--${size}`]} 
            ${styles[`formCheckbox__container--${variant}`]}
            ${error ? styles['formCheckbox__container--error'] : ''}
            ${props.disabled ? styles['formCheckbox__container--disabled'] : ''}
          `}
        >
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={styles.formCheckbox__input}
            {...props}
          />
          
          <div className={styles.formCheckbox__indicator}>
            {variant === 'default' && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M10 3L4.5 8.5L2 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          
          {(label || children) && (
            <label htmlFor={checkboxId} className={styles.formCheckbox__label}>
              {label || children}
            </label>
          )}
        </div>
      </div>
      
      {(error || helpText) && (
        <div className={styles.formCheckbox__feedback}>
          {error && (
            <span className={styles.formCheckbox__error}>
              {error}
            </span>
          )}
          {!error && helpText && (
            <span className={styles.formCheckbox__helpText}>
              {helpText}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

FormCheckbox.displayName = 'FormCheckbox';

export default FormCheckbox;