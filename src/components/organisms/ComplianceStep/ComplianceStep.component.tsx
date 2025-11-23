import React, { useState, useRef } from 'react';
import { Typography } from '@/components/atoms/Typography';
import { ComplianceStepProps, ComplianceData, ComplianceDocument } from './ComplianceStep.types';
import styles from './ComplianceStep.module.scss';

const HYGIENE_RATINGS = [
  { value: 5, label: 'Very Good', description: 'Excellent hygiene standards' },
  { value: 4, label: 'Good', description: 'Good hygiene standards' },
  { value: 3, label: 'Satisfactory', description: 'Generally satisfactory' },
  { value: 2, label: 'Improvement', description: 'Improvement necessary' },
  { value: 1, label: 'Major Improvement', description: 'Major improvement necessary' },
  { value: 0, label: 'Urgent Improvement', description: 'Urgent improvement required' },
];

export const ComplianceStep: React.FC<ComplianceStepProps> = ({
  onComplete,
  onBack,
  initialData,
  loading = false,
  className,
}) => {
  const [formData, setFormData] = useState<ComplianceData>({
    hygieneRating: initialData?.hygieneRating,
    hygieneRatingDate: initialData?.hygieneRatingDate,
    foodSafetyCertificate: initialData?.foodSafetyCertificate,
    publicLiabilityInsurance: initialData?.publicLiabilityInsurance,
    allergenTrainingCertificate: initialData?.allergenTrainingCertificate,
    additionalDocuments: initialData?.additionalDocuments || [],
    confirmedAccuracy: initialData?.confirmedAccuracy || false,
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const foodSafetyRef = useRef<HTMLInputElement>(null);
  const insuranceRef = useRef<HTMLInputElement>(null);
  const allergenRef = useRef<HTMLInputElement>(null);
  const additionalRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (formData.hygieneRating === undefined) {
      newErrors.hygieneRating = 'Please select your food hygiene rating';
    }

    if (!formData.hygieneRatingDate) {
      newErrors.hygieneRatingDate = 'Please enter when you received your rating';
    }

    if (!formData.foodSafetyCertificate) {
      newErrors.foodSafetyCertificate = 'Food safety certificate is required';
    }

    if (!formData.publicLiabilityInsurance) {
      newErrors.publicLiabilityInsurance = 'Public liability insurance is required';
    }

    if (!formData.confirmedAccuracy) {
      newErrors.confirmedAccuracy = 'You must confirm the accuracy of your documents';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRatingSelect = (rating: number) => {
    setFormData(prev => ({ ...prev, hygieneRating: rating }));
    if (errors.hygieneRating) {
      setErrors(prev => ({ ...prev, hygieneRating: undefined }));
    }
  };

  const handleDateChange = (date: Date) => {
    setFormData(prev => ({ ...prev, hygieneRatingDate: date }));
    if (errors.hygieneRatingDate) {
      setErrors(prev => ({ ...prev, hygieneRatingDate: undefined }));
    }
  };

  const handleFileUpload = (
    field: 'foodSafetyCertificate' | 'publicLiabilityInsurance' | 'allergenTrainingCertificate' | 'additional',
    file: File
  ) => {
    const document: ComplianceDocument = {
      id: `${Date.now()}_${file.name}`,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
    };

    if (field === 'additional') {
      setFormData(prev => ({
        ...prev,
        additionalDocuments: [...(prev.additionalDocuments || []), document]
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: document }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };

  const handleFileRemove = (
    field: 'foodSafetyCertificate' | 'publicLiabilityInsurance' | 'allergenTrainingCertificate'
  ) => {
    setFormData(prev => ({ ...prev, [field]: undefined }));
  };

  const handleExpiryDateChange = (
    field: 'foodSafetyCertificate' | 'publicLiabilityInsurance' | 'allergenTrainingCertificate',
    date: Date
  ) => {
    setFormData(prev => {
      const document = prev[field];
      if (document) {
        return {
          ...prev,
          [field]: { ...document, expiryDate: date }
        };
      }
      return prev;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onComplete(formData);
  };

  const containerClasses = [
    styles.complianceStep,
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.complianceStep__header}>
        <Typography variant="heading-2" className={styles.complianceStep__title}>
          Food Safety & Compliance
        </Typography>
        <Typography variant="body-large" className={styles.complianceStep__description}>
          UK law requires food vendors to maintain proper hygiene standards and documentation
        </Typography>
      </div>

      <form className={styles.complianceStep__form} onSubmit={handleSubmit}>
        {/* Info Box */}
        <div className={styles.complianceStep__infoBox}>
          <span className={styles.complianceStep__infoIcon}>ℹ️</span>
          <div className={styles.complianceStep__infoText}>
            <strong>UK Food Standards Agency Requirements:</strong> All food vendors must register with their local authority and maintain a valid Food Hygiene Rating. Documents will be verified before your account is approved.
          </div>
        </div>

        {/* Food Hygiene Rating Section */}
        <div className={styles.complianceStep__section}>
          <h3 className={styles.complianceStep__sectionTitle}>Food Hygiene Rating</h3>
          <p className={styles.complianceStep__sectionDescription}>
            Your rating from the Food Standards Agency (FSA)
          </p>

          <div className={styles.complianceStep__field}>
            <label className={styles.complianceStep__label}>
              Select Your Current Rating<span className={styles.complianceStep__required}>*</span>
            </label>
            <div className={styles.complianceStep__ratingSelector}>
              {HYGIENE_RATINGS.map(rating => (
                <button
                  key={rating.value}
                  type="button"
                  className={`${styles.complianceStep__ratingButton} ${
                    formData.hygieneRating === rating.value 
                      ? styles['complianceStep__ratingButton--selected'] 
                      : ''
                  }`}
                  onClick={() => handleRatingSelect(rating.value)}
                  disabled={loading}
                >
                  <span className={styles.complianceStep__ratingNumber}>{rating.value}</span>
                  <span className={styles.complianceStep__ratingLabel}>{rating.label}</span>
                </button>
              ))}
            </div>
            {errors.hygieneRating && (
              <span className={styles.complianceStep__error}>⚠️ {errors.hygieneRating}</span>
            )}
          </div>

          <div className={styles.complianceStep__field}>
            <label className={styles.complianceStep__label}>
              Rating Date<span className={styles.complianceStep__required}>*</span>
            </label>
            <input
              type="date"
              className={`${styles.complianceStep__dateInput} ${errors.hygieneRatingDate ? styles['complianceStep__dateInput--error'] : ''}`}
              value={formData.hygieneRatingDate ? formData.hygieneRatingDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              disabled={loading}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.hygieneRatingDate && (
              <span className={styles.complianceStep__error}>⚠️ {errors.hygieneRatingDate}</span>
            )}
            <span className={styles.complianceStep__helpText}>
              When did you receive this rating from your local authority?
            </span>
          </div>
        </div>

        {/* Required Documents Section */}
        <div className={styles.complianceStep__section}>
          <h3 className={styles.complianceStep__sectionTitle}>Required Documents</h3>

          {/* Food Safety Certificate */}
          <div className={styles.complianceStep__field}>
            <label className={styles.complianceStep__label}>
              Food Safety Certificate (Level 2+)<span className={styles.complianceStep__required}>*</span>
            </label>
            {!formData.foodSafetyCertificate ? (
              <>
                <div
                  className={`${styles.complianceStep__uploadArea} ${
                    errors.foodSafetyCertificate ? styles['complianceStep__uploadArea--error'] : ''
                  } ${loading ? styles['complianceStep__uploadArea--disabled'] : ''}`}
                  onClick={() => !loading && foodSafetyRef.current?.click()}
                >
                  <span className={styles.complianceStep__uploadIcon}>📄</span>
                  <div className={styles.complianceStep__uploadText}>
                    Click to upload your Food Safety Certificate
                  </div>
                  <div className={styles.complianceStep__uploadHint}>
                    PDF, JPG or PNG (max 10MB)
                  </div>
                </div>
                <input
                  ref={foodSafetyRef}
                  type="file"
                  className={styles.complianceStep__fileInput}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('foodSafetyCertificate', file);
                  }}
                  disabled={loading}
                />
                {errors.foodSafetyCertificate && (
                  <span className={styles.complianceStep__error}>⚠️ {errors.foodSafetyCertificate}</span>
                )}
              </>
            ) : (
              <div className={styles.complianceStep__uploadedFile}>
                <div className={styles.complianceStep__fileInfo}>
                  <span className={styles.complianceStep__fileIcon}>📄</span>
                  <div className={styles.complianceStep__fileDetails}>
                    <div className={styles.complianceStep__fileName}>
                      {formData.foodSafetyCertificate.name}
                    </div>
                    <div className={styles.complianceStep__fileMetadata}>
                      {formatFileSize(formData.foodSafetyCertificate.size)} • Uploaded {formData.foodSafetyCertificate.uploadedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={styles.complianceStep__fileActions}>
                  <button
                    type="button"
                    className={styles.complianceStep__removeButton}
                    onClick={() => handleFileRemove('foodSafetyCertificate')}
                    disabled={loading}
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            {formData.foodSafetyCertificate && (
              <div className={styles.complianceStep__field}>
                <label className={styles.complianceStep__label}>Certificate Expiry Date (if applicable)</label>
                <input
                  type="date"
                  className={styles.complianceStep__dateInput}
                  value={formData.foodSafetyCertificate.expiryDate ? formData.foodSafetyCertificate.expiryDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleExpiryDateChange('foodSafetyCertificate', new Date(e.target.value))}
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}
          </div>

          {/* Public Liability Insurance */}
          <div className={styles.complianceStep__field}>
            <label className={styles.complianceStep__label}>
              Public Liability Insurance<span className={styles.complianceStep__required}>*</span>
            </label>
            {!formData.publicLiabilityInsurance ? (
              <>
                <div
                  className={`${styles.complianceStep__uploadArea} ${
                    errors.publicLiabilityInsurance ? styles['complianceStep__uploadArea--error'] : ''
                  } ${loading ? styles['complianceStep__uploadArea--disabled'] : ''}`}
                  onClick={() => !loading && insuranceRef.current?.click()}
                >
                  <span className={styles.complianceStep__uploadIcon}>🛡️</span>
                  <div className={styles.complianceStep__uploadText}>
                    Click to upload your Insurance Certificate
                  </div>
                  <div className={styles.complianceStep__uploadHint}>
                    PDF, JPG or PNG (max 10MB)
                  </div>
                </div>
                <input
                  ref={insuranceRef}
                  type="file"
                  className={styles.complianceStep__fileInput}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('publicLiabilityInsurance', file);
                  }}
                  disabled={loading}
                />
                {errors.publicLiabilityInsurance && (
                  <span className={styles.complianceStep__error}>⚠️ {errors.publicLiabilityInsurance}</span>
                )}
              </>
            ) : (
              <div className={styles.complianceStep__uploadedFile}>
                <div className={styles.complianceStep__fileInfo}>
                  <span className={styles.complianceStep__fileIcon}>🛡️</span>
                  <div className={styles.complianceStep__fileDetails}>
                    <div className={styles.complianceStep__fileName}>
                      {formData.publicLiabilityInsurance.name}
                    </div>
                    <div className={styles.complianceStep__fileMetadata}>
                      {formatFileSize(formData.publicLiabilityInsurance.size)} • Uploaded {formData.publicLiabilityInsurance.uploadedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={styles.complianceStep__fileActions}>
                  <button
                    type="button"
                    className={styles.complianceStep__removeButton}
                    onClick={() => handleFileRemove('publicLiabilityInsurance')}
                    disabled={loading}
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            {formData.publicLiabilityInsurance && (
              <div className={styles.complianceStep__field}>
                <label className={styles.complianceStep__label}>Insurance Expiry Date</label>
                <input
                  type="date"
                  className={styles.complianceStep__dateInput}
                  value={formData.publicLiabilityInsurance.expiryDate ? formData.publicLiabilityInsurance.expiryDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleExpiryDateChange('publicLiabilityInsurance', new Date(e.target.value))}
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}
          </div>

          {/* Allergen Training (Optional) */}
          <div className={styles.complianceStep__field}>
            <label className={styles.complianceStep__label}>
              Allergen Training Certificate (Recommended)
            </label>
            {!formData.allergenTrainingCertificate ? (
              <>
                <div
                  className={`${styles.complianceStep__uploadArea} ${loading ? styles['complianceStep__uploadArea--disabled'] : ''}`}
                  onClick={() => !loading && allergenRef.current?.click()}
                >
                  <span className={styles.complianceStep__uploadIcon}>🥜</span>
                  <div className={styles.complianceStep__uploadText}>
                    Click to upload your Allergen Training Certificate
                  </div>
                  <div className={styles.complianceStep__uploadHint}>
                    PDF, JPG or PNG (max 10MB) • Optional but recommended
                  </div>
                </div>
                <input
                  ref={allergenRef}
                  type="file"
                  className={styles.complianceStep__fileInput}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('allergenTrainingCertificate', file);
                  }}
                  disabled={loading}
                />
              </>
            ) : (
              <div className={styles.complianceStep__uploadedFile}>
                <div className={styles.complianceStep__fileInfo}>
                  <span className={styles.complianceStep__fileIcon}>🥜</span>
                  <div className={styles.complianceStep__fileDetails}>
                    <div className={styles.complianceStep__fileName}>
                      {formData.allergenTrainingCertificate.name}
                    </div>
                    <div className={styles.complianceStep__fileMetadata}>
                      {formatFileSize(formData.allergenTrainingCertificate.size)} • Uploaded {formData.allergenTrainingCertificate.uploadedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={styles.complianceStep__fileActions}>
                  <button
                    type="button"
                    className={styles.complianceStep__removeButton}
                    onClick={() => handleFileRemove('allergenTrainingCertificate')}
                    disabled={loading}
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Section */}
        <div className={styles.complianceStep__section}>
          <div className={`${styles.complianceStep__checkbox} ${errors.confirmedAccuracy ? styles['complianceStep__checkbox--error'] : ''}`}>
            <input
              type="checkbox"
              id="confirmAccuracy"
              checked={formData.confirmedAccuracy}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, confirmedAccuracy: e.target.checked }));
                if (errors.confirmedAccuracy) {
                  setErrors(prev => ({ ...prev, confirmedAccuracy: undefined }));
                }
              }}
              disabled={loading}
            />
            <label htmlFor="confirmAccuracy">
              I confirm that all documents provided are accurate, current, and legally valid. I understand that false information may result in account suspension and legal action.
            </label>
          </div>
          {errors.confirmedAccuracy && (
            <span className={styles.complianceStep__error}>⚠️ {errors.confirmedAccuracy}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.complianceStep__actions}>
          <button
            type="button"
            className={`${styles.complianceStep__button} ${styles['complianceStep__button--secondary']}`}
            onClick={onBack}
            disabled={loading}
          >
            Back
          </button>
          <button
            type="submit"
            className={`${styles.complianceStep__button} ${styles['complianceStep__button--primary']}`}
            disabled={loading}
          >
            Continue to Payment Setup
          </button>
        </div>
      </form>
    </div>
  );
};
