'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button } from '@/components/atoms';
import type { SearchInputProps } from './SearchInput.types';
import styles from './SearchInput.module.scss';

// Search icon component
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

// Clear icon component
const ClearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Loading spinner icon
const LoadingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.spinner}>
    <circle cx="12" cy="12" r="10" strokeDasharray="62.83" strokeDashoffset="62.83" />
  </svg>
);

export const SearchInput: React.FC<SearchInputProps> = ({
  id,
  placeholder = 'Search...',
  value: controlledValue,
  onSearch,
  onClear,
  isLoading = false,
  showClearButton = true,
  debounceMs = 300,
  size = 'md',
  fullWidth = false,
  className,
  'data-testid': dataTestId,
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      const handler = setTimeout(() => {
        if (onSearch) {
          onSearch(query);
        }
      }, debounceMs);

      return () => {
        clearTimeout(handler);
      };
    },
    [onSearch, debounceMs]
  );

  // Effect to handle debounced search
  useEffect(() => {
    if (value.trim() !== '') {
      const cleanup = debouncedSearch(value);
      return cleanup;
    }
  }, [value, debouncedSearch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    // Trigger immediate search on empty value to clear results
    if (newValue === '' && onSearch) {
      onSearch('');
    }
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    
    if (onClear) {
      onClear();
    }
    
    if (onSearch) {
      onSearch('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (onSearch) {
        onSearch(value);
      }
    }
    
    if (event.key === 'Escape') {
      handleClear();
    }
  };

  // Determine right icon based on state
  const getRightIcon = () => {
    if (isLoading) {
      return <LoadingIcon />;
    }
    
    if (showClearButton && value && value.length > 0) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className={styles.clearButton}
          data-testid={`${dataTestId}-clear`}
        >
          <ClearIcon />
        </Button>
      );
    }
    
    return null;
  };

  return (
    <div className={className}>
      <Input
        id={id}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        leftIcon={<SearchIcon />}
        rightIcon={getRightIcon()}
        size={size}
        fullWidth={fullWidth}
        data-testid={dataTestId}
        autoComplete="off"
      />
    </div>
  );
};

SearchInput.displayName = 'SearchInput';
