import React from 'react';
import { OnboardingProgressProps } from './OnboardingProgress.types';
import styles from './OnboardingProgress.module.scss';

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
  steps,
  className,
}) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const containerClasses = [
    styles.onboardingProgress,
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.onboardingProgress__container}>
        {/* Progress line */}
        <div className={styles.onboardingProgress__line}>
          <div 
            className={styles.onboardingProgress__lineProgress}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = step.completed;

          const circleClasses = [
            styles.onboardingProgress__circle,
            isActive ? styles['onboardingProgress__circle--active'] : '',
            isCompleted ? styles['onboardingProgress__circle--completed'] : ''
          ].filter(Boolean).join(' ');

          const labelClasses = [
            styles.onboardingProgress__label,
            isActive ? styles['onboardingProgress__label--active'] : '',
            isCompleted ? styles['onboardingProgress__label--completed'] : ''
          ].filter(Boolean).join(' ');

          return (
            <div key={stepNumber} className={styles.onboardingProgress__step}>
              <div className={circleClasses}>
                {isCompleted ? (
                  <span className={styles.onboardingProgress__checkmark}>✓</span>
                ) : (
                  stepNumber
                )}
              </div>
              <span className={labelClasses}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
