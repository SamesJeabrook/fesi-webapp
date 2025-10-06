'use client';

import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@/components/atoms';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

export default function Navigation() {
  const { isAuthenticated, user } = useAuth0();
  const userRoles = user?.['https://fesi.app/roles'] || [];
  const isAdmin = userRoles.includes('admin');
  const isMerchant = userRoles.includes('merchant');

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <div className="navigation__brand">
          <Link href="/">
            <Typography variant="heading-4" style={{ color: 'var(--color-primary)' }}>
              Fesi
            </Typography>
          </Link>
        </div>

        <div className="navigation__links">
          {isAuthenticated && (
            <>
              {isAdmin && (
                <>
                  <Link href="/admin/merchants" className="navigation__link">
                    <Typography variant="body-medium">Admin Dashboard</Typography>
                  </Link>
                  <Link href="/merchant/admin/orders" className="navigation__link">
                    <Typography variant="body-medium">Merchant Orders</Typography>
                  </Link>
                </>
              )}
              
              {(isMerchant && !isAdmin) && (
                <Link href="/merchant/admin/orders" className="navigation__link">
                  <Typography variant="body-medium">My Orders</Typography>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="navigation__auth">
          {isAuthenticated ? (
            <div className="navigation__user">
              <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                {user?.email} {isAdmin && '(Admin)'} {isMerchant && !isAdmin && '(Merchant)'}
              </Typography>
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>

      <style jsx>{`
        .navigation {
          background: var(--color-background-secondary);
          border-bottom: 1px solid var(--color-border);
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navigation__container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
        }

        .navigation__brand a {
          text-decoration: none;
        }

        .navigation__links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .navigation__link {
          text-decoration: none;
          color: var(--color-text);
          transition: color 0.2s ease;
        }

        .navigation__link:hover {
          color: var(--color-primary);
        }

        .navigation__auth {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .navigation__user {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: right;
        }

        @media (max-width: 768px) {
          .navigation {
            padding: 0 1rem;
          }
          
          .navigation__links {
            gap: 1rem;
          }
          
          .navigation__user {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </nav>
  );
}