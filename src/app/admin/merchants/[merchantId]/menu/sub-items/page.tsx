'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Button, Grid } from '@/components/atoms';
import { AdminPageHeader } from '@/components/molecules';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import styles from './adminSubItems.module.scss';

interface SubItemGroup {
  id: string;
  name: string;
  description?: string;
  selection_type: 'single' | 'multiple';
  is_required: boolean;
  max_selections?: number;
  display_order: number;
  menu_item_id: string;
  menu_item_name?: string;
  sub_items: SubItem[];
  created_at: string;
  updated_at: string;
}

interface SubItem {
  id: string;
  name: string;
  description?: string;
  price_adjustment_pence: number;
  display_order: number;
  is_available: boolean;
  group_id: string;
  created_at: string;
  updated_at: string;
}

interface MenuItem {
  id: string;
  name: string;
  category_name?: string;
}

interface Merchant {
  id: string;
  business_name: string;
  name: string;
}

export default function AdminMenuSubItemsPage() {
  const params = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [subItemGroups, setSubItemGroups] = useState<SubItemGroup[]>([]);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState('all');

  const merchantId = params?.merchantId as string;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      // Fetch merchant and menu data
      const [merchantResponse, menuResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/merchant/${merchantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      ]);

      if (merchantResponse.ok) {
        const merchantData = await merchantResponse.json();
        setMerchant(merchantData.data);
      }

      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        console.log('Menu data received:', menuData.data?.menu?.length || 0, 'categories');
        
        if (menuData.success && menuData.data && menuData.data.menu) {
          const allItems: MenuItem[] = [];
          const allSubItemGroups: SubItemGroup[] = [];
          
          // Extract items from categories
          for (const category of menuData.data.menu) {
            if (category.items && Array.isArray(category.items)) {
              for (const item of category.items) {
                allItems.push({
                  id: item.id,
                  name: item.title || item.name,
                  category_name: category.name
                });

                // Fetch sub-groups for this item
                try {
                  const subGroupsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/${item.id}/sub-groups`, {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                  });

                  if (subGroupsResponse.ok) {
                    const subGroupsData = await subGroupsResponse.json();
                    console.log(`Sub-groups for item ${item.id} (${item.title || item.name}):`, subGroupsData);
                    
                    // The API returns the menu item with option_groups property
                    let subGroupsArray = [];
                    if (subGroupsData && subGroupsData.option_groups) {
                      subGroupsArray = subGroupsData.option_groups;
                    } else if (Array.isArray(subGroupsData)) {
                      // Fallback if the API returns an array directly
                      subGroupsArray = subGroupsData;
                    }
                    
                    console.log(`Processed sub-groups array for ${item.id}:`, subGroupsArray);
                    console.log(`Is array?`, Array.isArray(subGroupsArray), `Length:`, subGroupsArray?.length);
                    
                    if (Array.isArray(subGroupsArray) && subGroupsArray.length > 0) {
                      subGroupsArray.forEach((subGroup: any) => {
                        console.log(`Processing sub-group:`, subGroup);
                        const processedGroup = {
                          id: subGroup.id,
                          name: subGroup.name,
                          description: subGroup.description,
                          selection_type: subGroup.selection_type || 'single',
                          is_required: subGroup.is_required || false,
                          max_selections: subGroup.max_selections,
                          display_order: subGroup.display_order || 0,
                          menu_item_id: item.id,
                          menu_item_name: item.title || item.name,
                          sub_items: subGroup.sub_items || [],
                          created_at: subGroup.created_at || new Date().toISOString(),
                          updated_at: subGroup.updated_at || new Date().toISOString()
                        };
                        console.log(`Adding processed group:`, processedGroup);
                        allSubItemGroups.push(processedGroup);
                      });
                    } else {
                      console.log(`No sub-groups found for item ${item.id} or not an array`);
                    }
                  }
                } catch (subError) {
                  console.error(`Error fetching sub-groups for item ${item.id}:`, subError);
                }
              }
            }
          }
          
          setItems(allItems);
          setSubItemGroups(allSubItemGroups);
          console.log('Final items:', allItems.length);
          console.log('Final sub-item groups:', allSubItemGroups.length, allSubItemGroups);
          console.log('All items found:', allItems);
          console.log('All sub-item groups found:', allSubItemGroups);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (merchantId) {
      fetchData();
    }
  }, [merchantId]);

  const filteredGroups = selectedItem === 'all' 
    ? subItemGroups 
    : subItemGroups.filter(group => group.menu_item_id === selectedItem);

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.subItems}>
        <AdminPageHeader
          backLink={{
            href: `/admin/merchants/${merchantId}`,
            label: `Back to ${merchant?.business_name || 'Merchant'} Dashboard`
          }}
          adminContext={`Managing sub-items for ${merchant?.business_name || 'merchant'}`}
          title="Menu Sub-Items & Option Groups"
          description="Manage option groups (like sizes, add-ons) and their individual items"
        />

        {items.length === 0 && !isLoading && (
          <Grid.Container gap="lg">
            <Grid.Item md={12} lg={8}>
              <div className={styles.subItems__noItems}>
                <Typography variant="heading-5">No menu items available</Typography>
                <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  You need to create menu items before adding sub-items.
                </Typography>
                <Link href={`/admin/merchants/${merchantId}/menu/items`}>
                  <Button variant="primary">Create Menu Items</Button>
                </Link>
              </div>
            </Grid.Item>
          </Grid.Container>
        )}

        {items.length > 0 && (
          <>
            {/* Filters Section */}
            <Grid.Container gap="lg" className={styles.subItems__filtersSection}>
              <Grid.Item lg={12} xl={8}>
                <div className={styles.subItems__filters}>
                  <Typography variant="body-medium" style={{ fontWeight: '500' }}>
                    Filter by menu item:
                  </Typography>
                  <select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    className={styles.subItems__itemFilter}
                  >
                    <option value="all">All Items</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.category_name && `(${item.category_name})`}
                      </option>
                    ))}
                  </select>
                </div>
              </Grid.Item>
            </Grid.Container>

            {/* Option Groups List */}
            <Grid.Container gap="lg">
              {isLoading ? (
                <Grid.Item className={styles.subItems__loadingWrapper}>
                  <div className={styles.subItems__loading}>
                    <Typography variant="body-medium">Loading option groups...</Typography>
                  </div>
                </Grid.Item>
              ) : filteredGroups.length === 0 ? (
                <Grid.Item md={12} lg={8}>
                  <div className={styles.subItems__empty}>
                    <Typography variant="heading-5">
                      {selectedItem === 'all' ? 'No option groups yet' : 'No option groups for this item'}
                    </Typography>
                    <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      {selectedItem === 'all' 
                        ? 'Create the first option group for this merchant'
                        : 'Try selecting a different item or create a new option group'
                      }
                    </Typography>
                  </div>
                </Grid.Item>
              ) : (
                filteredGroups.map((group) => (
                  <Grid.Item md={12} lg={8} key={group.id}>
                    <div className={styles.subItems__groupItem}>
                      <div className={styles.subItems__groupHeader}>
                        <div>
                          <Typography variant="heading-4">{group.name}</Typography>
                          <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                            For: {group.menu_item_name} • {group.selection_type} • {group.is_required ? 'Required' : 'Optional'}
                          </Typography>
                        </div>
                      </div>
                      
                      {/* Sub-items within this group */}
                      <div className={styles.subItems__groupItems}>
                        {group.sub_items && group.sub_items.length > 0 ? (
                          <Grid.Container gap="md">
                            {group.sub_items.map((subItem) => (
                              <Grid.Item sm={12} md={6} lg={4} key={subItem.id}>
                                <div className={styles.subItems__item}>
                                  <div className={styles.subItems__itemContent}>
                                    <div className={styles.subItems__itemHeader}>
                                      <Typography variant="heading-6">{subItem.name}</Typography>
                                      <Typography 
                                        variant="body-medium" 
                                        style={{ 
                                          color: subItem.price_adjustment_pence >= 0 ? 'var(--color-success-dark)' : 'var(--color-warning-dark)' 
                                        }}
                                      >
                                        {subItem.price_adjustment_pence >= 0 
                                          ? `+$${(subItem.price_adjustment_pence / 100).toFixed(2)}` 
                                          : `-$${Math.abs(subItem.price_adjustment_pence / 100).toFixed(2)}`
                                        }
                                      </Typography>
                                    </div>
                                    {subItem.description && (
                                      <Typography variant="body-small" style={{ color: 'var(--color-text-secondary)' }}>
                                        {subItem.description}
                                      </Typography>
                                    )}
                                  </div>
                                </div>
                              </Grid.Item>
                            ))}
                          </Grid.Container>
                        ) : (
                          <div className={styles.subItems__emptyGroup}>
                            <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                              No items in this group yet.
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                  </Grid.Item>
                ))
              )}
            </Grid.Container>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}