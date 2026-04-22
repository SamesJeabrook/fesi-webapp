"use client";

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Typography, Button, Grid } from '@/components/atoms';
import { AdminPageHeader } from '@/components/molecules';
import api from '@/utils/api';
import Link from 'next/link';
import styles from './adminMerchants.module.scss';

interface Merchant {
  id: string;
  business_name: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  status: string;
  created_at: string;
}

export default function AdminMerchantsPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // Removed QR modal state from listing page

  const fetchMerchants = async () => {
    try {
      setIsLoading(true);
      console.log('🔑 Fetching merchants...');
      console.log('🌐 API URL: /api/merchants');

      const response = await api.get('/api/merchants');

      console.log('📊 Full API Response:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Response.data:', response?.data);
      console.log('📊 Is Array:', Array.isArray(response?.data));
      
      // Handle both response formats - direct array or wrapped in data property
      const merchantsData = Array.isArray(response) ? response : (response?.data || []);
      console.log('📊 Merchants array:', merchantsData);
      console.log('📊 Merchants count:', merchantsData.length);
      
      setMerchants(merchantsData);
    } catch (error) {
      console.error('❌ Error fetching merchants:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMerchants = merchants.filter(merchant =>
    merchant.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('📋 Total merchants:', merchants.length);
  console.log('🔍 Filtered merchants:', filteredMerchants.length);
  console.log('🔎 Search term:', searchTerm);

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
    <ProtectedRoute requireRole={['admin']}>
      <div className={styles.merchants}>
        <AdminPageHeader
          backLink={{
            href: '/admin',
            label: 'Back to Admin Dashboard'
          }}
          adminContext="System administration area"
          title="Merchant Management"
          description="Select a merchant to manage their account and operations"
        />

        {/* Search Section */}
        <Grid.Container gap="lg" justifyContent="start" className={styles.merchants__searchSection}>
          <Grid.Item lg={12} xl={10}>
            <div className={styles.merchants__search}>
              <input
                type="text"
                placeholder="Search merchants by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.merchants__searchInput}
              />
            </div>
          </Grid.Item>
        </Grid.Container>

        {/* Merchants List Section */}
        <Grid.Container gap="lg" justifyContent='start' className={styles.merchants__listSection}>
          {isLoading ? (
            <Grid.Item>
              <div className={styles.merchants__loading}>
                <Typography variant="body-medium">Loading merchants...</Typography>
              </div>
            </Grid.Item>
          ) : filteredMerchants.length === 0 ? (
            <Grid.Item md={12} lg={8}>
              <div className={styles.merchants__empty}>
                <Typography variant="heading-5">
                  {searchTerm ? 'No merchants found' : 'No merchants yet'}
                </Typography>
                <Typography variant="body-medium" style={{ color: 'var(--color-neutral-500)' }}>
                  {searchTerm ? 'Try adjusting your search terms' : 'Merchants will appear here once they register'}
                </Typography>
              </div>
            </Grid.Item>
          ) : (
            filteredMerchants.map((merchant) => (
              <Grid.Item sm={16} md={8} lg={4} key={merchant.id}>
                <Link
                  href={`/admin/merchants/${merchant.id}`}
                  className={styles.merchants__item}
                >
                  <div className={styles.merchants__itemContent}>
                    <div className={styles.merchants__itemHeader}>
                      <Typography variant="heading-5">
                        {merchant.business_name || merchant.name}
                      </Typography>
                      <span className={`${styles.merchants__status} ${
                        merchant.status === 'active' ? styles['merchants__status--active'] : styles['merchants__status--inactive']
                      }`}>
                        {merchant.status}
                      </span>
                    </div>
                    <div className={styles.merchants__itemActions}>
                      <Button variant="primary" size="sm">
                        Manage →
                      </Button>
                    </div>
                  </div>
                </Link>
              </Grid.Item>
            ))
          )}
        </Grid.Container>
      </div>
    </ProtectedRoute>
  );
}