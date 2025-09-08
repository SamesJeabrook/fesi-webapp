'use client';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Welcome to Fesi
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Your favorite local restaurants, delivered to your door. 
            Browse menus, customize your order, and track delivery in real-time.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🍕</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Browse Restaurants
            </h3>
            <p className="text-neutral-600">
              Discover local restaurants and explore their menus
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Customize Orders
            </h3>
            <p className="text-neutral-600">
              Add items to cart and customize to your preferences
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Fast Delivery
            </h3>
            <p className="text-neutral-600">
              Track your order in real-time until it reaches your door
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-neutral-500 mb-4">
            Components available in Storybook for development
          </p>
          <a 
            href="http://localhost:6006" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            View Storybook Components
          </a>
        </div>
      </div>
    </main>
  );
}
