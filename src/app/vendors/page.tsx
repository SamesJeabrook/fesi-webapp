import Link from 'next/link';
import { VendorService } from '@/services/vendorService';
import { Typography } from '@/components/atoms/Typography';

// This page shows all available vendors
export default async function VendorsPage() {
  let vendors: any[] = [];
  let error: string | null = null;

  try {
    // TODO: Implement VendorService.getAllVendors() method
    // For now, we'll create some placeholder data
    vendors = [
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
    <>
      <Typography as="h1" variant="heading-2" className="mb-8 text-neutral-900">
        Mobile Food Stalls Near You
      </Typography>
      
      {error ? (
          <Typography variant="body-medium" className="text-red-700">{error}</Typography>
      ) : (
          <>
            <Typography variant="body-medium" className="text-neutral-600">
              Discover delicious food from local mobile stalls and food trucks.
            </Typography>

            {vendors.map((vendor: any) => (
              <Link
                key={vendor.id}
                href={`/vendors/${vendor.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {vendor.image_url && (
                  <img
                    src={vendor.image_url}
                    alt={vendor.name}
                    className="w-full h-full object-cover" />
                )}

                <Typography as="h3" variant="heading-4" className="mb-2 text-neutral-900">
                  {vendor.name}
                </Typography>

                {vendor.description && (
                  <Typography variant="body-medium" className="text-neutral-600 mb-4">
                    {vendor.description}
                  </Typography>
                )}

                {vendor.average_wait_time_minutes && (
                  <>
                    <Typography as="span" variant="body-small" className="text-neutral-500">⏱️</Typography>
                    <Typography as="span" variant="body-small" className="text-neutral-700">
                      {vendor.average_wait_time_minutes} min
                    </Typography>
                  </>
                )}

                {vendor.loyalty_enabled && (
                  <>
                    <Typography as="span" variant="body-small" className="text-neutral-500">🎯</Typography>
                    <Typography as="span" variant="body-small" className="text-neutral-700">Loyalty cards</Typography>
                  </>
                )}
              </Link>
            ))}
          {/* Development Note */}
            <Typography as="h4" variant="body-small" className="text-blue-900 mb-2 font-semibold">Development Status</Typography>
            <Typography variant="body-small" className="text-blue-700">
              This page currently shows placeholder data. Once your API is running, you can implement
              <code>VendorService.getAllVendors()</code>
              to fetch real vendor data.
            </Typography>
        </>
      )}
    </>
  );
}
