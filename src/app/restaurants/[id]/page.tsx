export default function RestaurantPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Restaurant Menu
        </h1>
        
        <div className="mb-8">
          <p className="text-neutral-600">
            Restaurant ID: <span className="font-mono bg-neutral-100 px-2 py-1 rounded">{params.id}</span>
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This page will show restaurant details and menu using our MenuItemCard components.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Coming Soon:</h3>
          <ul className="space-y-2 text-neutral-600">
            <li>• Restaurant information and photos</li>
            <li>• Menu categories and items</li>
            <li>• Item customization options</li>
            <li>• Add to cart functionality</li>
            <li>• Reviews and ratings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
