import React, { forwardRef } from 'react';
import { FormInput, FormInputProps } from '../FormInput/FormInput';

export interface NumberInputProps extends Omit<FormInputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  prefix?: string;
}

/**
 * NumberInput Component
 * Input field specifically for numeric values with optional min/max/step
 * Supports prefix/suffix for units (e.g., "£", "minutes", "%")
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({
  min,
  max,
  step = 1,
  suffix,
  prefix,
  ...props
}, ref) => {
  return (
    <FormInput
      ref={ref}
      type="number"
      min={min}
      max={max}
      step={step}
      leftIcon={prefix ? <span style={{ color: 'var(--color-text-secondary)' }}>{prefix}</span> : undefined}
      rightIcon={suffix ? <span style={{ color: 'var(--color-text-secondary)' }}>{suffix}</span> : undefined}
      {...props}
    />
  );
});

NumberInput.displayName = 'NumberInput';

export default NumberInput;
