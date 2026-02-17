// Add to Wallet Button Component
// Allows customers to add their order to Apple Wallet or Google Pay

'use client';

import React, { useState } from 'react';
import api from '@/utils/api';

interface AddToWalletProps {
  orderId: string;
  className?: string;
  variant?: 'apple' | 'google' | 'both';
  size?: 'small' | 'medium' | 'large';
}

export const AddToWallet: React.FC<AddToWalletProps> = ({
  orderId,
  className = '',
  variant = 'both',
  size = 'medium'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detect platform
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  // Determine which button(s) to show
  const showApple = variant === 'both' || variant === 'apple';
  const showGoogle = variant === 'both' || variant === 'google';

  // Size classes
  const sizeClasses = {
    small: 'h-10 text-sm',
    medium: 'h-12 text-base',
    large: 'h-14 text-lg'
  };

  const handleAddToAppleWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/wallet/order/${orderId}/apple`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to download pass');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fesi-order-${orderId}.pkpass`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Apple Wallet pass:', error);
      setError('Failed to add to Apple Wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToGooglePay = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<{ saveUrl: string }>(`/api/wallet/order/${orderId}/google`);
      const { saveUrl } = response;

      // Open Google Pay save URL
      window.open(saveUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error adding to Google Pay:', error);
      setError('Failed to add to Google Pay. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        {showApple && (!isAndroid || variant === 'both') && (
          <button
            onClick={handleAddToAppleWallet}
            disabled={isLoading}
            className={`
              flex-1 flex items-center justify-center gap-2
              ${sizeClasses[size]}
              bg-black text-white rounded-lg
              hover:bg-gray-800 active:bg-gray-900
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Adding...</span>
              </div>
            ) : (
              <>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span>Add to Apple Wallet</span>
              </>
            )}
          </button>
        )}

        {showGoogle && (!isIOS || variant === 'both') && (
          <button
            onClick={handleAddToGooglePay}
            disabled={isLoading}
            className={`
              flex-1 flex items-center justify-center gap-2
              ${sizeClasses[size]}
              bg-white text-gray-900 rounded-lg
              border-2 border-gray-300
              hover:bg-gray-50 active:bg-gray-100
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Adding...</span>
              </div>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Add to Google Pay</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Auto-select based on platform */}
      {variant === 'both' && (
        <p className="text-xs text-gray-500 text-center">
          {isIOS ? 'Recommended: Apple Wallet' : isAndroid ? 'Recommended: Google Pay' : 'Choose your preferred wallet'}
        </p>
      )}
    </div>
  );
};

export default AddToWallet;
