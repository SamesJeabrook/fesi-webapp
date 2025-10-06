'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '@/components/providers/AdminProvider';
import { Typography } from '@/components/atoms';
import { Button } from '@/components/atoms/Button/Button.component';

export default function AdminHeader() {
  const { selectedMerchant, isImpersonating, isAdmin, clearImpersonation } = useAdmin();

  if (!isAdmin) return null;

  return (
    <div className="admin-header">
      <div className="admin-header__container">
        <div className="admin-header__content">
          {isImpersonating ? (
            <div className="admin-header__impersonation">
              <div className="admin-header__impersonation-info">
                <Typography variant="body-small" style={{ color: 'var(--color-warning)' }}>
                  🔧 ADMIN MODE: Viewing as
                </Typography>
                <Typography variant="body-medium" style={{ fontWeight: 'bold' }}>
                  {selectedMerchant?.business_name}
                </Typography>
                <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                  {selectedMerchant?.email}
                </Typography>
              </div>
              <div className="admin-header__actions">
                <Link href="/admin/merchants">
                  <Button variant="secondary" size="sm">
                    Change Merchant
                  </Button>
                </Link>
                <Button variant="secondary" size="sm" onClick={clearImpersonation}>
                  Exit Admin Mode
                </Button>
              </div>
            </div>
          ) : (
            <div className="admin-header__normal">
              <Typography variant="body-medium" style={{ color: 'var(--color-primary)' }}>
                👑 Admin Dashboard
              </Typography>
              <Link href="/admin/merchants">
                <Button variant="primary" size="sm">
                  Select Merchant
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-header {
          background: linear-gradient(135deg, var(--color-warning-light), var(--color-warning));
          border-bottom: 2px solid var(--color-warning);
          padding: 0.75rem 2rem;
          position: sticky;
          top: 60px; /* Below main navigation */
          z-index: 90;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .admin-header__container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .admin-header__content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-header__impersonation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .admin-header__impersonation-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .admin-header__actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .admin-header__normal {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        @media (max-width: 768px) {
          .admin-header {
            padding: 0.5rem 1rem;
          }
          
          .admin-header__impersonation,
          .admin-header__normal {
            flex-direction: column;
            gap: 1rem;
          }
          
          .admin-header__actions {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}