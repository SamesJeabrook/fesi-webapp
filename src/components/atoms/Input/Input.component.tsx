import React, { useId } from 'react';
import classNames from 'classnames';
import type { InputProps } from './Input.types';
import styles from './Input.module.scss';

export const Input: React.FC<InputProps> = ({
  id: providedId,
  name,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  label,
  helperText,
  errorMessage,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  autoComplete,
  autoFocus = false,
  maxLength,
  minLength,
  min,
  max,
  step,
  pattern,
  size = 'md',
  leftIcon,
  rightIcon,
  leftAddon,
  rightAddon,
  fullWidth = false,
  className,
  inputClassName,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  'data-testid': dataTestId,
  ...rest
}) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const helperTextId = `${id}-helper`;
  const errorId = `${id}-error`;
  
  const hasError = Boolean(errorMessage);
  const hasLeftElement = Boolean(leftIcon || leftAddon);
  const hasRightElement = Boolean(rightIcon || rightAddon);

  const containerClasses = classNames(
    styles.container,
    {
      [styles.fullWidth]: fullWidth,
      [styles.hasError]: hasError,
      [styles.disabled]: isDisabled,
    },
    className
  );

  const inputGroupClasses = classNames(
    styles.inputGroup,
    styles[size],
    {
      [styles.hasLeftElement]: hasLeftElement,
      [styles.hasRightElement]: hasRightElement,
      [styles.error]: hasError,
      [styles.disabled]: isDisabled,
      [styles.readOnly]: isReadOnly,
    }
  );

  const inputClasses = classNames(
    styles.input,
    inputClassName
  );

  const inputProps = {
    id,
    name: name || id,
    type,
    value,
    defaultValue,
    placeholder,
    required: isRequired,
    disabled: isDisabled,
    readOnly: isReadOnly,
    autoComplete,
    autoFocus,
    maxLength,
    minLength,
    min,
    max,
    step,
    pattern,
    className: inputClasses,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    'data-testid': dataTestId,
    'aria-invalid': hasError,
    'aria-describedby': classNames({
      [helperTextId]: helperText,
      [errorId]: hasError,
    }) || undefined,
    ...rest,
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {isRequired && (
            <span className={styles.required} aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      <div className={inputGroupClasses}>
        {leftAddon && (
          <div className={styles.leftAddon}>
            {leftAddon}
          </div>
        )}
        
        {leftIcon && (
          <div className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </div>
        )}
        
        <input {...inputProps} />
        
        {rightIcon && (
          <div className={styles.rightIcon} aria-hidden="true">
            {rightIcon}
          </div>
        )}
        
        {rightAddon && (
          <div className={styles.rightAddon}>
            {rightAddon}
          </div>
        )}
      </div>
      
      {helperText && !hasError && (
        <div id={helperTextId} className={styles.helperText}>
          {helperText}
        </div>
      )}
      
      {hasError && (
        <div id={errorId} className={styles.errorMessage} role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

Input.displayName = 'Input';
