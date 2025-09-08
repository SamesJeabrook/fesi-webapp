import React, { useState } from 'react';
import classNames from 'classnames';
import { Card, Button } from '@/components/atoms';
import type { MenuItemCardProps } from './MenuItemCard.types';
import styles from './MenuItemCard.module.scss';

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  menuItem,
  onAddToCart,
  onViewDetails,
  showAddButton = true,
  showQuantityControls = false,
  isLoading = false,
  className,
  'data-testid': dataTestId,
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(menuItem, quantity);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(menuItem);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price);
  };

  const cardClasses = classNames(
    styles.menuItemCard,
    {
      [styles.unavailable]: !menuItem.isAvailable,
    },
    className
  );

  return (
    <Card
      className={cardClasses}
      variant="default"
      padding="none"
      hover={menuItem.isAvailable}
      data-testid={dataTestId}
    >
      <div className={styles.content}>
        {/* Image */}
        {menuItem.imageUrl && (
          <div className={styles.imageContainer}>
            <img
              src={menuItem.imageUrl}
              alt={menuItem.name}
              className={styles.image}
              loading="lazy"
            />
            {menuItem.isPopular && (
              <div className={styles.popularBadge}>
                Popular
              </div>
            )}
            {!menuItem.isAvailable && (
              <div className={styles.unavailableBadge}>
                Unavailable
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={styles.details}>
          <div className={styles.header}>
            <h3 className={styles.name}>{menuItem.name}</h3>
            <span className={styles.price}>
              {formatPrice(menuItem.price)}
            </span>
          </div>

          {menuItem.description && (
            <p className={styles.description}>
              {menuItem.description}
            </p>
          )}

          {/* Meta information */}
          <div className={styles.meta}>
            {menuItem.preparationTime && (
              <span className={styles.prepTime}>
                🕒 {menuItem.preparationTime} min
              </span>
            )}
            
            {menuItem.calories && (
              <span className={styles.calories}>
                🔥 {menuItem.calories} cal
              </span>
            )}
          </div>

          {/* Dietary info */}
          {menuItem.dietaryInfo && menuItem.dietaryInfo.length > 0 && (
            <div className={styles.dietaryInfo}>
              {menuItem.dietaryInfo.map((diet) => (
                <span key={diet} className={styles.dietaryBadge}>
                  {diet}
                </span>
              ))}
            </div>
          )}

          {/* Allergens */}
          {menuItem.allergens && menuItem.allergens.length > 0 && (
            <div className={styles.allergens}>
              <span className={styles.allergensLabel}>Contains:</span>
              <span className={styles.allergensText}>
                {menuItem.allergens.join(', ')}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewDetails}
              >
                View Details
              </Button>
            )}

            {showAddButton && menuItem.isAvailable && (
              <div className={styles.addToCartSection}>
                {showQuantityControls && (
                  <div className={styles.quantityControls}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      isDisabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className={styles.quantity}>{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddToCart}
                  isLoading={isLoading}
                  isDisabled={!menuItem.isAvailable}
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

MenuItemCard.displayName = 'MenuItemCard';
