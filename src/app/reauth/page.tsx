'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';

export default function ReauthPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    // If already authenticated, check for redirect
    if (isAuthenticated) {
      const postLoginRedirect = sessionStorage.getItem('postLoginRedirect');
      if (postLoginRedirect) {
        sessionStorage.removeItem('postLoginRedirect');
        router.push(postLoginRedirect);
      } else {
        router.push('/');
      }
      return;
    }

    // If not authenticated and not loading, trigger login
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: '/reauth' }
      });
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>
          Completing Setup...
        </h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Your merchant account has been created successfully!
        </p>
        <p style={{ color: '#666' }}>
          Please log in again to access your merchant dashboard.
        </p>
        <div style={{ 
          marginTop: '30px', 
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
