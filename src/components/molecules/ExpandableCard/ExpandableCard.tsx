"use client"

import React, { useState } from 'react';
import { Button, Typography } from '@/components/atoms';
import { Badge } from '@/components/atoms/Badge';
import styles from './ExpandableCard.module.scss';

export interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  badges?: Array<{
    text: string;
    variant?: 'default' | 'single' | 'multiple' | 'required' | 'optional' | 'success' | 'warning' | 'error' | 'info';
  }>;
  isExpanded?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  headerActions?: React.ReactNode;
  children?: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  subtitle,
  description,
  badges = [],
  isExpanded: controlledExpanded,
  defaultExpanded = false,
  onToggle,
  headerActions,
  children,
  emptyState,
  className = ''
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  
  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    const newExpanded = !expanded;
    if (!isControlled) {
      setInternalExpanded(newExpanded);
    }
    onToggle?.(newExpanded);
  };

  return (
    <div className={`${styles.expandableCard} ${expanded ? styles['expandableCard--expanded'] : ''} ${className}`}>
      <div className={styles.expandableCard__header} onClick={handleToggle}>
        <div className={styles.expandableCard__headerContent}>
          <div className={styles.expandableCard__titleSection}>
            <Typography variant="heading-4" className={styles.expandableCard__title}>
              {title}
            </Typography>
            <button 
              className={styles.expandableCard__toggleButton}
              onClick={handleToggle}
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none"
                className={styles.expandableCard__chevron}
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          
          {subtitle && (
            <Typography variant="body-small" className={styles.expandableCard__subtitle}>
              {subtitle}
            </Typography>
          )}
          
          {badges.length > 0 && (
            <div className={styles.expandableCard__badges}>
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant} size="sm">
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}
          
          {description && (
            <Typography variant="body-medium" className={styles.expandableCard__description}>
              {description}
            </Typography>
          )}
        </div>
        
        {headerActions && (
          <div 
            className={styles.expandableCard__headerActions}
            onClick={(e) => e.stopPropagation()}
          >
            {headerActions}
          </div>
        )}
      </div>
      
      {expanded && (
        <div className={styles.expandableCard__content}>
          {children || emptyState}
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;