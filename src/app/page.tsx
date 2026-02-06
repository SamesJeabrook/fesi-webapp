'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@/components/atoms/Typography';

export default function HomePage() {
  const router = useRouter();

  // Check if user just logged out and should be redirected
  useEffect(() => {
    const postLogoutRedirect = sessionStorage.getItem('postLogoutRedirect');
    if (postLogoutRedirect) {
      sessionStorage.removeItem('postLogoutRedirect');
      router.push(postLogoutRedirect);
      return;
    }

    // Check if user just logged in and should be redirected (e.g., after merchant onboarding)
    const postLoginRedirect = sessionStorage.getItem('postLoginRedirect');
    if (postLoginRedirect) {
      sessionStorage.removeItem('postLoginRedirect');
      router.push(postLoginRedirect);
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <Typography as="h1" variant="heading-1" className="mb-4 text-neutral-900">
            Welcome to Fesi
          </Typography>
          <Typography variant="body-large" className="text-neutral-600 max-w-2xl mx-auto">
            Your favorite local restaurants, delivered to your door. 
            Browse menus, customize your order, and track delivery in real-time.
          </Typography>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🍕</span>
            </div>
            <Typography as="h3" variant="heading-5" className="mb-2 text-neutral-900">
              Browse Restaurants
            </Typography>
            <Typography variant="body-medium" className="text-neutral-600">
              Discover local restaurants and explore their menus
            </Typography>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛒</span>
            </div>
            <Typography as="h3" variant="heading-5" className="mb-2 text-neutral-900">
              Customize Orders
            </Typography>
            <Typography variant="body-medium" className="text-neutral-600">
              Add items to cart and customize to your preferences
            </Typography>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <Typography as="h3" variant="heading-5" className="mb-2 text-neutral-900">
              Fast Delivery
            </Typography>
            <Typography variant="body-medium" className="text-neutral-600">
              Track your order in real-time until it reaches your door
            </Typography>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a 
              href="/customer/signup"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Sign Up as Customer
            </a>
            <a 
              href="/vendors"
              className="inline-block bg-white border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              Browse Vendors
            </a>
            <a 
              href="/customer/login"
              className="inline-block text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              Log In
            </a>
          </div>

          <div className="mb-8">
            <Typography variant="body-medium" className="text-neutral-600 mb-3">
              Are you a restaurant or vendor?
            </Typography>
            <a 
              href="/merchant/onboarding"
              className="inline-block bg-secondary-600 text-white px-8 py-3 rounded-lg hover:bg-secondary-700 transition-colors font-medium"
            >
              Become a Merchant
            </a>
          </div>
          
          <Typography variant="body-medium" className="text-neutral-500 mb-4">
            Components available in Storybook for development
          </Typography>
          <a 
            href="http://localhost:6006" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-neutral-200 text-neutral-700 px-6 py-2 rounded-lg hover:bg-neutral-300 transition-colors text-sm"
          >
            View Storybook Components
          </a>
        </div>
      </div>
    </main>
  );
}
