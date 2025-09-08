export default function RestaurantsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Restaurants Near You
        </h1>
        
        <div className="mb-8">
          <p className="text-neutral-600">
            This page will show a list of restaurants using our SearchInput and RestaurantCard components.
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            Components are available in Storybook for development and testing.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Coming Soon:</h3>
          <ul className="space-y-2 text-neutral-600">
            <li>• Restaurant search and filtering</li>
            <li>• Restaurant cards with ratings and cuisine types</li>
            <li>• Interactive map integration</li>
            <li>• Real-time availability status</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
