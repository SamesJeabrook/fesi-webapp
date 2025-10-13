import React, { forwardRef } from 'react';
import styles from './FormInput.module.scss';

export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helpText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  error,
  helpText,
  size = 'md',
  variant = 'default',
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${styles.formInput} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.formInput__label}>
          {label}
          {props.required && <span className={styles.formInput__required}>*</span>}
        </label>
      )}
      
      <div className={styles.formInput__wrapper}>
        <div 
          className={`
            ${styles.formInput__container} 
            ${styles[`formInput__container--${size}`]} 
            ${styles[`formInput__container--${variant}`]}
            ${error ? styles['formInput__container--error'] : ''}
            ${props.disabled ? styles['formInput__container--disabled'] : ''}
            ${isLoading ? styles['formInput__container--loading'] : ''}
          `}
        >
          {leftIcon && (
            <div className={styles.formInput__icon}>
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={styles.formInput__input}
            {...props}
          />
          
          {(rightIcon || isLoading) && (
            <div className={styles.formInput__icon}>
              {isLoading ? (
                <div className={styles.formInput__spinner} />
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
      </div>
      
      {(error || helpText) && (
        <div className={styles.formInput__feedback}>
          {error && (
            <span className={styles.formInput__error}>
              {error}
            </span>
          )}
          {!error && helpText && (
            <span className={styles.formInput__helpText}>
              {helpText}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;