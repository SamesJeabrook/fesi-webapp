'use client';

import React, { useId, useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import type { SearchableSelectProps, SearchableSelectOption } from './SearchableSelect.types';
import styles from './SearchableSelect.module.scss';

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id: providedId,
  name,
  value,
  placeholder = 'Select an option',
  label,
  helperText,
  errorMessage,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  size = 'md',
  fullWidth = false,
  className,
  options,
  onChange,
  onBlur,
  onFocus,
  searchPlaceholder = 'Search...',
  noResultsText = 'No results found',
  'data-testid': dataTestId,
}) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const helperTextId = `${id}-helper`;
  const errorId = `${id}-error`;
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  
  const hasError = Boolean(errorMessage);
  const selectedOption = options.find(opt => opt.id === value || opt.value === value);

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listboxRef.current) {
      const highlightedElement = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleToggle = () => {
    if (isDisabled || isReadOnly) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  };

  const handleOptionClick = (option: SearchableSelectOption) => {
    if (option.disabled) return;
    onChange?.(option);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isDisabled || isReadOnly) return;

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        }
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
          setSearchQuery('');
          setHighlightedIndex(-1);
        }
        break;
    }
  };

  const containerClasses = classNames(
    styles.container,
    {
      [styles.fullWidth]: fullWidth,
      [styles.hasError]: hasError,
      [styles.disabled]: isDisabled,
      [styles.open]: isOpen,
    },
    className
  );

  const selectButtonClasses = classNames(
    styles.selectButton,
    styles[size],
    {
      [styles.error]: hasError,
      [styles.disabled]: isDisabled,
      [styles.readOnly]: isReadOnly,
      [styles.open]: isOpen,
    }
  );

  return (
    <div className={containerClasses} ref={containerRef}>
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
      
      <div className={styles.selectWrapper}>
        <button
          id={id}
          type="button"
          className={selectButtonClasses}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? id : undefined}
          aria-describedby={classNames({
            [helperTextId]: helperText,
            [errorId]: hasError,
          }) || undefined}
          data-testid={dataTestId}
        >
          <span className={styles.selectedValue}>
            {selectedOption ? (
              <>
                {selectedOption.icon && (
                  <span className={styles.optionIcon}>{selectedOption.icon}</span>
                )}
                {selectedOption.label}
              </>
            ) : (
              <span className={styles.placeholder}>{placeholder}</span>
            )}
          </span>
          <svg
            className={styles.chevron}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.searchWrapper}>
              <input
                ref={searchInputRef}
                type="text"
                className={styles.searchInput}
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                aria-label="Search options"
              />
            </div>
            
            <ul
              ref={listboxRef}
              className={styles.optionsList}
              role="listbox"
              aria-labelledby={id}
            >
              {filteredOptions.length === 0 ? (
                <li className={styles.noResults} role="option" aria-disabled="true">
                  {noResultsText}
                </li>
              ) : (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.id}
                    className={classNames(styles.option, {
                      [styles.selected]: option.id === value || option.value === value,
                      [styles.highlighted]: index === highlightedIndex,
                      [styles.disabled]: option.disabled,
                    })}
                    role="option"
                    aria-selected={option.id === value || option.value === value}
                    aria-disabled={option.disabled}
                    onClick={() => handleOptionClick(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {option.icon && (
                      <span className={styles.optionIcon}>{option.icon}</span>
                    )}
                    <span className={styles.optionLabel}>{option.label}</span>
                    {(option.id === value || option.value === value) && (
                      <svg
                        className={styles.checkIcon}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3334 4L6.00002 11.3333L2.66669 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </li>
                ))
              )}
            </ul>
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

SearchableSelect.displayName = 'SearchableSelect';
