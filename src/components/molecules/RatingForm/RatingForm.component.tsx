import React, { useState } from 'react';
import { RatingFormProps, RatingFormData, MenuItemRating } from './RatingForm.types';
import { StarRating } from '../../atoms/StarRating';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import styles from './RatingForm.module.scss';

export const RatingForm: React.FC<RatingFormProps> = ({
  orderId,
  customerId,
  guestEmail,
  guestName,
  menuItems = [],
  onSubmit,
  isSubmitting = false,
  className = ''
}) => {
  const [formData, setFormData] = useState<RatingFormData>({
    overall_rating: 0,
    food_rating: undefined,
    service_rating: undefined,
    value_rating: undefined,
    title: '',
    comment: '',
    menu_item_ratings: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.overall_rating < 1) {
      newErrors.overall_rating = 'Overall rating is required';
    }

    if (formData.title && formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (formData.comment && formData.comment.length > 1000) {
      newErrors.comment = 'Comment must be 1000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData: RatingFormData = {
        ...formData,
        menu_item_ratings: formData.menu_item_ratings?.filter(
          rating => rating.rating > 0
        )
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleOverallRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, overall_rating: rating }));
    if (errors.overall_rating) {
      setErrors(prev => ({ ...prev, overall_rating: '' }));
    }
  };

  const handleMenuItemRatingChange = (menuItemId: string, rating: number, comment?: string) => {
    setFormData(prev => {
      const existingRatings = prev.menu_item_ratings || [];
      const existingIndex = existingRatings.findIndex(r => r.menu_item_id === menuItemId);
      
      let newRatings: MenuItemRating[];
      
      if (existingIndex >= 0) {
        // Update existing rating
        newRatings = [...existingRatings];
        newRatings[existingIndex] = { menu_item_id: menuItemId, rating, comment };
      } else {
        // Add new rating
        newRatings = [...existingRatings, { menu_item_id: menuItemId, rating, comment }];
      }

      return { ...prev, menu_item_ratings: newRatings };
    });
  };

  const getMenuItemRating = (menuItemId: string): MenuItemRating | undefined => {
    return formData.menu_item_ratings?.find(r => r.menu_item_id === menuItemId);
  };

  return (
    <form className={`${styles.ratingForm} ${className}`} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Overall Experience</h3>
        
        <div className={styles.field}>
          <label className={styles.label}>
            Overall Rating *
            <StarRating
              value={formData.overall_rating}
              interactive
              size="large"
              onChange={handleOverallRatingChange}
              className={styles.starRating}
            />
          </label>
          {errors.overall_rating && (
            <span className={styles.error}>{errors.overall_rating}</span>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionSubtitle}>Rate Different Aspects (Optional)</h4>
        
        <div className={styles.aspectRatings}>
          <div className={styles.field}>
            <label className={styles.label}>
              Food Quality
              <StarRating
                value={formData.food_rating || 0}
                interactive
                onChange={(rating) => setFormData(prev => ({ ...prev, food_rating: rating }))}
              />
            </label>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Service
              <StarRating
                value={formData.service_rating || 0}
                interactive
                onChange={(rating) => setFormData(prev => ({ ...prev, service_rating: rating }))}
              />
            </label>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Value for Money
              <StarRating
                value={formData.value_rating || 0}
                interactive
                onChange={(rating) => setFormData(prev => ({ ...prev, value_rating: rating }))}
              />
            </label>
          </div>
        </div>
      </div>

      {menuItems.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionSubtitle}>Rate Individual Items (Optional)</h4>
          
          <div className={styles.menuItems}>
            {menuItems.map(item => {
              const itemRating = getMenuItemRating(item.id);
              
              return (
                <div key={item.id} className={styles.menuItem}>
                  <div className={styles.menuItemHeader}>
                    <span className={styles.menuItemTitle}>{item.title}</span>
                    <span className={styles.menuItemPrice}>
                      ${(item.price / 100).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className={styles.menuItemRating}>
                    <StarRating
                      value={itemRating?.rating || 0}
                      interactive
                      size="small"
                      onChange={(rating) => handleMenuItemRatingChange(item.id, rating, itemRating?.comment)}
                    />
                  </div>
                  
                  {itemRating && itemRating.rating > 0 && (
                    <Input
                      id={`menu-item-comment-${item.id}`}
                      type="text"
                      placeholder="Comment on this item (optional)"
                      value={itemRating.comment || ''}
                      onChange={(e) => handleMenuItemRatingChange(item.id, itemRating.rating, e.target.value)}
                      className={styles.menuItemComment}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <div className={styles.field}>
          <Input
            id="rating-title"
            type="text"
            label="Review Title (Optional)"
            placeholder="Summary of your experience"
            value={formData.title || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            errorMessage={errors.title}
            maxLength={100}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Comment (Optional)
            <textarea
              className={styles.textarea}
              placeholder="Tell others about your experience..."
              value={formData.comment || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              maxLength={1000}
              rows={4}
            />
          </label>
          {errors.comment && (
            <span className={styles.error}>{errors.comment}</span>
          )}
          <div className={styles.characterCount}>
            {formData.comment?.length || 0}/1000
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          isDisabled={isSubmitting || formData.overall_rating < 1}
          isLoading={isSubmitting}
        >
          Submit Rating
        </Button>
      </div>
    </form>
  );
};
