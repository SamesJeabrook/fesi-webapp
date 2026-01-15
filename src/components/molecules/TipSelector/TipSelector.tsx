// Tip selection component for order checkout
import React, { useState } from 'react';
import styles from './TipSelector.module.scss';

interface TipSelectorProps {
  subtotal: number; // Order subtotal in pence
  onTipChange: (tipAmount: number) => void; // Callback when tip changes
  currency?: string;
  presetPercentages?: number[]; // Default: [5, 10, 15, 20]
}

export function TipSelector({ 
  subtotal, 
  onTipChange, 
  currency = 'GBP',
  presetPercentages = [5, 10, 15, 20]
}: TipSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const formatCurrency = (amountInPence: number): string => {
    return `£${(amountInPence / 100).toFixed(2)}`;
  };

  const handlePresetClick = (percentage: number) => {
    const tipAmount = Math.round(subtotal * (percentage / 100));
    setSelectedPreset(percentage);
    setShowCustomInput(false);
    setCustomTip('');
    onTipChange(tipAmount);
  };

  const handleCustomClick = () => {
    setShowCustomInput(true);
    setSelectedPreset(null);
  };

  const handleCustomTipChange = (value: string) => {
    // Allow only numbers and decimal point
    const sanitized = value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = sanitized.split('.');
    const formatted = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('') 
      : sanitized;
    
    setCustomTip(formatted);
    
    // Convert to pence
    const tipInPounds = parseFloat(formatted) || 0;
    const tipInPence = Math.round(tipInPounds * 100);
    onTipChange(tipInPence);
  };

  const handleNoTip = () => {
    setSelectedPreset(null);
    setShowCustomInput(false);
    setCustomTip('');
    onTipChange(0);
  };

  return (
    <div className={styles.tipSelector}>
      <div className={styles.tipSelector__header}>
        <h3 className={styles.tipSelector__title}>Add a tip?</h3>
        <p className={styles.tipSelector__subtitle}>
          100% goes to your server
        </p>
      </div>

      <div className={styles.tipSelector__options}>
        {/* Preset percentage buttons */}
        {presetPercentages.map((percentage) => {
          const tipAmount = Math.round(subtotal * (percentage / 100));
          return (
            <button
              key={percentage}
              type="button"
              className={`${styles.tipSelector__button} ${
                selectedPreset === percentage ? styles['tipSelector__button--selected'] : ''
              }`}
              onClick={() => handlePresetClick(percentage)}
            >
              <span className={styles.tipSelector__percentage}>{percentage}%</span>
              <span className={styles.tipSelector__amount}>
                {formatCurrency(tipAmount)}
              </span>
            </button>
          );
        })}

        {/* Custom tip button */}
        <button
          type="button"
          className={`${styles.tipSelector__button} ${
            showCustomInput ? styles['tipSelector__button--selected'] : ''
          }`}
          onClick={handleCustomClick}
        >
          <span className={styles.tipSelector__percentage}>Custom</span>
        </button>

        {/* No tip button */}
        <button
          type="button"
          className={`${styles.tipSelector__button} ${
            !selectedPreset && !showCustomInput && customTip === '' 
              ? styles['tipSelector__button--selected'] 
              : ''
          }`}
          onClick={handleNoTip}
        >
          <span className={styles.tipSelector__percentage}>No tip</span>
        </button>
      </div>

      {/* Custom tip input */}
      {showCustomInput && (
        <div className={styles.tipSelector__customInput}>
          <label htmlFor="customTipInput" className={styles.tipSelector__label}>
            Enter custom tip amount
          </label>
          <div className={styles.tipSelector__inputWrapper}>
            <span className={styles.tipSelector__currencySymbol}>£</span>
            <input
              id="customTipInput"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={customTip}
              onChange={(e) => handleCustomTipChange(e.target.value)}
              className={styles.tipSelector__input}
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
}
