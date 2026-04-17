import { notFound } from 'next/navigation';
import { VendorMenuWrapper } from './components/VendorMenuWrapper';
import { transformMenuResponse } from '@/utils/menu/menuTransformers';
import { GridContainer, GridItem } from '@/components/atoms/Grid';
import { Typography } from '@/components/atoms/Typography';
import { CustomerNavigationWrapper } from '@/components/molecules/CustomerNavigation';

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/merchants/${id}`);
    
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // First get merchant info
    const merchantResponse = await fetch(`${apiUrl}/api/merchants/${id}`);
    if (!merchantResponse.ok) {
      throw new Error(`Failed to fetch merchant: ${merchantResponse.status}`);
    }
    const merchantData = await merchantResponse.json();
    const merchant = merchantData.success ? merchantData.data : null;
    
    if (!merchant) {
      throw new Error('Merchant not found');
    }

    // Check for active event
    const activeEventResponse = await fetch(`${apiUrl}/api/merchants/${merchant.id}/active-event`);
    let menuIdToFetch: string | null = null;
    
    if (activeEventResponse.ok) {
      const activeEventData = await activeEventResponse.json();
      activeEvent = activeEventData.hasActiveEvent;
      if (activeEvent) {
        eventData = activeEventData.event;
        // If event has a specific menu assigned, use that
        if (eventData.menu_id) {
          menuIdToFetch = eventData.menu_id;
        }
      } else {
        // No active event - check for upcoming events for pre-orders
        try {
          const eventsResponse = await fetch(`${apiUrl}/api/events?merchant_id=${merchant.id}`);
          if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json();
            // Find the next upcoming event (future events sorted by start time)
            const now = new Date();
            const upcomingEvents = eventsData
              .filter((evt: any) => new Date(evt.start_time) > now)
              .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
            
            if (upcomingEvents.length > 0) {
              eventData = upcomingEvents[0];  // Use the next upcoming event for pre-orders
            }
          }
        } catch (err) {
          console.log('Could not fetch upcoming events:', err);
        }
      }
    }

    // If no event menu, get the default menu
    if (!menuIdToFetch) {
      const menusResponse = await fetch(`${apiUrl}/api/menus/merchant/${merchant.id}/public`);
      if (menusResponse.ok) {
        const menus = await menusResponse.json();
        const defaultMenu = menus.find((m: any) => m.is_default && m.is_active);
        if (defaultMenu) {
          menuIdToFetch = defaultMenu.id;
        }
      }
    }

    // Fetch the specific menu with its items grouped by category
    if (menuIdToFetch) {
      const menuResponse = await fetch(`${apiUrl}/api/menus/${menuIdToFetch}/public`);
      if (menuResponse.ok) {
        menuData = await menuResponse.json();
      } else {
        throw new Error(`Failed to fetch menu: ${menuResponse.status}`);
      }
    } else {
      // Fallback to legacy menu endpoint if no menu found
      const response = await fetch(`${apiUrl}/api/menu/merchant/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch menu: ${response.status}`);
      }
      menuData = await response.json();
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
    <>
      <CustomerNavigationWrapper />
      <VendorMenuWrapper 
        activeEvent={activeEvent}
        eventData={eventData}
        merchant={merchant}
        categories={transformedCategories}
      />
    </>
  );
}
