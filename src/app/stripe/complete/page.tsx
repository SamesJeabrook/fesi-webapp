'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StripeCompletePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if we're in a mobile browser and try to redirect back to app
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try to open the app with a deep link
      window.location.href = 'fesiapp://stripe/complete';
      
      // Fallback message if deep link doesn't work
      setTimeout(() => {
        // Still here? Show the message
      }, 1000);
    } else {
      // Desktop - redirect to merchant dashboard
      router.push('/merchant/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Stripe Setup Complete!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your bank account has been connected. You can now return to the Fesi app to continue.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 font-medium">
            📱 Using the mobile app?
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Switch back to the Fesi app and tap "I've Completed Setup" to continue.
          </p>
        </div>
        
        <p className="text-xs text-gray-500">
          You can close this window and return to the app.
        </p>
      </div>
    </div>
  );
}
