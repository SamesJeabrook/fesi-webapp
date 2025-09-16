import React, { useState } from 'react';
import { StarRatingProps } from './StarRating.types';
import styles from './StarRating.module.scss';

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  maxStars = 5,
  size = 'medium',
  interactive = false,
  allowHalf = false,
  onChange,
  className = '',
  showValue = false,
  ariaLabel = 'Star rating'
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleStarClick = (starIndex: number) => {
    if (interactive && onChange) {
      const newRating = starIndex + 1;
      onChange(newRating);
    }
  };

  const handleStarHover = (starIndex: number) => {
    if (interactive) {
      setHoverValue(starIndex + 1);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverValue(null);
    }
  };

  const getStarType = (starIndex: number): 'empty' | 'half' | 'full' => {
    const currentValue = hoverValue !== null ? hoverValue : value;
    const starValue = starIndex + 1;

    if (currentValue >= starValue) {
      return 'full';
    } else if (allowHalf && currentValue >= starValue - 0.5) {
      return 'half';
    } else {
      return 'empty';
    }
  };

  const renderStar = (starIndex: number) => {
    const starType = getStarType(starIndex);
    const starClasses = [
      styles.star,
      styles[`star--${starType}`],
      styles[`star--${size}`],
      interactive ? styles['star--interactive'] : ''
    ].filter(Boolean).join(' ');

    return (
      <button
        key={starIndex}
        type="button"
        className={starClasses}
        onClick={() => handleStarClick(starIndex)}
        onMouseEnter={() => handleStarHover(starIndex)}
        disabled={!interactive}
        aria-label={`${starIndex + 1} star${starIndex > 0 ? 's' : ''}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {starType === 'full' && (
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="currentColor"
            />
          )}
          {starType === 'half' && (
            <defs>
              <linearGradient id={`half-fill-${starIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
          )}
          {starType === 'half' && (
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill={`url(#half-fill-${starIndex})`}
            />
          )}
        </svg>
      </button>
    );
  };

  return (
    <div
      className={`${styles.starRating} ${className}`}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label={`${ariaLabel}: ${value} out of ${maxStars} stars`}
    >
      <div className={styles.stars}>
        {Array.from({ length: maxStars }, (_, index) => renderStar(index))}
      </div>
      {showValue && (
        <span className={styles.value} aria-hidden="true">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};
