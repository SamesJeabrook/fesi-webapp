import React from 'react';
import { RatingDisplayProps, RatingStatsDisplayProps } from './RatingDisplay.types';
import { StarRating } from '../../atoms/StarRating';
import { ratingService } from '../../../services/ratingService';
import styles from './RatingDisplay.module.scss';

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  ratings,
  showMenuItemRatings = false,
  showCustomerNames = true,
  maxRatings,
  isLoading = false,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`${styles.ratingDisplay} ${className}`}>
        <div className={styles.loading}>Loading ratings...</div>
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className={`${styles.ratingDisplay} ${className}`}>
        <div className={styles.empty}>No ratings yet. Be the first to rate!</div>
      </div>
    );
  }

  const displayRatings = maxRatings ? ratings.slice(0, maxRatings) : ratings;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`${styles.ratingDisplay} ${className}`}>
      {displayRatings.map((rating) => (
        <div key={rating.id} className={styles.rating}>
          <div className={styles.ratingHeader}>
            <div className={styles.ratingMeta}>
              <StarRating value={rating.overall_rating} size="small" showValue />
              <span className={styles.date}>{formatDate(rating.created_at)}</span>
            </div>
            {showCustomerNames && (
              <div className={styles.customerName}>
                {rating.customer_name || rating.guest_name || 'Anonymous'}
              </div>
            )}
          </div>

          {rating.title && (
            <h4 className={styles.ratingTitle}>{rating.title}</h4>
          )}

          {rating.comment && (
            <p className={styles.ratingComment}>{rating.comment}</p>
          )}

          {/* Aspect ratings */}
          {(rating.food_rating || rating.service_rating || rating.value_rating) && (
            <div className={styles.aspectRatings}>
              {rating.food_rating && (
                <div className={styles.aspectRating}>
                  <span className={styles.aspectLabel}>Food:</span>
                  <StarRating value={rating.food_rating} size="small" />
                </div>
              )}
              {rating.service_rating && (
                <div className={styles.aspectRating}>
                  <span className={styles.aspectLabel}>Service:</span>
                  <StarRating value={rating.service_rating} size="small" />
                </div>
              )}
              {rating.value_rating && (
                <div className={styles.aspectRating}>
                  <span className={styles.aspectLabel}>Value:</span>
                  <StarRating value={rating.value_rating} size="small" />
                </div>
              )}
            </div>
          )}

          {/* Menu item ratings */}
          {showMenuItemRatings && rating.menu_item_ratings && rating.menu_item_ratings.length > 0 && (
            <div className={styles.menuItemRatings}>
              <h5 className={styles.menuItemTitle}>Item Ratings:</h5>
              {rating.menu_item_ratings.map((itemRating) => (
                <div key={itemRating.id} className={styles.menuItemRating}>
                  <div className={styles.menuItemHeader}>
                    <span className={styles.menuItemName}>
                      {itemRating.menu_item_name}
                    </span>
                    <StarRating value={itemRating.rating} size="small" />
                  </div>
                  {itemRating.comment && (
                    <p className={styles.menuItemComment}>{itemRating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {maxRatings && ratings.length > maxRatings && (
        <div className={styles.showMore}>
          +{ratings.length - maxRatings} more ratings
        </div>
      )}
    </div>
  );
};

export const RatingStatsDisplay: React.FC<RatingStatsDisplayProps> = ({
  stats,
  className = ''
}) => {
  if (stats.total_ratings === 0) {
    return (
      <div className={`${styles.ratingStats} ${className}`}>
        <div className={styles.noStats}>No ratings yet</div>
      </div>
    );
  }

  const percentages = ratingService.calculateRatingPercentages(stats);

  return (
    <div className={`${styles.ratingStats} ${className}`}>
      <div className={styles.statsHeader}>
        <div className={styles.averageRating}>
          <span className={styles.averageValue}>
            {ratingService.formatRating(stats.average_overall_rating)}
          </span>
          <StarRating value={stats.average_overall_rating} size="medium" />
          <span className={styles.ratingLabel}>
            {ratingService.getRatingLabel(stats.average_overall_rating)}
          </span>
        </div>
        <div className={styles.totalRatings}>
          Based on {stats.total_ratings} rating{stats.total_ratings !== 1 ? 's' : ''}
        </div>
      </div>

      <div className={styles.ratingBreakdown}>
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className={styles.ratingBar}>
            <span className={styles.starLabel}>{star} star</span>
            <div className={styles.barContainer}>
              <div 
                className={styles.bar}
                style={{ width: `${percentages[star]}%` }}
              />
            </div>
            <span className={styles.percentage}>
              {Math.round(percentages[star])}%
            </span>
          </div>
        ))}
      </div>

      {/* Aspect averages */}
      {(stats.average_food_rating || stats.average_service_rating || stats.average_value_rating) && (
        <div className={styles.aspectStats}>
          <h4 className={styles.aspectTitle}>Aspect Ratings</h4>
          {stats.average_food_rating && (
            <div className={styles.aspectStat}>
              <span className={styles.aspectLabel}>Food Quality:</span>
              <StarRating value={stats.average_food_rating} size="small" showValue />
            </div>
          )}
          {stats.average_service_rating && (
            <div className={styles.aspectStat}>
              <span className={styles.aspectLabel}>Service:</span>
              <StarRating value={stats.average_service_rating} size="small" showValue />
            </div>
          )}
          {stats.average_value_rating && (
            <div className={styles.aspectStat}>
              <span className={styles.aspectLabel}>Value for Money:</span>
              <StarRating value={stats.average_value_rating} size="small" showValue />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
