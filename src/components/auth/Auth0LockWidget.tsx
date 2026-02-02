'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button } from '@/components/atoms';

interface Auth0LockWidgetProps {
  onAuthenticated?: (authResult: any) => void;
  returnTo?: string;
  container?: string;
  allowSignUp?: boolean;
  allowLogin?: boolean;
  initialScreen?: 'login' | 'signUp' | 'forgotPassword';
}

export function Auth0LockWidget({
  onAuthenticated,
  returnTo = '/',
  allowSignUp = true,
  allowLogin = true,
  initialScreen = 'login',
}: Auth0LockWidgetProps) {
  const router = useRouter();
  const { loginWithRedirect } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: initialScreen === 'signUp' ? 'signup' : 'login',
          redirect_uri: window.location.origin,
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          scope: 'openid profile email',
        },
        appState: {
          returnTo: returnTo,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <Button
        variant="primary"
        size="lg"
        onClick={handleLogin}
        fullWidth
        isDisabled={isLoading}
      >
        {isLoading ? 'Loading...' : initialScreen === 'signUp' ? 'Sign Up' : 'Sign In'}
      </Button>
      
      {allowSignUp && initialScreen === 'login' && (
        <div style={{ marginTop: 'var(--spacing-4)' }}>
          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
            Don't have an account?{' '}
            <button
              onClick={() => handleLogin()}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary-600)',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              Sign up
            </button>
          </Typography>
        </div>
      )}
      
      {allowLogin && initialScreen === 'signUp' && (
        <div style={{ marginTop: 'var(--spacing-4)' }}>
          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <button
              onClick={() => handleLogin()}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary-600)',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              Sign in
            </button>
          </Typography>
        </div>
      )}
    </div>
  );
}