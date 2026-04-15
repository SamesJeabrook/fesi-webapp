import React, { forwardRef } from 'react';
import { FormInput, FormInputProps } from '../FormInput/FormInput';

export interface DatePickerProps extends Omit<FormInputProps, 'type'> {
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
}

/**
 * DatePicker Component
 * Input field for selecting dates using native HTML5 date picker
 * Accepts min/max dates in YYYY-MM-DD format
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({
  minDate,
  maxDate,
  ...props
}, ref) => {
  return (
    <FormInput
      ref={ref}
      type="date"
      min={minDate}
      max={maxDate}
      {...props}
    />
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
