import React, { forwardRef } from 'react';
import { FormCheckbox, FormCheckboxProps } from '../FormCheckbox/FormCheckbox';

export interface ToggleProps extends Omit<FormCheckboxProps, 'variant' | 'type'> {
  // Inherits all FormCheckbox props except variant (locked to 'switch')
}

/**
 * Toggle (Switch) Component
 * A toggle switch for boolean on/off states
 * Wraps FormCheckbox with variant='switch' for consistency
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>((props, ref) => {
  return <FormCheckbox ref={ref} variant="switch" {...props} />;
});

Toggle.displayName = 'Toggle';

export default Toggle;
