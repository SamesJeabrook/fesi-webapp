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
  let activeEvent: boolean = false;
  let eventData: any = null;
  let error: string | null = null;

  try {
    console.log('Fetching menu data for:', id);
    // Use the menu API endpoint that returns the correct structure
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/menu/merchant/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch menu: ${response.status}`);
    }
    
    menuData = await response.json();

    const activeEventResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/merchants/${menuData.data.merchant.id}/active-event`);
    if (activeEventResponse.ok) {
      const activeEventData = await activeEventResponse.json();
      activeEvent = activeEventData.hasActiveEvent;
      if (activeEvent) {
        eventData = activeEventData.event;
      }
    }
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
      <GridContainer justifyContent="center" alignItems="center">
        <GridItem md={8} lg={6} xl={4}>
            <Typography as="h1" variant="heading-3">
              Unable to Load Vendor
            </Typography>
            <Typography variant="body-medium">{error}</Typography>
            <a
              href="/vendors"
            >
              Browse All Eateries
            </a>
        </GridItem>
      </GridContainer>
    );
  }

  // Handle case where menu data is not found
  if (!menuData || !menuData.success) {
    return (
      <GridContainer justifyContent="center" alignItems="center">
        <GridItem md={8} lg={6} xl={4}>
            <Typography as="h1" variant="heading-3">
              Vendor Not Found
            </Typography>
            <Typography variant="body-medium">The vendor you are looking for could not be found.</Typography>
            <a
              href="/vendors"
            >
              Browse All Eateries
            </a>
        </GridItem>
      </GridContainer>
    );
  }

  // Transform the API response using the correct structure
  const { merchant, categories: transformedCategories } = transformMenuResponse(menuData);

  return (
    <VendorMenuWrapper 
      activeEvent={activeEvent}
      eventData={eventData}
      merchant={merchant}
      categories={transformedCategories}
    />
  );
}
