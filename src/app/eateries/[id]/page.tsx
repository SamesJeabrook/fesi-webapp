import { notFound } from 'next/navigation';
import { EateryService, type EateryWithMenu } from '@/services/eateryService';
import { MenuItemCard } from '@/components/molecules/MenuItemCard';
import type { MenuItem as MenuItemType } from '@/types';

// Convert API response format to component format
function convertToComponentFormat(apiItem: any): MenuItemType {
  return {
    id: apiItem.id,
    merchantId: apiItem.merchant_id,
    categoryId: apiItem.category_id || '',
    name: apiItem.title || apiItem.name,
    description: apiItem.description,
    price: EateryService.formatPrice(apiItem.base_price || 0), // Format price for display
    basePrice: apiItem.base_price, // Keep raw price for calculations
    imageUrl: apiItem.image_url,
    isAvailable: apiItem.is_active ?? true,
    isPopular: false, // TODO: Calculate based on order frequency
    preparationTime: 15, // TODO: Get from API or calculate average
    calories: undefined, // TODO: Add to database schema
    allergens: [], // TODO: Add to database schema  
    dietaryInfo: [], // TODO: Add to database schema
    options: [], // TODO: Implement sub-items/options
    displayOrder: apiItem.display_order || 0,
    createdAt: apiItem.created_at,
    updatedAt: apiItem.updated_at,
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const eatery = await EateryService.getEateryById(id);
    
    if (!eatery) {
      return {
        title: 'Eatery Not Found - Fesi',
        description: 'The eatery you are looking for could not be found.',
      };
    }

    return {
      title: `${eatery.name} - Fesi`,
      description: eatery.description || `Order delicious food from ${eatery.name}`,
      openGraph: {
        title: eatery.name,
        description: eatery.description || `Order delicious food from ${eatery.name}`,
        images: eatery.image_url ? [{ url: eatery.image_url }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Eatery - Fesi',
      description: 'Mobile food stall on Fesi',
    };
  }
}

export default async function EateryPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  console.log('Eatery ID from params:', id); // Debug log
  
  let eateryData: EateryWithMenu | null = null;
  let error: string | null = null;

  try {
    // The EateryService already has caching with { next: { revalidate: 300 } }
    // This gives you static generation with revalidation every 5 minutes
    eateryData = await EateryService.getEateryWithMenu(id);
    console.log('Fetched eatery data:', eateryData ? 'Success' : 'No data'); // Debug log
  } catch (err) {
    console.error('Failed to load eatery data:', err);
    error = 'Failed to load eatery information. Please try again later.';
  }

  // If eatery doesn't exist, show 404
  if (!eateryData && !error) {
    notFound();
  }

  // If there was an error loading data
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Unable to Load Eatery
            </h1>
            <p className="text-neutral-600 mb-8">{error}</p>
            <a
              href="/eateries"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse All Eateries
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { eatery, categories, menuItems } = eateryData!;

  // Group menu items by category
  const itemsByCategory = menuItems.reduce((acc, item) => {
    const categoryId = item.category_id || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Eatery Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {eatery.image_url && (
            <div className="h-64 bg-neutral-200 overflow-hidden">
              <img
                src={eatery.image_url}
                alt={eatery.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              {eatery.name}
            </h1>
            
            {eatery.description && (
              <p className="text-neutral-600 mb-4 text-lg">
                {eatery.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              {eatery.average_wait_time_minutes && (
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">⏱️</span>
                  <span className="text-neutral-700">
                    Avg wait: {EateryService.getWaitTimeDisplay(eatery.average_wait_time_minutes)}
                  </span>
                </div>
              )}
              
              {eatery.loyalty_enabled && (
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">🎯</span>
                  <span className="text-neutral-700">
                    Loyalty card available ({eatery.stamps_required} stamps for {eatery.loyalty_reward_description})
                  </span>
                </div>
              )}
              
              {eatery.offers_enabled && (
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">🏷️</span>
                  <span className="text-neutral-700">Special offers available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Menu</h2>
          
          {menuItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-neutral-600">
                This eatery hasn't added any menu items yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Render items by category */}
              {categories.length > 0 ? (
                categories.map((category) => {
                  const categoryItems = itemsByCategory[category.id] || [];
                  
                  if (categoryItems.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-neutral-600 text-sm mt-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryItems.map((item) => (
                          <MenuItemCard
                            key={item.id}
                            menuItem={convertToComponentFormat(item)}
                            onAddToCart={(item, quantity) => {
                              // TODO: Implement add to cart functionality
                              console.log('Add to cart:', item, quantity);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Items without categories */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      menuItem={convertToComponentFormat(item)}
                      onAddToCart={(item, quantity) => {
                        // TODO: Implement add to cart functionality
                        console.log('Add to cart:', item, quantity);
                      }}
                    />
                  ))}
                </div>
              )}
              
              {/* Uncategorized items */}
              {itemsByCategory.uncategorized && itemsByCategory.uncategorized.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-neutral-900">Other Items</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itemsByCategory.uncategorized.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        menuItem={convertToComponentFormat(item)}
                        onAddToCart={(item, quantity) => {
                          // TODO: Implement add to cart functionality
                          console.log('Add to cart:', item, quantity);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Development Note */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Development Status</h4>
          <p className="text-sm text-blue-700">
            This page now fetches real data from your API. To test with real data, ensure your API server is running 
            and has eatery data for ID: <code className="bg-blue-100 px-1 rounded">{id}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
