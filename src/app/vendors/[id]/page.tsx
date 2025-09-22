import { notFound } from 'next/navigation';
import { VendorMenuWrapper } from './components/VendorMenuWrapper';
import { transformMenuResponse } from '@/utils/menu/menuTransformers';
import { GridContainer, GridItem } from '@/components/atoms/Grid';
import { Typography } from '@/components/atoms/Typography';

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/merchants/${id}`);
    
    if (!response.ok) {
      return {
        title: 'Vendor Not Found - Fesi',
        description: 'The vendor you are looking for could not be found.',
      };
    }

    const data = await response.json();
    const vendor = data.success ? data.data : null;
    
    if (!vendor) {
      return {
        title: 'Vendor Not Found - Fesi',
        description: 'The vendor you are looking for could not be found.',
      };
    }

    return {
      title: `${vendor.name} - Fesi`,
      description: vendor.description || `Order delicious food from ${vendor.name}`,
      openGraph: {
        title: vendor.name,
        description: vendor.description || `Order delicious food from ${vendor.name}`,
        images: vendor.image_url ? [{ url: vendor.image_url }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Vendor - Fesi',
      description: 'Mobile food stall on Fesi',
    };
  }
}

export default async function VendorPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  // Fetch vendor data on the server
  let menuData: any = null;
  let error: string | null = null;

  try {
    console.log('Fetching menu data for:', id);
    // Use the menu API endpoint that returns the correct structure
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/menu/merchant/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch menu: ${response.status}`);
    }
    
    menuData = await response.json();
    console.log('Fetched menu data:', menuData ? 'Success' : 'No data');
  } catch (err) {
    console.error('Error fetching menu:', err);
    error = err instanceof Error ? err.message : 'Failed to load menu';
  }

  // Handle not found case
  if (!menuData && !error) {
    notFound();
  }

  // Handle error case
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <GridContainer justifyContent="center" alignItems="center" className="min-h-screen">
          <GridItem md={8} lg={6} xl={4}>
            <div className="text-center">
              <Typography as="h1" variant="heading-3" className="mb-4 text-neutral-900">
                Unable to Load Vendor
              </Typography>
              <Typography variant="body-medium" className="mb-8 text-neutral-600">{error}</Typography>
              <a
                href="/vendors"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Browse All Eateries
              </a>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
  }

  // Handle case where menu data is not found
  if (!menuData || !menuData.success) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <GridContainer justifyContent="center" alignItems="center" className="min-h-screen">
          <GridItem md={8} lg={6} xl={4}>
            <div className="text-center">
              <Typography as="h1" variant="heading-3" className="mb-4 text-neutral-900">
                Vendor Not Found
              </Typography>
              <Typography variant="body-medium" className="mb-8 text-neutral-600">The vendor you are looking for could not be found.</Typography>
              <a
                href="/vendors"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Browse All Eateries
              </a>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    );
  }

  // Transform the API response using the correct structure
  const { merchant, categories: transformedCategories } = transformMenuResponse(menuData);

  return (
    <VendorMenuWrapper 
      merchant={merchant}
      categories={transformedCategories}
    />
  );
}
