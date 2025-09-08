import Link from 'next/link';
import { EateryService } from '@/services/eateryService';

// This page shows all available eateries
export default async function EateriesPage() {
  let eateries: any[] = [];
  let error: string | null = null;

  try {
    // TODO: Implement EateryService.getAllEateries() method
    // For now, we'll create some placeholder data
    eateries = [
      {
        id: '1',
        name: 'Mario\'s Mobile Pizzeria',
        description: 'Authentic wood-fired pizzas made fresh to order',
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        average_wait_time_minutes: 15,
        loyalty_enabled: true,
      },
      {
        id: '2', 
        name: 'Street Taco Express',
        description: 'Fresh Mexican street food with locally sourced ingredients',
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        average_wait_time_minutes: 8,
        loyalty_enabled: false,
      },
      {
        id: '3',
        name: 'Gourmet Burger Van',
        description: 'Premium burgers with artisanal buns and house-made sauces', 
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        average_wait_time_minutes: 12,
        loyalty_enabled: true,
      }
    ];
  } catch (err) {
    console.error('Failed to load eateries:', err);
    error = 'Failed to load eateries. Please try again later.';
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Mobile Food Stalls Near You
        </h1>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-neutral-600">
                Discover delicious food from local mobile stalls and food trucks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eateries.map((eatery) => (
                <Link
                  key={eatery.id}
                  href={`/eateries/${eatery.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {eatery.image_url && (
                    <div className="h-48 bg-neutral-200 overflow-hidden">
                      <img
                        src={eatery.image_url}
                        alt={eatery.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {eatery.name}
                    </h3>
                    
                    {eatery.description && (
                      <p className="text-neutral-600 mb-4">
                        {eatery.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 text-sm">
                      {eatery.average_wait_time_minutes && (
                        <div className="flex items-center gap-1">
                          <span className="text-neutral-500">⏱️</span>
                          <span className="text-neutral-700">
                            {EateryService.getWaitTimeDisplay(eatery.average_wait_time_minutes)}
                          </span>
                        </div>
                      )}
                      
                      {eatery.loyalty_enabled && (
                        <div className="flex items-center gap-1">
                          <span className="text-neutral-500">🎯</span>
                          <span className="text-neutral-700">Loyalty cards</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Development Note */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Development Status</h4>
              <p className="text-sm text-blue-700">
                This page currently shows placeholder data. Once your API is running, you can implement 
                <code className="bg-blue-100 px-1 rounded mx-1">EateryService.getAllEateries()</code> 
                to fetch real eatery data.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
