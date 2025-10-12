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
  merchant_id: string;
  merchant_name?: string;
  item_count: number;
  menu_item_count: number;
  sub_items: SubItem[];
  created_at: string;
  updated_at?: string;
}

interface SubItem {
  id: string;
  name: string;
  description?: string;
  additional_price: number;
  display_order: number;
  is_active: boolean;
  group_id: string;
  created_at: string;
  updated_at?: string;
}

interface Merchant {
  id: string;
  business_name: string;
  name: string;
}

export default function AdminMenuSubItemsPage() {
  const params = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [subItemGroups, setSubItemGroups] = useState<SubItemGroup[]>([]);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const merchantId = params?.merchantId as string;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });

      // Fetch merchant and sub-groups data
      const [merchantResponse, subGroupsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${merchantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sub-groups?merchant_id=${merchantId}`, {
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

      if (subGroupsResponse.ok) {
        const subGroupsData = await subGroupsResponse.json();
        console.log('Sub-groups data received:', subGroupsData);
        
        if (subGroupsData.success && subGroupsData.data) {
          // Fetch detailed sub-groups with items
          const detailedSubGroups = await Promise.all(
            subGroupsData.data.map(async (group: any) => {
              try {
                const detailResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sub-groups/${group.id}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });
                
                if (detailResponse.ok) {
                  const detailData = await detailResponse.json();
                  return detailData.success ? detailData.data : group;
                }
              } catch (error) {
                console.error(`Error fetching details for group ${group.id}:`, error);
              }
              return group;
            })
          );
          
          setSubItemGroups(detailedSubGroups);
          console.log('Final sub-item groups:', detailedSubGroups);
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

  const filteredGroups = selectedFilter === 'all' 
    ? subItemGroups 
    : subItemGroups.filter(group => {
        if (selectedFilter === 'required') return group.is_required;
        if (selectedFilter === 'optional') return !group.is_required;
        if (selectedFilter === 'single') return group.selection_type === 'single';
        if (selectedFilter === 'multiple') return group.selection_type === 'multiple';
        return true;
      });

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

        {/* Option Groups List */}
        <Grid.Container gap="lg">
          {/* Filters Section */}
          <Grid.Container gap="lg" className={styles.subItems__filtersSection}>
            <Grid.Item lg={12} xl={8}>
              <div className={styles.subItems__filters}>
                <Typography variant="body-medium" style={{ fontWeight: '500' }}>
                  Filter option groups:
                </Typography>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className={styles.subItems__itemFilter}
                >
                  <option value="all">All Groups</option>
                  <option value="required">Required Only</option>
                  <option value="optional">Optional Only</option>
                  <option value="single">Single Selection</option>
                  <option value="multiple">Multiple Selection</option>
                </select>
              </div>
            </Grid.Item>
          </Grid.Container>

          {/* Main Content */}
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
                      {selectedFilter === 'all' ? 'No option groups yet' : 'No option groups match the filter'}
                    </Typography>
                    <Typography variant="body-medium" style={{ color: 'var(--color-text-secondary)' }}>
                      {selectedFilter === 'all' 
                        ? 'Create the first option group for this merchant'
                        : 'Try selecting a different filter or create a new option group'
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
                            {group.selection_type} • {group.is_required ? 'Required' : 'Optional'} • Used by {group.menu_item_count} menu items • {group.item_count} options
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
                                          color: subItem.additional_price >= 0 ? 'var(--color-success-dark)' : 'var(--color-warning-dark)' 
                                        }}
                                      >
                                        {subItem.additional_price >= 0 
                                          ? `+$${(subItem.additional_price / 100).toFixed(2)}` 
                                          : `-$${Math.abs(subItem.additional_price / 100).toFixed(2)}`
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
          </Grid.Container>
        </div>
      </ProtectedRoute>
    );
  }