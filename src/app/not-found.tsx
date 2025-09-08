'use client';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="max-w-md w-full mx-auto p-6 text-center">
        <h1 className="text-6xl font-bold text-neutral-300 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-neutral-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <a
            href="/"
            className="inline-block w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Home
          </a>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-neutral-200 text-neutral-900 px-6 py-3 rounded-lg hover:bg-neutral-300 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
