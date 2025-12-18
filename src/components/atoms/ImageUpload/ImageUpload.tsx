"use client";

import React, { useRef, useState } from 'react';
import { Button } from '@/components/atoms';
import { ImageUploadProps } from './ImageUpload.types';
import styles from './ImageUpload.module.scss';

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  disabled = false,
  buttonText = 'Choose Image',
  buttonVariant = 'secondary',
  previewClassName,
  'data-testid': testId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      setError(`Image size must be less than ${maxSizeMB}MB`);
      return;
    }

    onChange(file);

    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setError('');
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className={styles.imageUpload} data-testid={testId}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className={styles.imageUpload__hiddenInput}
        aria-label="Upload image"
      />

      {value ? (
        <div className={styles.imageUpload__preview}>
          <img
            src={value}
            alt="Preview"
            className={`${styles.imageUpload__previewImage} ${previewClassName || ''}`}
          />
          <div className={styles.imageUpload__actions}>
            <Button
              variant={buttonVariant}
              onClick={handleButtonClick}
              isDisabled={disabled}
              size="sm"
            >
              Change Image
            </Button>
            <Button
              variant="secondary"
              onClick={handleRemove}
              isDisabled={disabled}
              size="sm"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.imageUpload__empty}>
          <Button
            variant={buttonVariant}
            onClick={handleButtonClick}
            isDisabled={disabled}
          >
            {buttonText}
          </Button>
        </div>
      )}

      {error && (
        <p className={styles.imageUpload__error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
