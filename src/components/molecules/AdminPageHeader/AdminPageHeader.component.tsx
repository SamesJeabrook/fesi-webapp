import React from 'react';
import classNames from 'classnames';
import { Typography, Grid, AdminBadge, BackLink } from '@/components/atoms';
import type { AdminPageHeaderProps } from './AdminPageHeader.types';
import styles from './AdminPageHeader.module.scss';

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  backLink,
  adminContext = "System administration area",
  title,
  description,
  actions,
  className,
  'data-testid': dataTestId,
}) => {
  const headerClasses = classNames(
    styles.adminPageHeader,
    className
  );

  return (
    <Grid.Container gap="lg" className={headerClasses} data-testid={dataTestId}>
      {/* Back Link & Admin Badge */}
      <Grid.Item className={styles.adminPageHeader__info}>
        <div className={styles.adminPageHeader__navigation}>
          <AdminBadge variant="warning" className={styles.adminPageHeader__badge}>
            <div className={styles.adminPageHeader__badgeContent}>
              <span className={styles.adminPageHeader__badgeText}>🔧 ADMIN MODE</span>
              <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                {adminContext}
              </Typography>
            </div>
          </AdminBadge>
          {backLink && (
            <BackLink 
              href={backLink.href} 
              label={backLink.label}
              className={styles.adminPageHeader__backLink}
            />
          )}
        </div>
      </Grid.Item>
      
      {/* Title & Description */}
      <Grid.Item md={10} className={styles.adminPageHeader__content}>
        <Typography variant="heading-3" className={styles.adminPageHeader__title}>
          {title}
        </Typography>
        {description && (
          <Typography 
            variant="body-medium" 
            className={styles.adminPageHeader__description}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {description}
          </Typography>
        )}
      </Grid.Item>
      
      {/* Actions */}
      {actions && (
        <Grid.Item md={6} className={styles.adminPageHeader__actions}>
          {actions}
        </Grid.Item>
      )}
    </Grid.Container>
  );
};