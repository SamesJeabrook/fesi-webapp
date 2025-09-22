'use client';

import { Typography } from '@/components/atoms/Typography';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="max-w-md w-full mx-auto p-6">
            <div className="text-center">
              <Typography as="h1" variant="heading-1" className="text-neutral-300 mb-4">
                Oops!
              </Typography>
              <Typography as="h2" variant="heading-3" className="text-neutral-900 mb-4">
                Something went wrong
              </Typography>
              <Typography variant="body-medium" className="text-neutral-600 mb-8">
                We're sorry, but something unexpected happened. Please try again.
              </Typography>
              <div className="space-y-4">
                <button
                  onClick={reset}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-neutral-200 text-neutral-900 px-6 py-3 rounded-lg hover:bg-neutral-300 transition-colors"
                >
                  Go Home
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-8 text-left">
                  <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 text-xs bg-neutral-100 p-4 rounded overflow-auto">
                    {error.message}
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
