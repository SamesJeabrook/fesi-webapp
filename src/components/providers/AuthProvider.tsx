'use client';

import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { getDevToken } from '@/utils/devAuth';
import { setGlobalAuth0TokenGetter } from '@/utils/api';

interface AuthProviderProps {
  children: ReactNode;
}

interface DevAuthContextType {
  getToken: () => Promise<string>;
}

const DevAuthContext = createContext<DevAuthContextType | null>(null);

export function useDevAuth() {
  return useContext(DevAuthContext);
}

function DevAuthWrapper({ children }: { children: ReactNode }) {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();

  const getToken = async (): Promise<string> => {
    // Check for dev token first
    const devToken = getDevToken();
    if (devToken) {
      console.log('[DEV MODE] Using development token:', devToken);
      return devToken;
    }

    // Fall back to Auth0
    return await getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      },
    });
  };

  // Set the global token getter for the api utility
  useEffect(() => {
    setGlobalAuth0TokenGetter(getToken);
  }, [getAccessTokenSilently]);

  // Sync Auth0 user to database on login
  useEffect(() => {
    const syncUserToDatabase = async () => {
      if (isAuthenticated && user) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          
          const response = await fetch(`${apiUrl}/api/auth/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('✅ User synced to database:', data.user?.email);
          } else {
            console.error('❌ Failed to sync user to database:', response.status);
          }
        } catch (error) {
          console.error('❌ Error syncing user to database:', error);
        }
      }
    };

    syncUserToDatabase();
  }, [isAuthenticated, user]);

  return (
    <DevAuthContext.Provider value={{ getToken }}>
      {children}
    </DevAuthContext.Provider>
  );
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '';
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '';
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

  const authorizationParams: any = {
    redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
    scope: 'openid profile email'
  };

  // Only add audience if it's defined
  if (audience) {
    authorizationParams.audience = audience;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={authorizationParams}
      cacheLocation="localstorage"
    >
      <DevAuthWrapper>
        {children}
      </DevAuthWrapper>
    </Auth0Provider>
  );
}