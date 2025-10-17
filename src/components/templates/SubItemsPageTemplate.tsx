'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SubItemsManager } from '@/components/organisms/SubItemsManager';
import { SubItemsAPIInterface } from '@/services/subItemsAPI';
import Notification from '@/components/atoms/Notification/Notification';
import styles from './SubItemsPageTemplate.module.scss';

export interface SubItemsPageTemplateProps {
  api: SubItemsAPIInterface;
  title: string;
  description: string;
  showMerchantName?: boolean;
  backLink?: { label: string; href: string };
  adminContext?: string;
  requiredRoles: string[];
}

export const SubItemsPageTemplate: React.FC<SubItemsPageTemplateProps> = ({
  api,
  title,
  description,
  showMerchantName = false,
  backLink,
  adminContext,
  requiredRoles
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ProtectedRoute requireRole={requiredRoles}>
      <div className={styles.subItemsPage}>
        <SubItemsManager
          api={api}
          title={title}
          description={description}
          showMerchantName={showMerchantName}
          backLink={backLink}
          adminContext={adminContext}
          onError={handleError}
        />

        {/* Error Notification */}
        {error && (
          <div className={styles.subItemsPage__notification}>
            <Notification
              message={error}
              subMessage=""
              type="error"
              onClose={clearError}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};